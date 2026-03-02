"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { TierKey } from "@/app/[locale]/(2026)/_types/tickets";
import type { SeatHoldRequest } from "@/app/[locale]/(2026)/_types/seats";
import { TICKETS } from "@/app/[locale]/(2026)/_constants/tickets";
import { useSessionId } from "@/hooks/useSessionId";
import { useSeatAvailability } from "@/hooks/useSeatAvailability";
import { useHoldTimer } from "@/hooks/useHoldTimer";
import ZoneSelector from "./ZoneSelector";
import SeatSelector from "./SeatSelector";
import AfterPartyAddon from "./AfterPartyAddon";
import SelectionSummary, { type HoldState } from "./SelectionSummary";

export default function PurchaseFlow({
  tier,
  locale,
}: {
  tier: TierKey;
  locale: string;
}) {
  const t = useTranslations("Tickets2026");
  const sessionId = useSessionId();

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

  const totalCount = Object.values(selectedSeats).reduce(
    (sum, set) => sum + set.size,
    0,
  );

  const afterPartyCount = Object.values(afterPartySeats).reduce(
    (sum, set) => sum + set.size,
    0,
  );

  // Seat availability polling
  const { seatStatuses } = useSeatAvailability(selectedSection);

  // Hold timer
  const {
    formatted: timerDisplay,
    isExpired,
    startTimer,
  } = useHoldTimer();

  // Handle timer expiration — release holds and reset
  useEffect(() => {
    if (!isExpired || !sessionId) return;

    fetch("/api/seats/release", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });

    setHoldState("idle");
    setSelectedSeats({});
    setAfterPartySeats({});
    setHoldError(t("holdExpired"));
  }, [isExpired, sessionId, t]);

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
    if (!sessionId) return;

    const seats: SeatHoldRequest[] = [];
    for (const [sectionId, seatSet] of Object.entries(selectedSeats)) {
      for (const num of [...seatSet].sort((a, b) => a - b)) {
        seats.push({
          section: sectionId,
          seat: num,
          afterParty: afterPartySeats[sectionId]?.has(num) ?? false,
        });
      }
    }

    if (seats.length === 0) return;

    setHoldState("holding");
    setHoldError(null);

    try {
      // Step 1: Hold seats (7 min lock)
      const holdRes = await fetch("/api/seats/hold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, seats, tier }),
      });

      if (!holdRes.ok) {
        const data = await holdRes.json();
        setHoldState("error");
        if (data.failedSeats) {
          setHoldError(t("seatsTaken"));
        } else if (data.error?.includes("already have")) {
          setHoldError(t("alreadyHeld"));
        } else {
          setHoldError(t("holdError"));
        }
        return;
      }

      // Step 2: Start countdown timer
      startTimer();

      // Step 3: Create Shopify checkout
      setHoldState("checking_out");
      const checkoutRes = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      if (!checkoutRes.ok) {
        setHoldState("error");
        setHoldError(t("holdError"));
        return;
      }

      const { checkoutUrl } = await checkoutRes.json();

      // Step 4: Redirect to Shopify payment page
      window.location.href = checkoutUrl;
    } catch {
      setHoldState("error");
      setHoldError(t("holdError"));
    }
  }, [sessionId, selectedSeats, afterPartySeats, tier, startTimer, t]);

  return (
    <div className="flex flex-col gap-6">
      {/* Zone Selector */}
      <div className="rounded-2xl p-4 md:p-8 bg-black/40 backdrop-blur-xl border border-white/10">
        <ZoneSelector
          tier={tier}
          selectedSeats={selectedSeats}
          selectedSection={selectedSection}
          onSelectZone={handleSelectZone}
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
        timerDisplay={timerDisplay}
        holdError={holdError}
      />
    </div>
  );
}
