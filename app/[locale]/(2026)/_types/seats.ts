export type SeatTier = "vip" | "premium" | "regular" | "unavailable";

export type SectionConfig = {
  id: string;
  totalSeats: number;
  rows: number[];
  tierRanges: { tier: SeatTier; from: number; to: number }[];
};
