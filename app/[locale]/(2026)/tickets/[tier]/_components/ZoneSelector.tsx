"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { TierKey } from "@/app/[locale]/(2026)/_types/tickets";
import {
  SECTIONS,
  TIER_BORDER,
  TIER_BG_MUTED,
} from "@/app/[locale]/(2026)/_constants/seats";
import {
  TIER_SECTIONS,
  TIER_TO_SEAT_TIER,
} from "@/app/[locale]/(2026)/_constants/tierMapping";

// Sections shown as display-only context above selectable sections
const CONTEXT_SECTIONS: Record<TierKey, string[][]> = {
  vip: [],
  premium: [["C", "D"]],
  general: [
    ["C", "D"],
    ["A", "B", "C", "D", "E", "F"],
  ],
};

const CONTEXT_LABELS: Record<TierKey, string[]> = {
  vip: [],
  premium: ["VIP"],
  general: ["VIP", "Premium"],
};

// U-shape curve: center sections stay up, edges drop down
function getCurveOffset(index: number, total: number): number {
  if (total <= 2) return 0;
  const center = (total - 1) / 2;
  const distance = Math.abs(index - center) / center; // 0 at center, 1 at edge
  return Math.round(distance * distance * -32); // quadratic curve, edges go up
}

export default function ZoneSelector({
  tier,
  selectedSeats,
  selectedSection,
  onSelectZone,
  sectionCounts,
}: {
  tier: TierKey;
  selectedSeats: Record<string, Set<number>>;
  selectedSection: string | null;
  onSelectZone: (sectionId: string) => void;
  sectionCounts: Record<string, number>;
}) {
  const t = useTranslations("Tickets2026");
  const activeIds = TIER_SECTIONS[tier];
  const contextRows = CONTEXT_SECTIONS[tier];
  const contextLabels = CONTEXT_LABELS[tier];

  return (
    <div className="overflow-x-auto md:overflow-x-visible">
      <div className="flex flex-col items-center gap-4 md:gap-6 py-4 min-w-max md:min-w-0">
        {/* Stage */}
        <div className="w-48 md:w-64 py-2 rounded-lg bg-white/10 border border-white/20 text-center">
          <span className="text-xs md:text-sm font-medium text-white/70 tracking-widest uppercase">
            {t("stage")}
          </span>
        </div>

        {/* Context sections (display-only) */}
        {contextRows.map((ids, rowIdx) => (
          <div key={rowIdx} className="flex flex-col items-center gap-1">
            <span className="text-xs md:text-sm text-white/60 font-medium">
              {contextLabels[rowIdx]}
            </span>
            <div className="flex items-end justify-center gap-1.5 md:gap-2">
              {ids.map((id, i) => {
                const offsetY = getCurveOffset(i, ids.length);
                return (
                  <div
                    key={id}
                    style={{ transform: `translateY(${offsetY}px)` }}
                    className={cn(
                      "flex items-center justify-center rounded-md border px-2 py-2 md:px-4 md:py-3",
                      "opacity-60",
                      TIER_BORDER.unavailable,
                      TIER_BG_MUTED.unavailable,
                    )}
                  >
                    <span className="text-xs md:text-sm font-bold text-white/60">
                      {id}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Selectable sections */}
        <div className="flex items-end justify-center gap-1.5 md:gap-2">
          {activeIds.map((id, i) => {
            const section = SECTIONS.find((s) => s.id === id)!;
            const sectionTier = TIER_TO_SEAT_TIER[tier];
            const selectedCount = selectedSeats[id]?.size ?? 0;
            const isCurrent = selectedSection === id;
            const offsetY = getCurveOffset(i, activeIds.length);

            return (
              <button
                key={id}
                onClick={() => onSelectZone(id)}
                style={{
                  transform: isCurrent
                    ? `translateY(${offsetY}px) scale(1.05)`
                    : `translateY(${offsetY}px)`,
                }}
                className={cn(
                  "flex flex-col items-center justify-center rounded-lg border px-2 py-2 md:px-5 md:py-5",
                  "transition-all duration-200",
                  "cursor-pointer hover:brightness-125",
                  TIER_BORDER[sectionTier],
                  TIER_BG_MUTED[sectionTier],
                  isCurrent && "ring-2 ring-white",
                )}
              >
                <span className="text-xs md:text-lg font-bold text-white">
                  {section.id}
                </span>
                <span className="text-[10px] md:text-xs text-white/50 mt-0.5 whitespace-nowrap">
                  {sectionCounts[id] ?? 0} {t("availableSeats")}
                </span>
                <span className={cn(
                  "mt-1 text-[10px] md:text-xs text-white font-medium whitespace-nowrap",
                  selectedCount === 0 && "invisible",
                )}>
                  {selectedCount || 0} {t("selected")}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-white/40 mt-2">{t("selectSection")}</p>
      </div>
    </div>
  );
}
''