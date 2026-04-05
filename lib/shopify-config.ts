import type { TierKey, PricingPhase } from "@/app/[locale]/(2026)/_types/tickets";

/**
 * Shopify Storefront API Variant IDs
 * 조회일: 2026-03-21
 *
 *   VIP Ticket      → 48806870352114   ₩3,000,000
 *   Premium Ticket  → 48892186296562   ₩330,000
 *   General Ticket  → 48806870450418   ₩210,000
 *   After Party     → 48892186329330   ₩50,000
 *
 * 할인은 Shopify 할인 코드로 적용 (티켓 상품에만, AP 제외)
 */
export const TICKET_VARIANT_IDS: Record<TierKey, string> = {
  vip: "gid://shopify/ProductVariant/48806870352114",
  premium: "gid://shopify/ProductVariant/48892186296562",
  general: "gid://shopify/ProductVariant/48806870450418",
};

export const AFTER_PARTY_VARIANT_ID =
  "gid://shopify/ProductVariant/48892186329330";

/**
 * Shopify 할인 코드 매핑
 * Shopify Admin에서 생성한 코드명과 일치해야 합니다.
 * 할인 대상: 티켓 상품만 (After Party 제외)
 */
export const DISCOUNT_CODES: Record<PricingPhase, string | null> = {
  earlybird1: "EARLYBIRD20",
  earlybird2: "EARLYBIRD10",
  regular: null,
};
