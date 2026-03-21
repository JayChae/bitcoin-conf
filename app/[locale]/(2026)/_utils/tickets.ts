import type { PricingPhase } from "../_types/tickets";
import { calcDiscountedPrice, getDiscountRate } from "@/lib/pricing";

export function getDiscountedPrice(
  basePrice: number,
  phase: PricingPhase,
): number {
  return calcDiscountedPrice(basePrice, phase);
}

export function isDiscounted(phase: PricingPhase): boolean {
  return getDiscountRate(phase) > 0;
}

export function formatKRW(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale === "ko" ? "ko-KR" : "en-US").format(
    amount,
  );
}
