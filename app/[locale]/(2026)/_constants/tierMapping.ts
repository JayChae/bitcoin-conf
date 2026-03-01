import type { TierKey } from "../_types/tickets";
import type { SeatTier } from "../_types/seats";

export const TIER_TO_SEAT_TIER: Record<TierKey, SeatTier> = {
  vip: "vip",
  premium: "premium",
  general: "regular",
};

export const TIER_SECTIONS: Record<TierKey, string[]> = {
  vip: ["C", "D"],
  premium: ["A", "B", "C", "D", "E", "F"],
  general: ["A", "G", "H", "J", "K", "L", "M", "N", "F"],
};
