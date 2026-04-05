export type SeatTier = "vip" | "premium" | "regular" | "unavailable";

export type SectionConfig = {
  id: string;
  totalSeats: number;
  rows: number[];
  tierRanges: { tier: SeatTier; from: number; to: number }[];
};

export type SeatStatus = "available" | "held" | "sold";

export type SeatStatusInfo = {
  status: SeatStatus;
  tier?: string;
  afterParty?: boolean;
  email?: string;
};

export type SeatHoldRequest = {
  section: string;
  seat: number;
  afterParty: boolean;
};
