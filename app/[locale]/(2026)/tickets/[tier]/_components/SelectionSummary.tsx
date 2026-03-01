"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { TierKey } from "@/app/[locale]/(2026)/_components/Tickets/tickets";
import {
  TICKETS,
  getDiscountedPrice,
  formatKRW,
} from "@/app/[locale]/(2026)/_components/Tickets/tickets";

export default function SelectionSummary({
  tier,
  selectedSeats,
  locale,
}: {
  tier: TierKey;
  selectedSeats: Record<string, Set<number>>;
  locale: string;
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
  const totalPrice = totalCount * unitPrice;

  return (
    <div className="sticky bottom-4 mt-4 mx-auto w-full max-w-md">
      <div
        className={cn(
          "flex items-center justify-between px-5 py-3 rounded-2xl",
          "bg-black/80 backdrop-blur-md border border-white/15",
          "shadow-lg shadow-black/30",
        )}
      >
        <div className="text-sm text-white/80">
          <span className="font-medium text-white">{totalCount}</span>{" "}
          {t("selected")}
        </div>
        <div className="text-sm font-bold text-white tabular-nums">
          {t("totalPrice")} {formatKRW(totalPrice, locale)}
          {t("currency")}
        </div>
      </div>
    </div>
  );
}
