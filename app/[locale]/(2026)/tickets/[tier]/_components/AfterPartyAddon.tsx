"use client";

import { useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { AFTER_PARTY_PRICE } from "@/app/[locale]/(2026)/_constants/tickets";
import { formatKRW } from "@/app/[locale]/(2026)/_utils/tickets";
import { ArrowLeft, Check } from "lucide-react";
import type { HoldState } from "./SelectionSummary";

function Checkbox({ checked, onClick }: { checked: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={cn(
        "w-5 h-5 rounded flex-shrink-0 flex items-center justify-center",
        "border transition-colors duration-150",
        checked
          ? "bg-white border-white"
          : "border-white/30 hover:border-white/50",
      )}
    >
      {checked && <Check className="w-3.5 h-3.5 text-black" />}
    </button>
  );
}

export default function AfterPartyAddon({
  selectedSeats,
  afterPartySeats,
  onToggle,
  locale,
  onPurchase,
  onBack,
  holdState = "idle",
  holdError = null,
}: {
  selectedSeats: Record<string, Set<number>>;
  afterPartySeats: Record<string, Set<number>>;
  onToggle: (sectionId: string, seatNumber: number) => void;
  locale: string;
  onPurchase: () => void;
  onBack: () => void;
  holdState?: HoldState;
  holdError?: string | null;
}) {
  const t = useTranslations("Tickets2026");

  const allSeats = useMemo(() => {
    const seats: { sectionId: string; seatNumber: number }[] = [];
    for (const [sectionId, seatSet] of Object.entries(selectedSeats)) {
      for (const num of [...seatSet].sort((a, b) => a - b)) {
        seats.push({ sectionId, seatNumber: num });
      }
    }
    return seats;
  }, [selectedSeats]);

  const count = useMemo(
    () =>
      Object.values(afterPartySeats).reduce((sum, set) => sum + set.size, 0),
    [afterPartySeats],
  );

  const allSelected = count === allSeats.length && allSeats.length > 0;

  const handleToggleAll = useCallback(() => {
    for (const { sectionId, seatNumber } of allSeats) {
      const has = afterPartySeats[sectionId]?.has(seatNumber) ?? false;
      if (allSelected ? has : !has) onToggle(sectionId, seatNumber);
    }
  }, [allSeats, afterPartySeats, allSelected, onToggle]);

  const isLoading = holdState === "loading";

  return (
    <div className="flex flex-col gap-8">
      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("goBack")}
      </button>

      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          {t("afterPartyOption")}
        </h2>
        <p className="text-sm text-white/50 mt-2">
          {t("afterPartyStepDescription")}
        </p>
        <p className="text-sm text-white/40 mt-1 tabular-nums">
          {formatKRW(AFTER_PARTY_PRICE, locale)}{t("currency")}{t("perTicket")}
        </p>
      </div>

      {/* Select all + seat list */}
      <div className="flex flex-col gap-4">
        {/* Select all */}
        <div
          className="flex items-center gap-3 cursor-pointer pb-3 border-b border-white/10"
          onClick={handleToggleAll}
        >
          <Checkbox checked={allSelected} onClick={handleToggleAll} />
          <span className="text-sm font-medium text-white">
            {t("addAllAfterParty")}
          </span>
        </div>

        {/* Per-seat */}
        {allSeats.map(({ sectionId, seatNumber }) => {
          const checked =
            afterPartySeats[sectionId]?.has(seatNumber) ?? false;
          return (
            <div
              key={`${sectionId}-${seatNumber}`}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => onToggle(sectionId, seatNumber)}
            >
              <Checkbox
                checked={checked}
                onClick={() => onToggle(sectionId, seatNumber)}
              />
              <span className="text-sm text-white/70">
                {t("section")} {sectionId} · {seatNumber}
              </span>
            </div>
          );
        })}
      </div>

      {/* Total */}
      {count > 0 && (
        <p className="text-sm text-white/50 tabular-nums">
          {count} x {formatKRW(AFTER_PARTY_PRICE, locale)}
          {t("currency")} ={" "}
          <span className="font-semibold text-white">
            {formatKRW(count * AFTER_PARTY_PRICE, locale)}
            {t("currency")}
          </span>
        </p>
      )}

      {/* Purchase */}
      <button
        type="button"
        onClick={onPurchase}
        disabled={isLoading}
        className={cn(
          "w-full py-3.5 rounded-full text-sm font-semibold",
          "bg-white/10 text-white border border-white/15",
          "transition-all duration-150",
          isLoading
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-white/15 active:scale-[0.98]",
        )}
      >
        {isLoading ? (
          <svg
            className="h-5 w-5 animate-spin mx-auto"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          t("ctaBuy")
        )}
      </button>

      {holdError && (
        <p className="text-xs text-red-400 text-center">{holdError}</p>
      )}
    </div>
  );
}
