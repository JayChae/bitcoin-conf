import type { PricingPhase } from "../_types/tickets";
import { CURRENT_PHASE, DISCOUNTS } from "../_constants/tickets";

export function getDiscountedPrice(basePrice: number): number {
  return Math.round(basePrice * (1 - DISCOUNTS[CURRENT_PHASE]));
}

export function isDiscounted(): boolean {
  return DISCOUNTS[CURRENT_PHASE] > 0;
}

export function formatKRW(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale === "ko" ? "ko-KR" : "en-US").format(
    amount
  );
}
