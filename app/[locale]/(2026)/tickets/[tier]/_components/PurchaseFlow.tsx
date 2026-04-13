"use client";

import { useState, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import type {
  TierKey,
  PricingPhase,
} from "@/app/[locale]/(2026)/_types/tickets";
import type { SeatHoldRequest } from "@/app/[locale]/(2026)/_types/seats";
import { TICKETS } from "@/app/[locale]/(2026)/_constants/tickets";
import { useSeatAvailability } from "@/hooks/useSeatAvailability";
import { useZoneAvailability } from "@/hooks/useZoneAvailability";
import ZoneSelector from "./ZoneSelector";
import SeatSelector from "./SeatSelector";
import AfterPartyAddon from "./AfterPartyAddon";
import SelectionSummary, { type HoldState } from "./SelectionSummary";

type Step = "seats" | "afterParty";

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

  const [step, setStep] = useState<Step>("seats");
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

  const afterPartyCount = Object.values(afterPartySeats).reduce(
    (sum, set) => sum + set.size,
    0,
  );

  // Seat availability polling
  const { seatStatuses, loading: seatsLoading } =
    useSeatAvailability(selectedSection);
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

  const isSubmittingRef = useRef(false);

  const handlePurchase = useCallback(async () => {
    if (isSubmittingRef.current) return;

    alert("시스템 점검 중입니다. 잠시 후 다시 시도해주세요.\n\nSystem maintenance in progress. Please try again later.");
    return;

    const seats: SeatHoldRequest[] = [];
    for (const [sectionId, seatSet] of Object.entries(selectedSeats)) {
      for (const num of [...seatSet].sort((a, b) => a - b)) {
        seats.push({
          section: sectionId,
          seat: num,
          afterParty:
            afterPartyIncluded ||
            (afterPartySeats[sectionId]?.has(num) ?? false),
        });
      }
    }

    if (seats.length === 0) return;

    isSubmittingRef.current = true;
    setHoldState("loading");
    setHoldError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30_000);

    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seats, tier, locale }),
        signal: controller.signal,
      });

      if (!res.ok) {
        let failedSeats = false;
        try { failedSeats = !!(await res.json()).failedSeats; } catch {}
        setHoldState("error");
        setHoldError(failedSeats ? t("seatsTaken") : t("holdError"));
        return;
      }

      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl;
    } catch {
      setHoldState("error");
      setHoldError(t("holdError"));
    } finally {
      clearTimeout(timeoutId);
      isSubmittingRef.current = false;
    }
  }, [selectedSeats, afterPartySeats, afterPartyIncluded, tier, locale, t]);

  const handleNext = useCallback(() => {
    if (hasAfterPartyAddon) {
      setStep("afterParty");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handlePurchase();
    }
  }, [hasAfterPartyAddon, handlePurchase]);

  const handleBack = useCallback(() => {
    setStep("seats");
    setHoldState("idle");
    setHoldError(null);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {step === "seats" && (
        <motion.div
          key="seats"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-6"
        >
          {/* Zone Selector */}
          <ZoneSelector
            tier={tier}
            selectedSeats={selectedSeats}
            selectedSection={selectedSection}
            onSelectZone={handleSelectZone}
            sectionCounts={sectionCounts}
          />

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
                  ? (selectedSeats[selectedSection] ?? new Set())
                  : new Set()
              }
              onToggleSeat={toggleSeat}
              seatStatuses={seatStatuses}
              loading={seatsLoading}
            />
          </div>

          {/* Sticky Summary — "다음" when afterParty addon available */}
          <SelectionSummary
            tier={tier}
            selectedSeats={selectedSeats}
            afterPartyCount={afterPartyCount}
            locale={locale}
            onPurchase={handlePurchase}
            onNext={hasAfterPartyAddon ? handleNext : undefined}
            holdState={holdState}
            holdError={holdError}
            phase={phase}
          />
        </motion.div>
      )}

      {step === "afterParty" && (
        <motion.div
          key="afterParty"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.25 }}
        >
          <AfterPartyAddon
            selectedSeats={selectedSeats}
            afterPartySeats={afterPartySeats}
            onToggle={toggleAfterParty}
            locale={locale}
            onPurchase={handlePurchase}
            onBack={handleBack}
            holdState={holdState}
            holdError={holdError}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
