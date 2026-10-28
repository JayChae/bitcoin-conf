export type PricingPhase = "earlybird1" | "earlybird2" | "regular";

/** 티어 단일 소스. 새 티어는 여기에만 추가한다. UI 노출 순서는 TICKETS 배열이 결정. */
export const TIER_KEYS = ["vip", "premium", "general", "mainday", "day2"] as const;
export type TierKey = (typeof TIER_KEYS)[number];

/**
 * 좌석 없이 매수로만 파는 티어. 좌석 도식·잠금·좌석 집계에 들어가지 않는다.
 * 좌석을 다루는 코드는 SeatedTierKey만 받으므로, 여기 넣은 티어가 좌석 경로로 새면 타입 에러가 난다.
 */
export const SEATLESS_TIER_KEYS = ["day2"] as const satisfies readonly TierKey[];
export type SeatlessTierKey = (typeof SEATLESS_TIER_KEYS)[number];
export type SeatedTierKey = Exclude<TierKey, SeatlessTierKey>;

type TicketDefBase = {
  tier: TierKey;
  basePrice: number;
  benefitKeys: string[];
  addonKeys?: string[];
  /** benefitKeys 중 마감되어 더 이상 제공되지 않는 항목 */
  soldOutKeys?: string[];
  /** 부가 설명 번역 키 (학생 카드 description과 동일 위치/스타일) */
  descriptionKey?: string;
  /**
   * 공개 노출과 구매 진입에서만 제외한다 (카드 목록·SEO 최저가·구매 페이지·결제 API).
   * 좌석 집계와 관리자 화면은 그대로 둔다 — 이미 팔린 좌석은 계속 점유 상태여야 하고
   * 관리자는 기존 주문을 볼 수 있어야 한다.
   */
  hidden?: boolean;
};

/**
 * 티어는 좌석 풀을 소유하거나(totalSeats) 남의 풀을 공유한다(sharesSeatPoolWith).
 * 둘 다 갖지 못하게 막아, 공유 티어가 용량을 따로 적어두고 원본과 어긋나는 일을 방지한다.
 * 공유 티어의 실제 점유·잔여는 lib/seat-lock의 getAllSeatSummary가 좌석 풀 단위로 센다.
 * 좌석 없는 티어는 둘 다 갖지 않는다 — 좌석 풀이 없고 판매 상한도 없다.
 */
export type TicketDef = TicketDefBase &
  (
    | { tier: SeatedTierKey; totalSeats: number; sharesSeatPoolWith?: undefined }
    /** 좌석 재고를 공유하는 상대 티어. 좌석 도식·총좌석 집계의 중복 계산 방지 표식. */
    | { tier: SeatedTierKey; totalSeats?: undefined; sharesSeatPoolWith: SeatedTierKey }
    | { tier: SeatlessTierKey; totalSeats?: undefined; sharesSeatPoolWith?: undefined }
  );
