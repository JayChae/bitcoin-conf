import { redis } from "./redis";
import { SECTIONS } from "@/app/[locale]/(2026)/_constants/seats";
import {
  TIER_TO_SEAT_TIER,
  TIER_SECTIONS,
} from "@/app/[locale]/(2026)/_constants/tierMapping";
import { getSeatTier } from "@/app/[locale]/(2026)/_utils/seats";
import type { SeatStatus, SeatStatusInfo, SeatHoldRequest } from "@/app/[locale]/(2026)/_types/seats";
import type { TierKey, PricingPhase } from "@/app/[locale]/(2026)/_types/tickets";

const HOLD_TTL = 7 * 60; // 7 minutes
const CHECKOUT_TTL = 30 * 60; // 30 minutes

const MAX_SEATS: Record<TierKey, number> = {
  vip: 4,
  premium: 10,
  general: 10,
};

function seatKey(section: string, seat: number) {
  return `seat:${section}:${seat}`;
}
function holdsKey(sessionId: string) {
  return `holds:${sessionId}`;
}
function checkoutKey(cartId: string) {
  return `checkout:${cartId}`;
}

// ─── 1. 섹션별 좌석 상태 조회 ───

export async function getSectionStatus(
  section: string,
): Promise<Record<number, SeatStatus>> {
  const cfg = SECTIONS.find((s) => s.id === section);
  if (!cfg) throw new Error(`Unknown section: ${section}`);

  const keys = Array.from({ length: cfg.totalSeats }, (_, i) =>
    seatKey(section, i + 1),
  );

  const values = await redis.mget<(SeatStatusInfo | null)[]>(...keys);

  const result: Record<number, SeatStatus> = {};
  for (let i = 0; i < keys.length; i++) {
    result[i + 1] = values[i]?.status ?? "available";
  }
  return result;
}

// ─── 2. 좌석 임시 잠금 (Lua 스크립트 — 원자적) ───

// Full version with holds key (used by /api/seats/hold with sessionId)
const LUA_HOLD_WITH_SESSION = `
local numSeats = tonumber(ARGV[1])
local sessionId = ARGV[2]
local ttl = tonumber(ARGV[3])

local failed = {}
for i = 1, numSeats do
  local val = redis.call('GET', KEYS[i])
  if val then
    table.insert(failed, i)
  end
end

if #failed > 0 then
  return cjson.encode({ success = false, failed = failed })
end

for i = 1, numSeats do
  redis.call('SET', KEYS[i], ARGV[3 + i], 'EX', ttl)
end

redis.call('SET', KEYS[numSeats + 1], ARGV[3 + numSeats + 1], 'EX', ttl)

return cjson.encode({ success = true })
`;

// Simple version: just check + set seats (used by checkout/create)
const LUA_HOLD_SIMPLE = `
local numSeats = tonumber(ARGV[1])
local ttl = tonumber(ARGV[2])

local failed = {}
for i = 1, numSeats do
  local val = redis.call('GET', KEYS[i])
  if val then
    table.insert(failed, i)
  end
end

if #failed > 0 then
  return cjson.encode({ success = false, failed = failed })
end

for i = 1, numSeats do
  redis.call('SET', KEYS[i], ARGV[2 + i], 'EX', ttl)
end

return cjson.encode({ success = true })
`;

export async function holdSeats(
  seats: SeatHoldRequest[],
  tier: TierKey,
  sessionId?: string,
): Promise<{
  success: boolean;
  error?: string;
  failedSeats?: { section: string; seat: number }[];
}> {
  // Validate seat count
  if (seats.length > MAX_SEATS[tier]) {
    return {
      success: false,
      error: `Maximum ${MAX_SEATS[tier]} seats for ${tier}`,
    };
  }

  // Validate that all seats belong to the requested tier
  const expectedSeatTier = TIER_TO_SEAT_TIER[tier];
  for (const s of seats) {
    const actual = getSeatTier(s.section, s.seat);
    if (actual !== expectedSeatTier) {
      return {
        success: false,
        error: `Seat ${s.section}-${s.seat} is not a ${tier} seat`,
      };
    }
  }

  // Auto-release existing holds (only with sessionId)
  if (sessionId) {
    await releaseHolds(sessionId);
  }

  const seatArgs = seats.map((s) =>
    JSON.stringify({
      status: "held",
      tier,
      afterParty: s.afterParty,
    } satisfies SeatStatusInfo),
  );

  let raw: unknown;

  if (sessionId) {
    // Full mode: includes holds key for session tracking
    const keys = [
      ...seats.map((s) => seatKey(s.section, s.seat)),
      holdsKey(sessionId),
    ];
    const holdsData = JSON.stringify(
      seats.map((s) => ({
        section: s.section,
        seat: s.seat,
        afterParty: s.afterParty,
      })),
    );
    const argv = [
      seats.length.toString(),
      sessionId,
      HOLD_TTL.toString(),
      ...seatArgs,
      holdsData,
    ];
    raw = await redis.eval(LUA_HOLD_WITH_SESSION, keys, argv);
  } else {
    // Simple mode: just hold seats, no session tracking
    const keys = seats.map((s) => seatKey(s.section, s.seat));
    const argv = [seats.length.toString(), HOLD_TTL.toString(), ...seatArgs];
    raw = await redis.eval(LUA_HOLD_SIMPLE, keys, argv);
  }

  const result = typeof raw === "string" ? JSON.parse(raw) : raw;

  if (!result.success) {
    const failedSeats = (result.failed as number[]).map(
      (idx: number) => seats[idx - 1],
    );
    return { success: false, failedSeats };
  }

  return { success: true };
}

// ─── 3. 잠금 해제 (sessionId 기반 — /api/seats/hold 및 /api/seats/release용) ───

const LUA_RELEASE_SEAT = `
local val = redis.call('GET', KEYS[1])
if val then
  local info = cjson.decode(val)
  if info.sessionId == ARGV[1] then
    redis.call('DEL', KEYS[1])
    return 1
  end
end
return 0
`;

export async function releaseHolds(sessionId: string): Promise<void> {
  const holdsData = await redis.get<SeatHoldRequest[]>(holdsKey(sessionId));
  if (!holdsData) return;

  const pipeline = redis.pipeline();
  for (const seat of holdsData) {
    pipeline.eval(LUA_RELEASE_SEAT, [seatKey(seat.section, seat.seat)], [
      sessionId,
    ]);
  }
  pipeline.del(holdsKey(sessionId));
  await pipeline.exec();
}

// ─── 4. 결제 완료 — 좌석 sold 확정 ───

export async function confirmSeats(
  cartId: string,
): Promise<{ confirmed: false } | { confirmed: true; tier: TierKey; seatCount: number; phase: PricingPhase }> {
  const data = await redis.get<{
    seats: SeatHoldRequest[];
    tier: TierKey;
    phase: PricingPhase;
  }>(checkoutKey(cartId));

  if (!data) return { confirmed: false };

  const pipeline = redis.pipeline();
  for (const seat of data.seats) {
    pipeline.set(
      seatKey(seat.section, seat.seat),
      JSON.stringify({
        status: "sold",
        tier: data.tier,
        afterParty: seat.afterParty,
      } satisfies SeatStatusInfo),
    );
  }
  await pipeline.exec();

  return { confirmed: true, tier: data.tier, seatCount: data.seats.length, phase: data.phase };
}

export async function deleteCheckoutMapping(cartId: string): Promise<void> {
  await redis.del(checkoutKey(cartId));
}

// ─── 5. 장바구니 ↔ 좌석 매핑 저장 ───

export async function saveCheckoutMapping(
  cartId: string,
  seats: SeatHoldRequest[],
  tier: TierKey,
  phase: PricingPhase,
): Promise<void> {
  await redis.set(
    checkoutKey(cartId),
    JSON.stringify({ seats, tier, phase }),
    { ex: CHECKOUT_TTL },
  );
}

// ─── 6. 구역별 남은 좌석 수 조회 ───

export async function getRemainingSeatsBySectionForTier(
  tier: TierKey,
): Promise<Record<string, number>> {
  const sectionIds = TIER_SECTIONS[tier];
  const seatTier = TIER_TO_SEAT_TIER[tier];

  const sectionStatuses = await Promise.all(
    sectionIds.map(async (id) => ({ id, seats: await getSectionStatus(id) })),
  );

  const result: Record<string, number> = {};
  for (const { id, seats } of sectionStatuses) {
    const section = SECTIONS.find((s) => s.id === id)!;
    const totalForTier = section.tierRanges
      .filter((r) => r.tier === seatTier)
      .reduce((sum, r) => sum + (r.to - r.from + 1), 0);

    let occupied = 0;
    for (const [num, status] of Object.entries(seats)) {
      if (status === "held" || status === "sold") {
        if (getSeatTier(id, Number(num)) === seatTier) occupied++;
      }
    }
    result[id] = totalForTier - occupied;
  }
  return result;
}
