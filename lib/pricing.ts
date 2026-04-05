import { redis } from "./redis";
import type { PricingPhase, TierKey } from "@/app/[locale]/(2026)/_types/tickets";

// ─── Redis Data Structures ───

export type PricingConfig = {
  phase1: {
    startDate: string; // ISO 8601
    endDate: string;
    enabled: boolean;
  };
  phase2: {
    maxTickets: Record<TierKey, number>;
    enabled: boolean;
  };
  override: PricingPhase | null;
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
    maxTickets: { vip: 10, premium: 100, general: 100 },
    enabled: false,
  },
  override: null,
};

// ─── Phase Determination ───

export async function getCurrentPhase(tier?: TierKey): Promise<PricingPhase> {
  const config = await getPricingConfig();

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

  // Phase 2: quantity-limited (per tier)
  if (config.phase2.enabled && tier) {
    const sold = (await redis.get<number>(phase2SoldKey(tier))) ?? 0;
    const max = config.phase2.maxTickets[tier] ?? 0;
    if (sold < max) {
      return "earlybird2";
    }
  }

  return "regular";
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

const TIERS: TierKey[] = ["vip", "premium", "general"];
const PHASES: PricingPhase[] = ["earlybird1", "earlybird2", "regular"];

export async function getAllPhaseSold(): Promise<
  Record<PricingPhase, Record<TierKey, number>>
> {
  const keys = PHASES.flatMap((p) => TIERS.map((t) => phaseSoldKey(p, t)));
  const values = await Promise.all(keys.map((k) => redis.get<number>(k)));

  let i = 0;
  const result = {} as Record<PricingPhase, Record<TierKey, number>>;
  for (const phase of PHASES) {
    result[phase] = {} as Record<TierKey, number>;
    for (const tier of TIERS) {
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
