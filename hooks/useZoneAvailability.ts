"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { TierKey } from "@/app/[locale]/(2026)/_types/tickets";
import { TIER_SECTIONS } from "@/app/[locale]/(2026)/_constants/tierMapping";
import { getSelectableCount } from "@/app/[locale]/(2026)/_utils/tierMapping";

const POLL_INTERVAL = 8000;

export function useZoneAvailability(tier: TierKey) {
  const [sectionCounts, setSectionCounts] = useState<Record<string, number>>(
    () => {
      const initial: Record<string, number> = {};
      for (const id of TIER_SECTIONS[tier]) {
        initial[id] = getSelectableCount(id, tier);
      }
      return initial;
    },
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAvailability = useCallback(async () => {
    try {
      const res = await fetch(`/api/seats/availability?tier=${tier}`);
      if (!res.ok) return;
      const data = await res.json();
      setSectionCounts(data.sections);
    } catch {
      // Keep showing last known values
    }
  }, [tier]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    fetchAvailability();

    intervalRef.current = setInterval(fetchAvailability, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchAvailability]);

  return { sectionCounts };
}
