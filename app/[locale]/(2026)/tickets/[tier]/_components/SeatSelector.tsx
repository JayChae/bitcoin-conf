"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { TierKey } from "@/app/[locale]/(2026)/_types/tickets";
import type { SeatStatus } from "@/app/[locale]/(2026)/_types/seats";
import { SECTIONS, TIER_COLORS } from "@/app/[locale]/(2026)/_constants/seats";
import { getSeatTier } from "@/app/[locale]/(2026)/_utils/seats";
import { isSeatSelectable } from "@/app/[locale]/(2026)/_utils/tierMapping";

function SeatCircle({
  sectionId,
  seatNumber,
  isSelected,
  status,
  onToggle,
}: {
  sectionId: string;
  seatNumber: number;
  isSelected: boolean;
  status: SeatStatus;
  onToggle: () => void;
}) {
  const seatTier = getSeatTier(sectionId, seatNumber);
  const isDisabled = status === "held" || status === "sold";

  return (
    <button
      onClick={isDisabled ? undefined : onToggle}
      disabled={isDisabled}
      title={`${sectionId}-${seatNumber}${isDisabled ? ` (${status})` : ""}`}
      className={cn(
        "w-7 h-7 md:w-8 md:h-8 rounded-full text-[9px] md:text-[10px] font-medium",
        "transition-all duration-150 flex items-center justify-center flex-shrink-0",
        isDisabled
          ? "cursor-not-allowed opacity-40"
          : "cursor-pointer hover:brightness-125",
        isSelected && !isDisabled && "ring-2 ring-white scale-110",
      )}
      style={{
        backgroundColor: isDisabled
          ? "#374151"
          : isSelected
            ? TIER_COLORS[seatTier]
            : `${TIER_COLORS[seatTier]}66`,
        color: isDisabled
          ? "rgba(255,255,255,0.3)"
          : isSelected
            ? "#fff"
            : "rgba(255,255,255,0.6)",
      }}
    >
      {status === "sold" ? "✕" : seatNumber}
    </button>
  );
}

export default function SeatSelector({
  tier,
  sectionId,
  selectedSeats,
  onToggleSeat,
  seatStatuses = {},
  loading = false,
}: {
  tier: TierKey;
  sectionId: string | null;
  selectedSeats: Set<number>;
  onToggleSeat: (sectionId: string, seatNumber: number) => void;
  seatStatuses?: Record<number, SeatStatus>;
  loading?: boolean;
}) {
  const t = useTranslations("Tickets2026");

  if (!sectionId) {
    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-xl md:text-2xl font-bold text-white">
          {t("section")}
        </h3>
        <p className="text-xs text-white/40">{t("selectSeat")}</p>
        <div className="flex items-center justify-center py-12 md:py-16">
          <p className="text-sm text-white/30">{t("selectSection")}</p>
        </div>
      </div>
    );
  }

  const section = SECTIONS.find((s) => s.id === sectionId);
  if (!section) return null;

  let seatCounter = 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl md:text-2xl font-bold text-white">
          {t("section")} {sectionId}
        </h3>
      </div>

      <p className="text-xs text-white/40">{t("selectSeat")}</p>

      <div className="relative overflow-x-auto p-2">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 rounded-lg">
            <svg
              className="h-6 w-6 animate-spin text-white/60"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}
        <div className={cn(
          "flex flex-col items-center gap-1.5 md:gap-2 min-w-max",
          loading && "pointer-events-none opacity-50",
        )}>
          {section.rows.map((count, rowIdx) => {
            const rowSeats: number[] = [];
            for (let i = 0; i < count; i++) {
              seatCounter++;
              rowSeats.push(seatCounter);
            }
            const selectableSeats = rowSeats.filter((num) =>
              isSeatSelectable(sectionId, num, tier),
            );
            if (selectableSeats.length === 0) return null;

            return (
              <div key={rowIdx} className="flex items-center gap-1 md:gap-1.5">
                <span className="w-4 text-[10px] text-white/30 text-right mr-1">
                  {rowIdx + 1}
                </span>
                {selectableSeats.map((num) => (
                  <SeatCircle
                    key={num}
                    sectionId={sectionId}
                    seatNumber={num}
                    isSelected={selectedSeats.has(num)}
                    status={seatStatuses[num] ?? "available"}
                    onToggle={() => onToggleSeat(sectionId, num)}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
