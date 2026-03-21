import type { PricingPhase, TicketDef } from "../_types/tickets";

// ============================================
// 이 값만 변경하면 전체 가격이 자동 전환됩니다
// ============================================
export const CURRENT_PHASE: PricingPhase = "earlybird1";

export const DISCOUNTS: Record<PricingPhase, number> = {
  earlybird1: 0.2,
  earlybird2: 0.1,
  regular: 0,
};

export const AFTER_PARTY_PRICE = 50_000;

export const TICKETS: TicketDef[] = [
  {
    tier: "vip",
    basePrice: 3_000_000,
    totalSeats: 21,
    benefitKeys: [
      "includesPremium",
      "fastEntry",
      "frontSeats",
      "vipDinnerParty",
      "allBtcWeekEvents",
    ],
  },
  {
    tier: "premium",
    basePrice: 330_000,
    totalSeats: 496,
    benefitKeys: [
      "includesGeneral",
      "welcomeGift",
      "centerSeats",
      "loungeAccess",
      "speakerMaterials",
    ],
    addonKeys: ["afterPartyOption"],
  },
  {
    tier: "general",
    basePrice: 210_000,
    totalSeats: 522,
    benefitKeys: [
      "mainStage",
      "workshopStage",
      "lightningMarket",
      "networkingPartyNote",
      "translationProvided",
    ],
    addonKeys: ["afterPartyOption"],
  },
];
