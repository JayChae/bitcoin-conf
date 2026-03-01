"use client";

import { useState, useCallback } from "react";
import type { TierKey } from "@/app/[locale]/(2026)/_types/tickets";
import ZoneSelector from "./ZoneSelector";
import SeatSelector from "./SeatSelector";
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

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl p-4 md:p-8 bg-black/40 backdrop-blur-xl border border-white/10">
        <ZoneSelector
          tier={tier}
          selectedSeats={selectedSeats}
          selectedSection={selectedSection}
          onSelectZone={setSelectedSection}
        />
      </div>

      {selectedSection && (
        <div className="rounded-2xl p-4 md:p-8 bg-black/40 backdrop-blur-xl border border-white/10">
          <SeatSelector
            tier={tier}
            sectionId={selectedSection}
            selectedSeats={selectedSeats[selectedSection] ?? new Set()}
            onToggleSeat={toggleSeat}
          />
        </div>
      )}

      <SelectionSummary
        tier={tier}
        selectedSeats={selectedSeats}
        locale={locale}
      />
    </div>
  );
}
