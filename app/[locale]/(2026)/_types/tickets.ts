export type PricingPhase = "earlybird1" | "earlybird2" | "regular";
export type TierKey = "vip" | "premium" | "general";

export type TicketDef = {
  tier: TierKey;
  basePrice: number;
  totalSeats: number;
  benefitKeys: string[];
  addonKeys?: string[];
};
