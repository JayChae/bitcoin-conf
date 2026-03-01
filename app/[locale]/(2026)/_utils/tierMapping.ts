import type { TierKey } from "../_types/tickets";
import { SECTIONS } from "../_constants/seats";
import { TIER_TO_SEAT_TIER, TIER_SECTIONS } from "../_constants/tierMapping";
import { getSeatTier } from "./seats";

export function isValidTier(tier: string): tier is TierKey {
  return tier === "vip" || tier === "premium" || tier === "general";
}

export function isSectionActiveForTier(
  sectionId: string,
  tier: TierKey,
): boolean {
  return TIER_SECTIONS[tier].includes(sectionId);
}

export function getSelectableCount(sectionId: string, tier: TierKey): number {
  const section = SECTIONS.find((s) => s.id === sectionId);
  if (!section) return 0;
  const seatTier = TIER_TO_SEAT_TIER[tier];
  return section.tierRanges
    .filter((r) => r.tier === seatTier)
    .reduce((sum, r) => sum + (r.to - r.from + 1), 0);
}

export function isSeatSelectable(
  sectionId: string,
  seatNumber: number,
  tier: TierKey,
): boolean {
  return getSeatTier(sectionId, seatNumber) === TIER_TO_SEAT_TIER[tier];
}
