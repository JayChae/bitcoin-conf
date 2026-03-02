"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { SeatStatus } from "@/app/[locale]/(2026)/_types/seats";

const POLL_INTERVAL = 3000;

export function useSeatAvailability(section: string | null) {
  const [seatStatuses, setSeatStatuses] = useState<Record<number, SeatStatus>>(
    {},
  );
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStatus = useCallback(async (sectionId: string) => {
    try {
      const res = await fetch(`/api/seats/status?section=${sectionId}`);
      if (!res.ok) return;
      const data = await res.json();
      setSeatStatuses(data.seats);
    } catch {
      // Silently ignore polling errors
    }
  }, []);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!section) {
      setSeatStatuses({});
      return;
    }

    setLoading(true);
    fetchStatus(section).finally(() => setLoading(false));

    intervalRef.current = setInterval(() => fetchStatus(section), POLL_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [section, fetchStatus]);

  return { seatStatuses, loading };
}
