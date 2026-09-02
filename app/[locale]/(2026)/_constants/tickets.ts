import type { TicketDef, TierKey } from "../_types/tickets";
import { TIER_KEYS } from "../_types/tickets";

export const AFTER_PARTY_PRICE = 50_000;

export const TICKETS: TicketDef[] = [
  {
    tier: "mainday",
    basePrice: 140_000,
    // 좌석은 제너럴의 regular 풀을 그대로 쓴다 — 용량은 general에서 파생
    sharesSeatPoolWith: "general",
    descriptionKey: "maindayDescription",
    benefitKeys: ["maindayOnly", "mainStage", "translationProvided"],
  },
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
    // 네트워킹 파티 매진 — 애드온 판매 중단
    soldOutKeys: ["networkingPartyNote"],
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
    // 네트워킹 파티 매진 — 애드온 판매 중단
    soldOutKeys: ["networkingPartyNote"],
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

/**
 * 좌석 풀을 공유하는 티어 집합.
 * TICKETS의 sharesSeatPoolWith에서 파생하므로 새 공유 티어를 추가해도 자동 반영된다.
 * 이 집합에 속한 티어는 잔여석을 합산해서 읽으면 안 된다.
 */
export const SHARED_POOL_TIERS: ReadonlySet<TierKey> = new Set(
  TICKETS.flatMap((t) =>
    t.sharesSeatPoolWith ? [t.tier, t.sharesSeatPoolWith] : [],
  ),
);

/**
 * 티어별 입장 가능 일자 (KST, YYYY-MM-DD)와 스캐너 뱃지 문구.
 * 명시되지 않은 티어는 전 일자 입장 가능하다.
 * days는 서버 차단(lib/checkin.ts), badge는 스태프 육안 확인용이다.
 */
export const TIER_VALID_DAYS: Partial<
  Record<TierKey, { days: readonly string[]; badge: string }>
> = {
  mainday: { days: ["2026-11-07"], badge: "NOV 7 ONLY · 11/7 전용" },
};

/**
 * 얼리버드 할인 대상이 아닌 티어 — 항상 정가로 판매된다.
 * lib/pricing과 어드민 대시보드가 함께 참조한다("use client"에서도 안전하도록 여기 둔다).
 */
export const NO_DISCOUNT_TIERS: readonly TierKey[] = ["vip", "mainday"];

/** Phase 2 참여 티어. NO_DISCOUNT_TIERS의 여집합이다. */
export const PHASE2_TIERS: readonly TierKey[] = TIER_KEYS.filter(
  (t) => !NO_DISCOUNT_TIERS.includes(t),
);

/** 어드민·스캐너 표기용 라벨 중 단순 대문자화로 얻을 수 없는 것만 정의한다 */
const TIER_LABEL_OVERRIDES: Partial<Record<TierKey, string>> = {
  mainday: "MAIN DAY",
};

/** 알 수 없거나 비어 있는 티어 값도 안전하게 처리하는 라벨 조회 */
export function tierLabel(tier: string | undefined | null): string {
  if (!tier) return "";
  return TIER_LABEL_OVERRIDES[tier as TierKey] ?? tier.toUpperCase();
}
