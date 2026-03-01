import type { TierKey } from "@/app/[locale]/(2026)/_components/Tickets/tickets";
import {
  type SeatTier,
  SECTIONS,
  getSeatTier,
} from "@/app/[locale]/(2026)/_components/SeatMap/seatData";

export const TIER_TO_SEAT_TIER: Record<TierKey, SeatTier> = {
  vip: "vip",
  premium: "premium",
  general: "regular",
};

export const TIER_SECTIONS: Record<TierKey, string[]> = {
  vip: ["C", "D"],
  premium: ["A", "B", "C", "D", "E", "F"],
  general: ["G", "H", "J", "K", "L", "M", "N"],
};

export function isValidTier(tier: string): tier is TierKey {
  return tier === "vip" || tier === "premium" || tier === "general";
}

export function isSectionActiveForTier(sectionId: string, tier: TierKey): boolean {
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
