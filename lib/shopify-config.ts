import type { TierKey, PricingPhase } from "@/app/[locale]/(2026)/_types/tickets";

/**
 * Shopify Storefront API Variant IDs
 *
 * 환경변수:
 *   SHOPIFY_VARIANT_VIP       - VIP Ticket Variant ID (숫자만)
 *   SHOPIFY_VARIANT_PREMIUM   - Premium Ticket Variant ID
 *   SHOPIFY_VARIANT_GENERAL   - General Ticket Variant ID
 *   SHOPIFY_VARIANT_AFTER_PARTY - After Party Variant ID
 *
 * 할인은 Shopify 할인 코드로 적용 (티켓 상품에만, AP 제외)
 */
export const TICKET_VARIANT_IDS: Record<TierKey, string> = {
  vip: `gid://shopify/ProductVariant/${process.env.SHOPIFY_VARIANT_VIP}`,
  premium: `gid://shopify/ProductVariant/${process.env.SHOPIFY_VARIANT_PREMIUM}`,
  general: `gid://shopify/ProductVariant/${process.env.SHOPIFY_VARIANT_GENERAL}`,
};

export const AFTER_PARTY_VARIANT_ID =
  `gid://shopify/ProductVariant/${process.env.SHOPIFY_VARIANT_AFTER_PARTY}`;

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
