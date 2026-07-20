export type PricingPhase = "earlybird1" | "earlybird2" | "regular";
export type TierKey = "vip" | "premium" | "general";

export type TicketDef = {
  tier: TierKey;
  basePrice: number;
  totalSeats: number;
  benefitKeys: string[];
  addonKeys?: string[];
  /** benefitKeys 중 마감되어 더 이상 제공되지 않는 항목 */
  soldOutKeys?: string[];
};
