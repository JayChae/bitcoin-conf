import type { TierKey } from "@/app/[locale]/(2026)/_types/tickets";

/**
 * Shopify Storefront API Variant IDs
 * 조회일: 2026-03-02
 *
 * VIP Ticket          (Default)    → 48806870352114  ₩2,400,000
 * Premium Ticket      (No AP)      → 48806870384882  ₩264,000
 * Premium Ticket      (Yes AP)     → 48806870417650  ₩314,000
 * General Ticket      (No AP)      → 48806870450418  ₩168,000
 * General Ticket      (Yes AP)     → 48806870483186  ₩218,000
 */
export const VARIANT_IDS: Record<
  TierKey,
  Record<"withAP" | "withoutAP", string>
> = {
  vip: {
    withoutAP: "gid://shopify/ProductVariant/48806870352114",
    withAP: "gid://shopify/ProductVariant/48806870352114", // VIP includes AP by default
  },
  premium: {
    withoutAP: "gid://shopify/ProductVariant/48806870384882",
    withAP: "gid://shopify/ProductVariant/48806870417650",
  },
  general: {
    withoutAP: "gid://shopify/ProductVariant/48806870450418",
    withAP: "gid://shopify/ProductVariant/48806870483186",
  },
};
