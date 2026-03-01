"use client";

import { useState, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  SECTIONS,
  getSeatTier,
  getSectionPrimaryTier,
  getAvailableCount,
  TIER_COLORS,
  TIER_BG,
  TIER_BORDER,
  TIER_BG_MUTED,
  type SeatTier,
  type SectionConfig,
} from "./seatData";
import { getDiscountedPrice, formatKRW } from "../Tickets/tickets";

// ─── Section Overview (Auditorium Map) ──────────────────────────

function SectionBlock({
  section,
  selectedCount,
  onClick,
}: {
  section: SectionConfig;
  selectedCount: number;
  onClick: () => void;
}) {
  const t = useTranslations("Tickets2026");
  const tier = getSectionPrimaryTier(section.id);
  const available = getAvailableCount(section);

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border px-2 py-3 md:px-4 md:py-5",
        "transition-all duration-200 cursor-pointer",
        "hover:scale-105 hover:brightness-125",
        TIER_BORDER[tier],
        TIER_BG_MUTED[tier],
      )}
    >
      <span className="text-sm md:text-lg font-bold text-white">
        {section.id}
      </span>
      <span className="text-[10px] md:text-xs text-white/50 mt-0.5">
        {available} {t("availableSeats")}
      </span>
      {selectedCount > 0 && (
        <span className="mt-1 text-[10px] md:text-xs text-white font-medium">
          {selectedCount} {t("selected")}
        </span>
      )}
    </button>
  );
}

function AuditoriumOverview({
  selectedSeats,
  onSelectSection,
}: {
  selectedSeats: Record<string, Set<number>>;
  onSelectSection: (id: string) => void;
}) {
  const t = useTranslations("Tickets2026");
  const getCount = (id: string) => selectedSeats[id]?.size ?? 0;
  const getSection = (id: string) => SECTIONS.find((s) => s.id === id)!;

  return (
    <div className="flex flex-col items-center gap-4 md:gap-6 py-4">
      {/* Stage */}
      <div className="w-48 md:w-64 py-2 rounded-lg bg-white/10 border border-white/20 text-center">
        <span className="text-xs md:text-sm font-medium text-white/70 tracking-widest uppercase">
          {t("stage")}
        </span>
      </div>

      {/* VIP indicator */}
      <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-violet-400/80">
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: TIER_COLORS.vip }}
        />
        VIP (C·D)
      </div>

      {/* Upper sections A-F in fan shape */}
      <div className="flex items-end justify-center gap-1 md:gap-2">
        {(["A", "B", "C", "D", "E", "F"] as const).map((id) => {
          const rotation: Record<string, string> = {
            A: "-20deg",
            B: "-10deg",
            C: "-3deg",
            D: "3deg",
            E: "10deg",
            F: "20deg",
          };
          return (
            <div
              key={id}
              style={{
                transform: `rotate(${rotation[id]})`,
                transformOrigin: "center bottom",
              }}
            >
              <SectionBlock
                section={getSection(id)}
                selectedCount={getCount(id)}
                onClick={() => onSelectSection(id)}
              />
            </div>
          );
        })}
      </div>

      {/* Lower sections G-N */}
      <div className="flex items-start justify-center gap-2 md:gap-4 mt-2">
        {/* Left wing */}
        <div className="flex gap-1 md:gap-2">
          {["G", "H"].map((id) => (
            <SectionBlock
              key={id}
              section={getSection(id)}
              selectedCount={getCount(id)}
              onClick={() => onSelectSection(id)}
            />
          ))}
        </div>

        {/* Center */}
        <div className="flex gap-1 md:gap-2">
          {["J", "K", "L"].map((id) => (
            <SectionBlock
              key={id}
              section={getSection(id)}
              selectedCount={getCount(id)}
              onClick={() => onSelectSection(id)}
            />
          ))}
        </div>

        {/* Right wing */}
        <div className="flex gap-1 md:gap-2">
          {["M", "N"].map((id) => (
            <SectionBlock
              key={id}
              section={getSection(id)}
              selectedCount={getCount(id)}
              onClick={() => onSelectSection(id)}
            />
          ))}
        </div>
      </div>

      <p className="text-xs text-white/40 mt-2">{t("selectSection")}</p>
    </div>
  );
}

// ─── Section Detail (Individual Seats) ──────────────────────────

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
  const tier = getSeatTier(sectionId, seatNumber);
  const isAvailable = tier !== "unavailable";

  return (
    <button
      disabled={!isAvailable}
      onClick={onToggle}
      title={`${sectionId}-${seatNumber}`}
      className={cn(
        "w-7 h-7 md:w-8 md:h-8 rounded-full text-[9px] md:text-[10px] font-medium",
        "transition-all duration-150 flex items-center justify-center flex-shrink-0",
        isAvailable ? "cursor-pointer hover:brightness-125" : "cursor-default opacity-30",
        isSelected && "ring-2 ring-white scale-110",
      )}
      style={{
        backgroundColor: isAvailable
          ? isSelected
            ? TIER_COLORS[tier]
            : `${TIER_COLORS[tier]}66`
          : TIER_COLORS.unavailable,
        color: isSelected ? "#fff" : "rgba(255,255,255,0.6)",
      }}
    >
      {seatNumber}
    </button>
  );
}

function SectionDetail({
  section,
  selectedSeats,
  onToggleSeat,
  onBack,
}: {
  section: SectionConfig;
  selectedSeats: Set<number>;
  onToggleSeat: (sectionId: string, seatNumber: number) => void;
  onBack: () => void;
}) {
  const t = useTranslations("Tickets2026");
  let seatCounter = 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm w-fit"
      >
        <ArrowLeft className="size-4" />
        {t("backToMap")}
      </button>

      {/* Section header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl md:text-2xl font-bold text-white">
          {t("section")} {section.id}
        </h3>
        <TierLegendInline sectionId={section.id} />
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
          return (
            <div
              key={rowIdx}
              className="flex items-center gap-1 md:gap-1.5"
            >
              <span className="w-4 text-[10px] text-white/30 text-right mr-1">
                {rowIdx + 1}
              </span>
              {rowSeats.map((num) => (
                <SeatCircle
                  key={num}
                  sectionId={section.id}
                  seatNumber={num}
                  isSelected={selectedSeats.has(num)}
                  onToggle={() => onToggleSeat(section.id, num)}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TierLegendInline({ sectionId }: { sectionId: string }) {
  const section = SECTIONS.find((s) => s.id === sectionId);
  if (!section) return null;

  const tiers = new Set(section.tierRanges.map((r) => r.tier));
  const labels: Record<SeatTier, string> = {
    vip: "VIP",
    premium: "Premium",
    regular: "General",
    unavailable: "",
  };

  return (
    <div className="flex items-center gap-3">
      {Array.from(tiers)
        .filter((t) => t !== "unavailable")
        .map((tier) => (
          <div key={tier} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: TIER_COLORS[tier] }}
            />
            <span className="text-[10px] md:text-xs text-white/50">
              {labels[tier]}
            </span>
          </div>
        ))}
    </div>
  );
}

// ─── Legend & Summary ────────────────────────────────────────────

function Legend() {
  const t = useTranslations("Tickets2026");
  const items: { tier: SeatTier; label: string }[] = [
    { tier: "vip", label: "VIP" },
    { tier: "premium", label: t("premium") },
    { tier: "regular", label: t("general") },
    { tier: "unavailable", label: t("unavailableLabel") },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
      {items.map(({ tier, label }) => (
        <div key={tier} className="flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: TIER_COLORS[tier] }}
          />
          <span className="text-xs text-white/60">{label}</span>
        </div>
      ))}
    </div>
  );
}

const TIER_PRICES: Record<string, number> = {
  vip: 3_000_000,
  premium: 330_000,
  regular: 210_000,
};

function SelectionSummary({
  selectedSeats,
  locale,
}: {
  selectedSeats: Record<string, Set<number>>;
  locale: string;
}) {
  const t = useTranslations("Tickets2026");

  let totalCount = 0;
  let totalPrice = 0;

  for (const [sectionId, seats] of Object.entries(selectedSeats)) {
    for (const seatNum of seats) {
      const tier = getSeatTier(sectionId, seatNum);
      if (tier !== "unavailable") {
        totalCount++;
        const base = TIER_PRICES[tier] ?? 0;
        totalPrice += getDiscountedPrice(base);
      }
    }
  }

  if (totalCount === 0) return null;

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
          {t("totalPrice")} {formatKRW(totalPrice, locale)}{t("currency")}
        </div>
      </div>
    </div>
  );
}

// ─── Main SeatMap Component ─────────────────────────────────────

export default function SeatMap({ locale }: { locale: string }) {
  const t = useTranslations("Tickets2026");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Record<string, Set<number>>>({});

  const toggleSeat = useCallback(
    (sectionId: string, seatNumber: number) => {
      setSelectedSeats((prev) => {
        const next = { ...prev };
        const set = new Set(prev[sectionId] ?? []);
        if (set.has(seatNumber)) {
          set.delete(seatNumber);
        } else {
          set.add(seatNumber);
        }
        if (set.size === 0) {
          delete next[sectionId];
        } else {
          next[sectionId] = set;
        }
        return next;
      });
    },
    [],
  );

  const activeSectionData = activeSection
    ? SECTIONS.find((s) => s.id === activeSection)
    : null;

  return (
    <section className="mb-12 md:mb-16">
      {/* Title */}
      <h2 className="text-xl md:text-2xl font-bold text-white text-center mb-6">
        {t("seatMap")}
      </h2>

      {/* Map container */}
      <div
        className={cn(
          "rounded-2xl p-4 md:p-8",
          "bg-black/40 backdrop-blur-sm border border-white/10",
        )}
      >
        {activeSection && activeSectionData ? (
          <SectionDetail
            section={activeSectionData}
            selectedSeats={selectedSeats[activeSection] ?? new Set()}
            onToggleSeat={toggleSeat}
            onBack={() => setActiveSection(null)}
          />
        ) : (
          <AuditoriumOverview
            selectedSeats={selectedSeats}
            onSelectSection={setActiveSection}
          />
        )}

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <Legend />
        </div>
      </div>

      {/* Selection summary */}
      <SelectionSummary selectedSeats={selectedSeats} locale={locale} />
    </section>
  );
}
