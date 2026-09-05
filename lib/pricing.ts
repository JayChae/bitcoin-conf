import { redis } from "./redis";
import { TIER_KEYS } from "@/app/[locale]/(2026)/_types/tickets";
import {
  NO_DISCOUNT_TIERS,
  PHASE2_TIERS,
} from "@/app/[locale]/(2026)/_constants/tickets";
import type { PricingPhase, TierKey } from "@/app/[locale]/(2026)/_types/tickets";

// 할인 대상 티어 정의는 "use client" 어드민에서도 읽으므로 _constants/tickets에 산다.
export { NO_DISCOUNT_TIERS, PHASE2_TIERS };

// ─── Redis Data Structures ───

export type SaleStatus = "upcoming" | "open" | "closed";

export type PricingConfig = {
  phase1: {
    startDate: string; // ISO 8601
    endDate: string;
    enabled: boolean;
  };
  phase2: {
    maxTickets: Partial<Record<TierKey, number>>;
    enabled: boolean;
  };
  override: PricingPhase | null;
  saleStatus: SaleStatus;
};

const PRICING_CONFIG_KEY = "pricing:config";
const phase2SoldKey = (tier: TierKey) => `pricing:phase2_sold:${tier}`;
const phaseSoldKey = (phase: PricingPhase, tier: TierKey) =>
  `pricing:phase_sold:${phase}:${tier}`;

// ─── Default Config ───

const DEFAULT_CONFIG: PricingConfig = {
  phase1: {
    startDate: "2026-04-01T00:00:00+09:00",
    endDate: "2026-04-30T23:59:59+09:00",
    enabled: false,
  },
  phase2: {
    maxTickets: { premium: 100, general: 100 },
    enabled: false,
  },
  override: null,
  saleStatus: "upcoming",
};

// ─── Phase Determination ───

/**
 * 티어의 현재 판매 단계.
 * config를 이미 읽은 호출자는 그대로 넘겨 pricing:config 재조회를 피한다.
 */
export async function getCurrentPhase(
  tier?: TierKey,
  presetConfig?: PricingConfig,
): Promise<PricingPhase> {
  // VIP·Main Day는 모든 얼리버드 할인 대상 아님 — 항상 정가
  if (tier && NO_DISCOUNT_TIERS.includes(tier)) return "regular";

  const config = presetConfig ?? (await getPricingConfig());

  // Manual override takes priority
  if (config.override) return config.override;

  const now = new Date();

  // Phase 1: time-limited
  if (
    config.phase1.enabled &&
    now >= new Date(config.phase1.startDate) &&
    now <= new Date(config.phase1.endDate)
  ) {
    return "earlybird1";
  }

  // Phase 2: quantity-limited (premium, general only — VIP skips Phase 2)
  if (config.phase2.enabled && tier && PHASE2_TIERS.includes(tier)) {
    const sold = (await redis.get<number>(phase2SoldKey(tier))) ?? 0;
    const max = config.phase2.maxTickets[tier] ?? 0;
    if (sold < max) {
      return "earlybird2";
    }
  }

  return "regular";
}

// ─── Sale Status ───

export async function getSaleStatus(): Promise<SaleStatus> {
  const config = await getPricingConfig();
  return config.saleStatus ?? "upcoming";
}

// ─── Config CRUD ───

export async function getPricingConfig(): Promise<PricingConfig> {
  const config = await redis.get<PricingConfig>(PRICING_CONFIG_KEY);
  return config ?? DEFAULT_CONFIG;
}

export async function savePricingConfig(config: PricingConfig): Promise<void> {
  await redis.set(PRICING_CONFIG_KEY, config);
}

// ─── Phase 2 Counter ───

export async function getPhase2Sold(tier: TierKey): Promise<number> {
  return (await redis.get<number>(phase2SoldKey(tier))) ?? 0;
}

export async function incrementPhase2Sold(
  tier: TierKey,
  count: number,
): Promise<void> {
  await redis.incrby(phase2SoldKey(tier), count);
}

// ─── Phase Sold Counter (all phases) ───

export async function incrementPhaseSold(
  phase: PricingPhase,
  tier: TierKey,
  count: number,
): Promise<void> {
  await redis.incrby(phaseSoldKey(phase, tier), count);
}

const PHASES: PricingPhase[] = ["earlybird1", "earlybird2", "regular"];

export async function getAllPhaseSold(): Promise<
  Record<PricingPhase, Record<TierKey, number>>
> {
  const keys = PHASES.flatMap((p) => TIER_KEYS.map((t) => phaseSoldKey(p, t)));
  // 티어 수만큼 늘어나는 개별 GET 대신 한 번의 MGET
  const values = await redis.mget<(number | null)[]>(...keys);

  let i = 0;
  const result = {} as Record<PricingPhase, Record<TierKey, number>>;
  for (const phase of PHASES) {
    result[phase] = {} as Record<TierKey, number>;
    for (const tier of TIER_KEYS) {
      result[phase][tier] = values[i++] ?? 0;
    }
  }
  return result;
}

// ─── Discount helpers ───

const DISCOUNTS: Record<PricingPhase, number> = {
  earlybird1: 0.2,
  earlybird2: 0.1,
  regular: 0,
};

export function getDiscountRate(phase: PricingPhase): number {
  return DISCOUNTS[phase];
}

export function calcDiscountedPrice(
  basePrice: number,
  phase: PricingPhase,
): number {
  return Math.round(basePrice * (1 - DISCOUNTS[phase]));
}
