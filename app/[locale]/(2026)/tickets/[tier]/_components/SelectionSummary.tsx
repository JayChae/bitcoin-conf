"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { TierKey, PricingPhase } from "@/app/[locale]/(2026)/_types/tickets";
import {
  TICKETS,
  AFTER_PARTY_PRICE,
} from "@/app/[locale]/(2026)/_constants/tickets";
import {
  getDiscountedPrice,
  formatKRW,
} from "@/app/[locale]/(2026)/_utils/tickets";

export type HoldState = "idle" | "loading" | "error";

export default function SelectionSummary({
  tier,
  selectedSeats,
  afterPartyCount,
  locale,
  onPurchase,
  holdState = "idle",
  holdError = null,
  phase,
}: {
  tier: TierKey;
  selectedSeats: Record<string, Set<number>>;
  afterPartyCount: number;
  locale: string;
  onPurchase: () => void;
  holdState?: HoldState;
  holdError?: string | null;
  phase: PricingPhase;
}) {
  const t = useTranslations("Tickets2026");
  const ticket = TICKETS.find((tk) => tk.tier === tier);
  if (!ticket) return null;

  let totalCount = 0;
  for (const seats of Object.values(selectedSeats)) {
    totalCount += seats.size;
  }

  if (totalCount === 0) return null;

  const unitPrice = getDiscountedPrice(ticket.basePrice, phase);
  const ticketTotal = totalCount * unitPrice;
  const afterPartyTotal = afterPartyCount * AFTER_PARTY_PRICE;
  const grandTotal = ticketTotal + afterPartyTotal;

  const isLoading = holdState === "loading";

  return (
    <div className="sticky bottom-4 mt-4 mx-auto w-full max-w-md z-50">
      <div
        className={cn(
          "flex flex-col gap-2 px-5 py-3 rounded-2xl",
          "bg-white/10 backdrop-blur-xl border border-white/20",
          "shadow-lg shadow-black/40",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <div className="text-sm text-white/70">
              <span className="font-medium text-white">{totalCount}</span>{" "}
              {t("selected")}
            </div>
            <div className="text-sm font-bold text-white tabular-nums">
              {t("totalPrice")}
              {formatKRW(grandTotal, locale)}
              {t("currency")}
            </div>
          </div>

          <button
            type="button"
            onClick={onPurchase}
            disabled={isLoading}
            className={cn(
              "px-5 py-2.5 rounded-xl text-sm font-bold min-w-[90px] flex items-center justify-center",
              "bg-white/15 text-white border border-white/20",
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-white/25 active:scale-95",
              "transition-all duration-150",
            )}
          >
            {isLoading ? (
              <svg
                className="h-5 w-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              t("ctaBuy")
            )}
          </button>
        </div>

        {holdError && (
          <div className="text-xs text-red-400 text-center">{holdError}</div>
        )}
      </div>
    </div>
  );
}
