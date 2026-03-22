import type { TicketDef } from "../_types/tickets";

export const AFTER_PARTY_PRICE = 50_000;

export const TICKETS: TicketDef[] = [
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
];
