import { redis } from "./redis";
import { SECTIONS } from "@/app/[locale]/(2026)/_constants/seats";
import {
  TIER_TO_SEAT_TIER,
  TIER_SECTIONS,
  DEFAULT_TIER_FOR_POOL,
} from "@/app/[locale]/(2026)/_constants/tierMapping";
import { isSeatlessTier } from "@/app/[locale]/(2026)/_constants/tickets";
import { SEATLESS_TIER_KEYS, TIER_KEYS } from "@/app/[locale]/(2026)/_types/tickets";
import { getSeatTier } from "@/app/[locale]/(2026)/_utils/seats";
import type { SeatStatus, SeatStatusInfo, SeatHoldRequest } from "@/app/[locale]/(2026)/_types/seats";
import type {
  TierKey,
  PricingPhase,
  SeatedTierKey,
  SeatlessTierKey,
} from "@/app/[locale]/(2026)/_types/tickets";

const HOLD_TTL = 30 * 60; // 30 minutes
const CHECKOUT_TTL = 3 * 60 * 60; // 3 hours
// 좌석 없는 주문은 잡아둔 좌석이 없어 결제를 오래 미뤄도 막을 이유가 없다.
// 매핑이 먼저 사라져 판매 기록이 빠지지 않도록 넉넉히 둔다.
const SEATLESS_CHECKOUT_TTL = 14 * 24 * 60 * 60; // 14 days

const MAX_SEATS: Record<SeatedTierKey, number> = {
  vip: 4,
  premium: 10,
  general: 10,
  mainday: 10,
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
/** 좌석 없는 티어의 판매 기록. 필드는 QR의 cid, 값은 { quantity, email }. */
function seatlessSoldKey(tier: SeatlessTierKey) {
  return `sold:${tier}`;
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
  tier: SeatedTierKey,
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

// ─── 2-1. 체크아웃 카트 ID 스탬프 + TTL 연장 ───

const LUA_STAMP_CART_ID = `
local numSeats = tonumber(ARGV[1])
local cartId = ARGV[2]
local extendedTTL = tonumber(ARGV[3])

for i = 1, numSeats do
  local val = redis.call('GET', KEYS[i])
  if val then
    local info = cjson.decode(val)
    if info.status == 'held' then
      info.cartId = cartId
      redis.call('SET', KEYS[i], cjson.encode(info), 'EX', extendedTTL)
    end
  end
end

return cjson.encode({ success = true })
`;

export async function stampCartIdOnSeats(
  seats: SeatHoldRequest[],
  cartId: string,
): Promise<void> {
  const keys = seats.map((s) => seatKey(s.section, s.seat));
  await redis.eval(LUA_STAMP_CART_ID, keys, [
    seats.length.toString(),
    cartId,
    CHECKOUT_TTL.toString(),
  ]);
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

// ─── 4. 결제 완료 — 좌석 sold 확정 (Lua 원자적 처리) ───

// 소유권 검증 포함 좌석 확정:
// - sold → 거부 (already_sold)
// - held + 다른 cartId → 거부 (held_by_other)
// - held + 같은 cartId / cartId 없음(레거시) / nil(만료) → 허용
const LUA_CONFIRM_SEATS = `
local numSeats = tonumber(ARGV[1])
local cartId = ARGV[2]
local failed = {}
local reasons = {}

for i = 1, numSeats do
  local val = redis.call('GET', KEYS[i])
  if val then
    local info = cjson.decode(val)
    if info.status == 'sold' then
      table.insert(failed, i)
      table.insert(reasons, 'already_sold')
    elseif info.status == 'held' and info.cartId and info.cartId ~= cartId then
      table.insert(failed, i)
      table.insert(reasons, 'held_by_other')
    end
  end
end

if #failed > 0 then
  return cjson.encode({ success = false, failed = failed, reasons = reasons })
end

for i = 1, numSeats do
  redis.call('SET', KEYS[i], ARGV[2 + i])
end

return cjson.encode({ success = true })
`;

export type ConfirmFailureReason = "mapping_expired" | "already_sold" | "held_by_other";

type SeatCheckoutMapping = {
  seats: SeatHoldRequest[];
  tier: SeatedTierKey;
  phase: PricingPhase;
};

/** 좌석 없는 주문의 매핑. checkoutId는 이 주문 QR들의 cid다. */
type SeatlessCheckoutMapping = {
  tier: SeatlessTierKey;
  phase: PricingPhase;
  checkoutId: string;
  quantity: number;
};

type SeatlessSale = { quantity: number; email?: string };

/**
 * 결제 완료된 장바구니를 확정한다. seatCount는 좌석 없는 주문이면 매수다.
 */
export async function confirmSeats(
  cartId: string,
  email?: string,
): Promise<
  | { confirmed: false; reason: ConfirmFailureReason }
  | { confirmed: true; tier: TierKey; seatCount: number; phase: PricingPhase }
> {
  const data = await redis.get<SeatCheckoutMapping | SeatlessCheckoutMapping>(
    checkoutKey(cartId),
  );

  if (!data) return { confirmed: false, reason: "mapping_expired" };

  // 좌석 없는 주문은 다툴 좌석이 없으니 판매 기록만 남긴다.
  // 같은 웹훅이 다시 와도 sold:{tier}는 같은 필드를 덮어쓸 뿐이라 판매 기록은 이중으로 남지 않는다.
  if (!("seats" in data)) {
    const sale: SeatlessSale = { quantity: data.quantity, ...(email && { email }) };
    await redis.hset(seatlessSoldKey(data.tier), {
      [data.checkoutId]: JSON.stringify(sale),
    });
    return { confirmed: true, tier: data.tier, seatCount: data.quantity, phase: data.phase };
  }

  const keys = data.seats.map((s) => seatKey(s.section, s.seat));
  const seatArgs = data.seats.map((seat) =>
    JSON.stringify({
      status: "sold",
      tier: data.tier,
      afterParty: seat.afterParty,
      ...(email && { email }),
    } satisfies SeatStatusInfo),
  );

  const raw = await redis.eval(
    LUA_CONFIRM_SEATS,
    keys,
    [data.seats.length.toString(), cartId, ...seatArgs],
  );

  const result = typeof raw === "string" ? JSON.parse(raw) : raw;
  if (!result.success) {
    const reasons = (result.reasons as string[]) ?? [];
    const reason: ConfirmFailureReason = reasons.includes("already_sold")
      ? "already_sold"
      : "held_by_other";
    console.error("[confirmSeats] failed:", { failed: result.failed, reasons, cartId });
    return { confirmed: false, reason };
  }

  return { confirmed: true, tier: data.tier, seatCount: data.seats.length, phase: data.phase };
}

export async function deleteCheckoutMapping(cartId: string): Promise<void> {
  await redis.del(checkoutKey(cartId));
}

// ─── 4-1. 좌석 즉시 해제 (Shopify 체크아웃 생성 실패 시) ───

export async function releaseSeats(seats: SeatHoldRequest[]): Promise<void> {
  if (seats.length === 0) return;
  const keys = seats.map((s) => seatKey(s.section, s.seat));
  await redis.del(...keys);
}

// ─── 5. 장바구니 ↔ 좌석 매핑 저장 ───

export async function saveCheckoutMapping(
  cartId: string,
  seats: SeatHoldRequest[],
  tier: SeatedTierKey,
  phase: PricingPhase,
): Promise<void> {
  await redis.set(
    checkoutKey(cartId),
    JSON.stringify({ seats, tier, phase } satisfies SeatCheckoutMapping),
    { ex: CHECKOUT_TTL },
  );
}

export async function saveSeatlessCheckoutMapping(
  cartId: string,
  tier: SeatlessTierKey,
  phase: PricingPhase,
  checkoutId: string,
  quantity: number,
): Promise<void> {
  await redis.set(
    checkoutKey(cartId),
    JSON.stringify({ tier, phase, checkoutId, quantity } satisfies SeatlessCheckoutMapping),
    { ex: SEATLESS_CHECKOUT_TTL },
  );
}

// ─── 6. 전체 좌석 요약 (관리자용) ───

/**
 * 판매된 표 한 장. 좌석 없는 티켓은 section에 티어 키, seat에 주문 안 순번이 들어가므로
 * 주문끼리 겹친다 — cid로 구분한다.
 */
export type SoldSeatRecord = {
  section: string;
  seat: number;
  /** 좌석 없는 티켓만. QR의 cid(주문 단위). */
  cid?: string;
  tier: string;
  afterParty: boolean;
  email?: string;
  checkedIn: boolean;
  checkedInAt?: string;
};

/** 좌석 없는 티어는 sold만 의미가 있고 나머지는 0이다. */
export type TierSummary = {
  /** 이 티어가 쓰는 물리 좌석 풀의 용량. 풀을 공유하는 티어끼리 같은 값. */
  total: number;
  /** 이 티어로 판매된 좌석 수. */
  sold: number;
  /** 풀 전체 판매 수. 풀을 공유하는 티어끼리 같은 값. */
  poolSold: number;
  /** 풀 잔여 좌석. 풀을 공유하는 티어끼리 같은 값이므로 합산하면 안 된다. */
  remaining: number;
};

export type SeatSummary = {
  byTier: Record<string, TierSummary>;
  afterPartyCount: number;
  checkedInCount: number;
  fillRate: number;
  soldSeats: SoldSeatRecord[];
};

export async function getAllSeatSummary(): Promise<SeatSummary> {
  // Fetch seat statuses, check-in records and seatless sales in parallel
  const [allStatuses, checkinMap, seatlessSales] = await Promise.all([
    Promise.all(
      SECTIONS.map(async (cfg) => {
        const keys = Array.from({ length: cfg.totalSeats }, (_, i) =>
          seatKey(cfg.id, i + 1),
        );
        const values = await redis.mget<(SeatStatusInfo | null)[]>(...keys);
        return { section: cfg, values };
      }),
    ),
    buildCheckinMap(),
    Promise.all(
      SEATLESS_TIER_KEYS.map(async (tier) => ({
        tier,
        sales: (await redis.hgetall<Record<string, SeatlessSale>>(seatlessSoldKey(tier))) ?? {},
      })),
    ),
  ]);

  // 용량·판매는 물리 좌석 풀(SeatTier) 단위로 1회만 센다 — 공유 티어 이중 계산 방지
  const poolTotal: Record<string, number> = {};
  const poolSold: Record<string, number> = {};
  const byTier = Object.fromEntries(
    TIER_KEYS.map((tier) => [
      tier,
      { total: 0, sold: 0, poolSold: 0, remaining: 0 } as TierSummary,
    ]),
  ) as Record<string, TierSummary>;

  let afterPartyCount = 0;
  let checkedInCount = 0;
  let totalAvailable = 0;
  let totalSold = 0;
  const soldSeats: SoldSeatRecord[] = [];

  for (const { section, values } of allStatuses) {
    for (let i = 0; i < values.length; i++) {
      const seatNumber = i + 1;
      const seatTier = getSeatTier(section.id, seatNumber);

      if (seatTier === "unavailable") continue;

      poolTotal[seatTier] = (poolTotal[seatTier] ?? 0) + 1;
      totalAvailable++;

      const info = values[i];
      if (info?.status === "sold") {
        // 저장된 구매 티어를 쓰되, 좌석 풀이 일치할 때만 신뢰 (레거시/오염 방어)
        const stored = info.tier as TierKey | undefined;
        const soldTier =
          stored && !isSeatlessTier(stored) && TIER_TO_SEAT_TIER[stored] === seatTier
            ? stored
            : DEFAULT_TIER_FOR_POOL[seatTier];

        poolSold[seatTier] = (poolSold[seatTier] ?? 0) + 1;
        byTier[soldTier].sold++;
        totalSold++;
        if (info.afterParty) afterPartyCount++;

        const checkedInAt = checkinMap.get(`${section.id}:${seatNumber}`);
        if (checkedInAt) checkedInCount++;

        soldSeats.push({
          section: section.id,
          seat: seatNumber,
          tier: soldTier,
          afterParty: info.afterParty ?? false,
          email: info.email,
          checkedIn: !!checkedInAt,
          checkedInAt,
        });
      }
    }
  }

  for (const tier of TIER_KEYS) {
    if (isSeatlessTier(tier)) continue;
    const pool = TIER_TO_SEAT_TIER[tier];
    byTier[tier].total = poolTotal[pool] ?? 0;
    byTier[tier].poolSold = poolSold[pool] ?? 0;
    byTier[tier].remaining = byTier[tier].total - byTier[tier].poolSold;
  }

  // 좌석 없는 티켓은 좌석 점유율(fillRate)에 넣지 않고, 판매·체크인 수와 구매 내역에만 더한다
  for (const { tier, sales } of seatlessSales) {
    for (const [cid, sale] of Object.entries(sales)) {
      byTier[tier].sold += sale.quantity;
      for (let n = 1; n <= sale.quantity; n++) {
        const checkedInAt = checkinMap.get(`${cid}:${tier}:${n}`);
        if (checkedInAt) checkedInCount++;
        soldSeats.push({
          section: tier,
          seat: n,
          cid,
          tier,
          afterParty: false,
          email: sale.email,
          checkedIn: !!checkedInAt,
          checkedInAt,
        });
      }
    }
  }

  const fillRate = totalAvailable > 0
    ? Math.round((totalSold / totalAvailable) * 1000) / 10
    : 0;

  return { byTier, afterPartyCount, checkedInCount, fillRate, soldSeats };
}

/**
 * Scan all checkin:* keys and build a Map<"section:seat", timestamp>.
 * 좌석 없는 티켓은 주문마다 1번부터 번호를 매기므로 "cid:section:seat"로 담는다.
 */
async function buildCheckinMap(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const checkinKeys = await redis.keys("checkin:*");
  if (checkinKeys.length === 0) return map;

  const values = await redis.mget<(string | null)[]>(...checkinKeys);
  for (let i = 0; i < checkinKeys.length; i++) {
    const ts = values[i];
    if (!ts) continue;
    // key format: checkin:{cid}:{section}:{seat}:{YYYY-MM-DD}
    const parts = checkinKeys[i].split(":");
    if (parts.length >= 4) {
      const [, cid, section, seat] = parts;
      // 좌석당 날짜별 키가 여러 개이므로 최초 체크인 시각을 남긴다
      const mapKey = isSeatlessTier(section)
        ? `${cid}:${section}:${seat}`
        : `${section}:${seat}`;
      const existing = map.get(mapKey);
      if (!existing || ts < existing) map.set(mapKey, ts);
    }
  }
  return map;
}

// ─── 7. 구역별 남은 좌석 수 조회 ───

export async function getRemainingSeatsBySectionForTier(
  tier: SeatedTierKey,
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
