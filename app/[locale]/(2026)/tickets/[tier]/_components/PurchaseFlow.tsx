"use client";

import { useState, useCallback, useRef } from "react";
import type { TierKey } from "@/app/[locale]/(2026)/_types/tickets";
import {
  TICKETS,
  AFTER_PARTY_PRICE,
} from "@/app/[locale]/(2026)/_constants/tickets";
import { getDiscountedPrice } from "@/app/[locale]/(2026)/_utils/tickets";
import ZoneSelector from "./ZoneSelector";
import SeatSelector from "./SeatSelector";
import AfterPartyAddon from "./AfterPartyAddon";
import SelectionSummary from "./SelectionSummary";

export default function PurchaseFlow({
  tier,
  locale,
}: {
  tier: TierKey;
  locale: string;
}) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<
    Record<string, Set<number>>
  >({});
  const [afterPartySeats, setAfterPartySeats] = useState<
    Record<string, Set<number>>
  >({});

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
        // Also remove from afterPartySeats
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

  const handlePurchase = useCallback(() => {
    const unitPrice = getDiscountedPrice(ticket.basePrice);

    const tickets: { section: string; seat: number; afterParty: boolean }[] = [];
    for (const [sectionId, seatSet] of Object.entries(selectedSeats)) {
      for (const num of [...seatSet].sort((a, b) => a - b)) {
        tickets.push({
          section: sectionId,
          seat: num,
          afterParty: afterPartySeats[sectionId]?.has(num) ?? false,
        });
      }
    }

    const apCount = tickets.filter((t) => t.afterParty).length;

    console.log({
      tier,
      tickets,
      totalTickets: tickets.length,
      unitPrice,
      ticketSubtotal: tickets.length * unitPrice,
      afterPartyCount: apCount,
      afterPartyTotal: apCount * AFTER_PARTY_PRICE,
      grandTotal: tickets.length * unitPrice + apCount * AFTER_PARTY_PRICE,
    });
  }, [tier, selectedSeats, afterPartySeats, ticket.basePrice]);

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

      {/* Seat Selector - always visible */}
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
      />
    </div>
  );
}
