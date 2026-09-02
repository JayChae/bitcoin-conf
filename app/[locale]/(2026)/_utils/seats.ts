import type { SeatTier, SectionConfig } from "../_types/seats";
import { SECTIONS } from "../_constants/seats";

export function getSeatTier(sectionId: string, seatNumber: number): SeatTier {
  const section = SECTIONS.find((s) => s.id === sectionId);
  if (!section) return "unavailable";
  for (const range of section.tierRanges) {
    if (seatNumber >= range.from && seatNumber <= range.to) return range.tier;
  }
  return "unavailable";
}

export function getSectionPrimaryTier(sectionId: string): SeatTier {
  const section = SECTIONS.find((s) => s.id === sectionId);
  if (!section) return "unavailable";

  let counts: Record<SeatTier, number> = {
    vip: 0,
    premium: 0,
    regular: 0,
    unavailable: 0,
  };
  for (const range of section.tierRanges) {
    counts[range.tier] += range.to - range.from + 1;
  }

  if (counts.vip > 0) return "vip";
  if (counts.premium >= counts.regular) return "premium";
  return "regular";
}

export function getAvailableCount(section: SectionConfig): number {
  return section.tierRanges
    .filter((r) => r.tier !== "unavailable")
    .reduce((sum, r) => sum + (r.to - r.from + 1), 0);
}
