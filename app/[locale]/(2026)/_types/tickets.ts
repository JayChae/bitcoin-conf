export type PricingPhase = "earlybird1" | "earlybird2" | "regular";

/** 티어 단일 소스. 새 티어는 여기에만 추가한다. UI 노출 순서는 TICKETS 배열이 결정. */
export const TIER_KEYS = ["vip", "premium", "general", "mainday"] as const;
export type TierKey = (typeof TIER_KEYS)[number];

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
 */
export type TicketDef = TicketDefBase &
  (
    | { totalSeats: number; sharesSeatPoolWith?: undefined }
    /** 좌석 재고를 공유하는 상대 티어. 좌석 도식·총좌석 집계의 중복 계산 방지 표식. */
    | { totalSeats?: undefined; sharesSeatPoolWith: TierKey }
  );
