import type { SeatTier, SectionConfig } from "../_types/seats";

// Row distributions derived from the auditorium PDF layout
// Front rows (closer to stage) have fewer seats, back rows have more
export const SECTIONS: SectionConfig[] = [
  {
    id: "A",
    totalSeats: 95,
    rows: [7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10],
    tierRanges: [
      { tier: "premium", from: 1, to: 65 },
      { tier: "regular", from: 66, to: 95 },
    ],
  },
  {
    id: "B",
    totalSeats: 107,
    rows: [6, 6, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10],
    tierRanges: [
      { tier: "unavailable", from: 1, to: 12 },
      { tier: "premium", from: 13, to: 107 },
    ],
  },
  {
    id: "C",
    totalSeats: 107,
    rows: [6, 6, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10],
    tierRanges: [
      { tier: "vip", from: 1, to: 6 },
      { tier: "unavailable", from: 7, to: 8 },
      { tier: "vip", from: 9, to: 12 },
      { tier: "unavailable", from: 13, to: 19 },
      { tier: "premium", from: 20, to: 107 },
    ],
  },
  {
    id: "D",
    totalSeats: 107,
    rows: [6, 6, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10],
    tierRanges: [
      { tier: "vip", from: 1, to: 11 },
      { tier: "unavailable", from: 12, to: 19 },
      { tier: "premium", from: 20, to: 107 },
    ],
  },
  {
    id: "E",
    totalSeats: 107,
    rows: [6, 6, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10],
    tierRanges: [
      { tier: "unavailable", from: 1, to: 12 },
      { tier: "premium", from: 13, to: 107 },
    ],
  },
  {
    id: "F",
    totalSeats: 95,
    rows: [7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10],
    tierRanges: [
      { tier: "premium", from: 1, to: 65 },
      { tier: "regular", from: 66, to: 95 },
    ],
  },
  {
    id: "G",
    totalSeats: 40,
    rows: [6, 6, 7, 7, 7, 7],
    tierRanges: [{ tier: "regular", from: 1, to: 40 }],
  },
  {
    id: "H",
    totalSeats: 77,
    rows: [8, 8, 8, 9, 9, 9, 9, 7, 10],
    tierRanges: [{ tier: "regular", from: 1, to: 77 }],
  },
  {
    id: "J",
    totalSeats: 76,
    rows: [7, 8, 8, 9, 9, 9, 9, 7, 10],
    tierRanges: [{ tier: "regular", from: 1, to: 76 }],
  },
  {
    id: "K",
    totalSeats: 76,
    rows: [7, 8, 8, 9, 9, 9, 9, 7, 10],
    tierRanges: [{ tier: "regular", from: 1, to: 76 }],
  },
  {
    id: "L",
    totalSeats: 76,
    rows: [7, 8, 8, 9, 9, 9, 9, 7, 10],
    tierRanges: [{ tier: "regular", from: 1, to: 76 }],
  },
  {
    id: "M",
    totalSeats: 77,
    rows: [8, 8, 8, 9, 9, 9, 9, 7, 10],
    tierRanges: [{ tier: "regular", from: 1, to: 77 }],
  },
  {
    id: "N",
    totalSeats: 40,
    rows: [6, 6, 7, 7, 7, 7],
    tierRanges: [{ tier: "regular", from: 1, to: 40 }],
  },
];

export const TIER_COLORS: Record<SeatTier, string> = {
  vip: "#38BDF8",
  premium: "#38BDF8",
  regular: "#38BDF8",
  unavailable: "#374151",
};

export const TIER_BG: Record<SeatTier, string> = {
  vip: "bg-[#38BDF8]",
  premium: "bg-[#38BDF8]",
  regular: "bg-[#38BDF8]",
  unavailable: "bg-gray-700",
};

export const TIER_BORDER: Record<SeatTier, string> = {
  vip: "border-[#38BDF8]/40",
  premium: "border-[#38BDF8]/40",
  regular: "border-[#38BDF8]/40",
  unavailable: "border-gray-700/40",
};

export const TIER_BG_MUTED: Record<SeatTier, string> = {
  vip: "bg-[#38BDF8]/15",
  premium: "bg-[#38BDF8]/15",
  regular: "bg-[#38BDF8]/15",
  unavailable: "bg-gray-700/15",
};
