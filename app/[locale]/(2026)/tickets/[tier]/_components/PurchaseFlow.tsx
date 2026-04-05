"use client";

import { useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import type { TierKey, PricingPhase } from "@/app/[locale]/(2026)/_types/tickets";
import type { SeatHoldRequest } from "@/app/[locale]/(2026)/_types/seats";
import { TICKETS } from "@/app/[locale]/(2026)/_constants/tickets";
import { useSeatAvailability } from "@/hooks/useSeatAvailability";
import { useZoneAvailability } from "@/hooks/useZoneAvailability";
import SeatMapOverview from "./SeatMapOverview";
import ZoneSelector from "./ZoneSelector";
import SeatSelector from "./SeatSelector";
import AfterPartyAddon from "./AfterPartyAddon";
import SelectionSummary, { type HoldState } from "./SelectionSummary";

export default function PurchaseFlow({
  tier,
  locale,
  phase,
}: {
  tier: TierKey;
  locale: string;
  phase: PricingPhase;
}) {
  const t = useTranslations("Tickets2026");

  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<
    Record<string, Set<number>>
  >({});
  const [afterPartySeats, setAfterPartySeats] = useState<
    Record<string, Set<number>>
  >({});
  const [holdState, setHoldState] = useState<HoldState>("idle");
  const [holdError, setHoldError] = useState<string | null>(null);

  const seatSelectorRef = useRef<HTMLDivElement>(null);

  const ticket = TICKETS.find((tk) => tk.tier === tier)!;
  const hasAfterPartyAddon = !!ticket.addonKeys?.includes("afterPartyOption");
  const afterPartyIncluded = tier === "vip";

  const totalCount = Object.values(selectedSeats).reduce(
    (sum, set) => sum + set.size,
    0,
  );

  const afterPartyCount = Object.values(afterPartySeats).reduce(
    (sum, set) => sum + set.size,
    0,
  );

  // Seat availability polling
  const { seatStatuses, loading: seatsLoading } = useSeatAvailability(selectedSection);
  const { sectionCounts } = useZoneAvailability(tier);

  const handleSelectZone = useCallback((sectionId: string) => {
    setSelectedSection(sectionId);
    setTimeout(() => {
      seatSelectorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 100);
  }, []);

  const toggleSeat = useCallback((sectionId: string, seatNumber: number) => {
    setSelectedSeats((prev) => {
      const next = { ...prev };
      const set = new Set(prev[sectionId] ?? []);
      if (set.has(seatNumber)) {
        set.delete(seatNumber);
        setAfterPartySeats((apPrev) => {
          const apNext = { ...apPrev };
          const apSet = new Set(apPrev[sectionId] ?? []);
          apSet.delete(seatNumber);
          if (apSet.size === 0) delete apNext[sectionId];
          else apNext[sectionId] = apSet;
          return apNext;
        });
      } else {
        set.add(seatNumber);
      }
      if (set.size === 0) delete next[sectionId];
      else next[sectionId] = set;
      return next;
    });
  }, []);

  const toggleAfterParty = useCallback(
    (sectionId: string, seatNumber: number) => {
      setAfterPartySeats((prev) => {
        const next = { ...prev };
        const set = new Set(prev[sectionId] ?? []);
        if (set.has(seatNumber)) {
          set.delete(seatNumber);
        } else {
          set.add(seatNumber);
        }
        if (set.size === 0) delete next[sectionId];
        else next[sectionId] = set;
        return next;
      });
    },
    [],
  );

  const handlePurchase = useCallback(async () => {
    const seats: SeatHoldRequest[] = [];
    for (const [sectionId, seatSet] of Object.entries(selectedSeats)) {
      for (const num of [...seatSet].sort((a, b) => a - b)) {
        seats.push({
          section: sectionId,
          seat: num,
          afterParty: afterPartyIncluded || (afterPartySeats[sectionId]?.has(num) ?? false),
        });
      }
    }

    if (seats.length === 0) return;

    setHoldState("loading");
    setHoldError(null);

    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seats, tier, locale }),
      });

      if (!res.ok) {
        const data = await res.json();
        setHoldState("error");
        if (data.failedSeats) {
          setHoldError(t("seatsTaken"));
        } else {
          setHoldError(t("holdError"));
        }
        return;
      }

      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl;
    } catch {
      setHoldState("error");
      setHoldError(t("holdError"));
    }
  }, [selectedSeats, afterPartySeats, afterPartyIncluded, tier, locale, t]);

  return (
    <div className="flex flex-col gap-6">
      {/* Seat Map Overview */}
      <SeatMapOverview />

      {/* Zone Selector */}
      <div className="rounded-2xl p-4 md:p-8 bg-black/40 backdrop-blur-xl border border-white/10">
        <ZoneSelector
          tier={tier}
          selectedSeats={selectedSeats}
          selectedSection={selectedSection}
          onSelectZone={handleSelectZone}
          sectionCounts={sectionCounts}
        />
      </div>

      {/* Seat Selector */}
      <div
        ref={seatSelectorRef}
        className="rounded-2xl p-4 md:p-8 bg-black/40 backdrop-blur-xl border border-white/10"
      >
        <SeatSelector
          tier={tier}
          sectionId={selectedSection}
          selectedSeats={
            selectedSection
              ? selectedSeats[selectedSection] ?? new Set()
              : new Set()
          }
          onToggleSeat={toggleSeat}
          seatStatuses={seatStatuses}
          loading={seatsLoading}
        />
      </div>

      {/* After Party Add-on */}
      {hasAfterPartyAddon && totalCount > 0 && (
        <AfterPartyAddon
          tier={tier}
          selectedSeats={selectedSeats}
          afterPartySeats={afterPartySeats}
          onToggle={toggleAfterParty}
          locale={locale}
        />
      )}

      {/* Sticky Summary + Purchase */}
      <SelectionSummary
        tier={tier}
        selectedSeats={selectedSeats}
        afterPartyCount={afterPartyCount}
        locale={locale}
        onPurchase={handlePurchase}
        holdState={holdState}
        holdError={holdError}
        phase={phase}
      />
    </div>
  );
}
