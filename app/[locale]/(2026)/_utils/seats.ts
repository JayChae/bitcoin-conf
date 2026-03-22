import type { SeatTier, SectionConfig } from "../_types/seats";
import type { TierKey } from "../_types/tickets";
import { SECTIONS } from "../_constants/seats";
import { TIER_SECTIONS } from "../_constants/tierMapping";
import { TICKETS } from "../_constants/tickets";
import { getSectionStatus } from "@/lib/seat-lock";

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

const SEAT_TIER_TO_TICKET_TIER: Partial<Record<SeatTier, TierKey>> = {
  vip: "vip",
  premium: "premium",
  regular: "general",
};

export async function getRemainingSeatsByTier(): Promise<Record<TierKey, number>> {
  const fallback: Record<TierKey, number> = {
    vip: TICKETS.find((t) => t.tier === "vip")!.totalSeats,
    premium: TICKETS.find((t) => t.tier === "premium")!.totalSeats,
    general: TICKETS.find((t) => t.tier === "general")!.totalSeats,
  };

  try {
    const allSections = new Set<string>();
    for (const sections of Object.values(TIER_SECTIONS)) {
      sections.forEach((s) => allSections.add(s));
    }

    const statuses = await Promise.all(
      [...allSections].map(async (id) => ({ id, seats: await getSectionStatus(id) })),
    );

    const occupied: Record<TierKey, number> = { vip: 0, premium: 0, general: 0 };

    for (const { id, seats } of statuses) {
      for (const [num, status] of Object.entries(seats)) {
        if (status !== "held" && status !== "sold") continue;
        const seatTier = getSeatTier(id, Number(num));
        const ticketTier = SEAT_TIER_TO_TICKET_TIER[seatTier];
        if (ticketTier) occupied[ticketTier]++;
      }
    }

    return {
      vip: fallback.vip - occupied.vip,
      premium: fallback.premium - occupied.premium,
      general: fallback.general - occupied.general,
    };
  } catch {
    return fallback;
  }
}
