"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { TierKey } from "@/app/[locale]/(2026)/_types/tickets";
import { SECTIONS, TIER_COLORS } from "@/app/[locale]/(2026)/_constants/seats";
import { getSeatTier } from "@/app/[locale]/(2026)/_utils/seats";
import { isSeatSelectable } from "@/app/[locale]/(2026)/_utils/tierMapping";

function SeatCircle({
  sectionId,
  seatNumber,
  isSelected,
  onToggle,
}: {
  sectionId: string;
  seatNumber: number;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const seatTier = getSeatTier(sectionId, seatNumber);

  return (
    <button
      onClick={onToggle}
      title={`${sectionId}-${seatNumber}`}
      className={cn(
        "w-7 h-7 md:w-8 md:h-8 rounded-full text-[9px] md:text-[10px] font-medium",
        "transition-all duration-150 flex items-center justify-center flex-shrink-0",
        "cursor-pointer hover:brightness-125",
        isSelected && "ring-2 ring-white scale-110",
      )}
      style={{
        backgroundColor: isSelected
          ? TIER_COLORS[seatTier]
          : `${TIER_COLORS[seatTier]}66`,
        color: isSelected ? "#fff" : "rgba(255,255,255,0.6)",
      }}
    >
      {seatNumber}
    </button>
  );
}

export default function SeatSelector({
  tier,
  sectionId,
  selectedSeats,
  onToggleSeat,
}: {
  tier: TierKey;
  sectionId: string;
  selectedSeats: Set<number>;
  onToggleSeat: (sectionId: string, seatNumber: number) => void;
}) {
  const t = useTranslations("Tickets2026");
  const section = SECTIONS.find((s) => s.id === sectionId);
  if (!section) return null;

  let seatCounter = 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl md:text-2xl font-bold text-white">
          {t("section")} {sectionId}
        </h3>
      </div>

      <p className="text-xs text-white/40">{t("selectSeat")}</p>

      {/* Seat grid */}
      <div className="flex flex-col items-center gap-1.5 md:gap-2 overflow-x-auto py-2">
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
                  onToggle={() => onToggleSeat(sectionId, num)}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
