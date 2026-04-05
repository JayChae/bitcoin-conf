"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { TierKey } from "@/app/[locale]/(2026)/_types/tickets";
import { AFTER_PARTY_PRICE } from "@/app/[locale]/(2026)/_constants/tickets";
import { TIER_COLORS } from "@/app/[locale]/(2026)/_constants/seats";
import { TIER_TO_SEAT_TIER } from "@/app/[locale]/(2026)/_constants/tierMapping";
import { formatKRW } from "@/app/[locale]/(2026)/_utils/tickets";
import { Check } from "lucide-react";

export default function AfterPartyAddon({
  tier,
  selectedSeats,
  afterPartySeats,
  onToggle,
  locale,
}: {
  tier: TierKey;
  selectedSeats: Record<string, Set<number>>;
  afterPartySeats: Record<string, Set<number>>;
  onToggle: (sectionId: string, seatNumber: number) => void;
  locale: string;
}) {
  const t = useTranslations("Tickets2026");
  const tierColor = TIER_COLORS[TIER_TO_SEAT_TIER[tier]];

  const allSeats: { sectionId: string; seatNumber: number }[] = [];
  for (const [sectionId, seats] of Object.entries(selectedSeats)) {
    for (const num of [...seats].sort((a, b) => a - b)) {
      allSeats.push({ sectionId, seatNumber: num });
    }
  }

  if (allSeats.length === 0) return null;

  const afterPartyCount = Object.values(afterPartySeats).reduce(
    (sum, set) => sum + set.size,
    0,
  );

  return (
    <div className="rounded-2xl p-4 md:p-8 bg-black/40 backdrop-blur-xl border border-white/10">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-base md:text-lg font-semibold text-white">
          {t("afterPartyOption")}
        </h3>
        <span className="text-sm text-white/50">
          {t("afterPartyAddon")}
          <span className="text-xs text-white/30">{t("perTicket")}</span>
        </span>
      </div>

      <p className="text-xs text-white/40 mb-4">{t("afterPartyDescription")}</p>

      <div className="flex flex-col gap-2 ">
        {allSeats.map(({ sectionId, seatNumber }) => {
          const isChecked =
            afterPartySeats[sectionId]?.has(seatNumber) ?? false;

          return (
            <button
              key={`${sectionId}-${seatNumber}`}
              type="button"
              onClick={() => onToggle(sectionId, seatNumber)}
              className={cn(
                "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl",
                "border border-white/10 transition-all duration-150",
                "hover:border-white/20",
              )}
            >
              <span className="text-sm text-white/80">
                {t("section")} {sectionId} - {seatNumber}
              </span>

              <div
                className={cn(
                  "w-5 h-5 rounded flex-shrink-0 flex items-center justify-center",
                  "border transition-colors duration-150",
                )}
                style={{
                  backgroundColor: isChecked ? tierColor : "transparent",
                  borderColor: isChecked ? tierColor : "rgba(255,255,255,0.3)",
                }}
              >
                {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
            </button>
          );
        })}
      </div>

      {afterPartyCount > 0 && (
        <p className="mt-4 text-xs md:text-sm text-white/50 text-right tabular-nums">
          {afterPartyCount} x {formatKRW(AFTER_PARTY_PRICE, locale)}
          {t("currency")} ={" "}
          {formatKRW(afterPartyCount * AFTER_PARTY_PRICE, locale)}
          {t("currency")}
        </p>
      )}
    </div>
  );
}
