"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { TierKey } from "@/app/[locale]/(2026)/_types/tickets";
import {
  TICKETS,
  AFTER_PARTY_PRICE,
} from "@/app/[locale]/(2026)/_constants/tickets";
import {
  getDiscountedPrice,
  formatKRW,
} from "@/app/[locale]/(2026)/_utils/tickets";

export default function SelectionSummary({
  tier,
  selectedSeats,
  afterPartyCount,
  locale,
  onPurchase,
}: {
  tier: TierKey;
  selectedSeats: Record<string, Set<number>>;
  afterPartyCount: number;
  locale: string;
  onPurchase: () => void;
}) {
  const t = useTranslations("Tickets2026");
  const ticket = TICKETS.find((tk) => tk.tier === tier);
  if (!ticket) return null;

  let totalCount = 0;
  for (const seats of Object.values(selectedSeats)) {
    totalCount += seats.size;
  }

  if (totalCount === 0) return null;

  const unitPrice = getDiscountedPrice(ticket.basePrice);
  const ticketTotal = totalCount * unitPrice;
  const afterPartyTotal = afterPartyCount * AFTER_PARTY_PRICE;
  const grandTotal = ticketTotal + afterPartyTotal;

  return (
    <div className="sticky bottom-4 mt-4 mx-auto w-full max-w-md z-50">
      <div
        className={cn(
          "flex items-center justify-between gap-3 px-5 py-3 rounded-2xl",
          "bg-white/10 backdrop-blur-xl border border-white/20",
          "shadow-lg shadow-black/40",
        )}
      >
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
          className={cn(
            "px-5 py-2.5 rounded-xl text-sm font-bold",
            "bg-white/15 text-white border border-white/20",
            "hover:bg-white/25 active:scale-95",
            "transition-all duration-150",
          )}
        >
          {t("ctaBuy")}
        </button>
      </div>
    </div>
  );
}
