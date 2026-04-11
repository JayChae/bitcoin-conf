import type { TicketDef } from "../_types/tickets";

export const AFTER_PARTY_PRICE = 50_000;

export const TICKETS: TicketDef[] = [
  {
    tier: "general",
    basePrice: 240_000,
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
  {
    tier: "premium",
    basePrice: 300_000,
    totalSeats: 496,
    benefitKeys: [
      "includesGeneral",
      "welcomeGift",
      "centerSeats",
      "speakerMaterials",
      "networkingPartyNote",
    ],
    addonKeys: ["afterPartyOption"],
  },
  {
    tier: "vip",
    basePrice: 2_400_000,
    totalSeats: 21,
    benefitKeys: [
      "includesPremium",
      "loungeAccess",
      "fastEntry",
      "frontSeats",
      "vipDinnerParty",
      "allBtcWeekEvents",
      "afterPartyFree",
    ],
  },
];
