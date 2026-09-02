import type { TierKey, PricingPhase } from "@/app/[locale]/(2026)/_types/tickets";

/**
 * Shopify Storefront API Variant IDs
 *
 * 환경변수:
 *   SHOPIFY_VARIANT_VIP       - VIP Ticket Variant ID (숫자만)
 *   SHOPIFY_VARIANT_PREMIUM   - Premium Ticket Variant ID
 *   SHOPIFY_VARIANT_GENERAL   - General Ticket Variant ID
 *   SHOPIFY_VARIANT_MAINDAY   - Main Day Ticket Variant ID
 *   SHOPIFY_VARIANT_AFTER_PARTY - After Party Variant ID
 *
 * 할인은 Shopify 할인 코드로 적용 (티켓 상품에만, AP 제외)
 */
const TIER_ENV_VARS: Record<TierKey, string> = {
  vip: "SHOPIFY_VARIANT_VIP",
  premium: "SHOPIFY_VARIANT_PREMIUM",
  general: "SHOPIFY_VARIANT_GENERAL",
  mainday: "SHOPIFY_VARIANT_MAINDAY",
};

const AFTER_PARTY_ENV_VAR = "SHOPIFY_VARIANT_AFTER_PARTY";

function readVariantId(envVar: string): string | null {
  const raw = process.env[envVar]?.trim();
  return raw ? `gid://shopify/ProductVariant/${raw}` : null;
}

/**
 * 환경변수가 없으면 `.../undefined` 같은 잘못된 gid를 만들어 결제 단계에서
 * 정체불명의 실패를 내는 대신, 원인을 밝힌 에러로 즉시 실패한다.
 */
function requireVariantId(envVar: string, label: string): string {
  const id = readVariantId(envVar);
  if (!id) {
    throw new Error(
      `Missing ${envVar} — ${label}의 Shopify variant가 등록되지 않았습니다.`,
    );
  }
  return id;
}

/**
 * 해당 티어가 구매 가능한지 여부.
 * Shopify 상품이 아직 등록되지 않아 환경변수가 비어 있으면 false —
 * 이 경우 카드를 마감 상태로 내려 결제 진입 자체를 막는다.
 */
export function isTierPurchasable(tier: TierKey): boolean {
  return !!process.env[TIER_ENV_VARS[tier]]?.trim();
}

/** 티어의 Shopify variant ID. */
export function getTicketVariantId(tier: TierKey): string {
  return requireVariantId(TIER_ENV_VARS[tier], `"${tier}" 티켓`);
}

export function getAfterPartyVariantId(): string {
  return requireVariantId(AFTER_PARTY_ENV_VAR, "After Party");
}

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
