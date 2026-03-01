export type PricingPhase = "earlybird1" | "earlybird2" | "regular";
export type TierKey = "vip" | "premium" | "general";

// ============================================
// 이 값만 변경하면 전체 가격이 자동 전환됩니다
// ============================================
export const CURRENT_PHASE: PricingPhase = "earlybird1";

const DISCOUNTS: Record<PricingPhase, number> = {
  earlybird1: 0.2,
  earlybird2: 0.1,
  regular: 0,
};

export type TicketDef = {
  tier: TierKey;
  basePrice: number;
  totalSeats: number;
  benefitKeys: string[];
  addonKeys?: string[];
};

export const TICKETS: TicketDef[] = [
  {
    tier: "vip",
    basePrice: 3_000_000,
    totalSeats: 21,
    benefitKeys: [
      "welcomeGift",
      "fastEntry",
      "frontSeats",
      "lunchWithSpeakers",
      "lunchSpecial",
      "speakerMaterials",
      "workshopPriority",
      "dinnerParty",
      "afterParty",
      "seating",
    ],
  },
  {
    tier: "premium",
    basePrice: 330_000,
    totalSeats: 512,
    benefitKeys: [
      "welcomeGift",
      "centerSeats",
      "lunchProvided",
      "speakerMaterials",
      "workshopPriority",
    ],
    addonKeys: ["afterPartyOption"],
  },
  {
    tier: "general",
    basePrice: 210_000,
    totalSeats: 506,
    benefitKeys: ["lunchProvided"],
    addonKeys: ["afterPartyOption"],
  },
];

export function getDiscountedPrice(basePrice: number): number {
  return Math.round(basePrice * (1 - DISCOUNTS[CURRENT_PHASE]));
}

export function isDiscounted(): boolean {
  return DISCOUNTS[CURRENT_PHASE] > 0;
}

export function formatKRW(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale === "ko" ? "ko-KR" : "en-US").format(
    amount
  );
}
