"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { SeatStatus } from "@/app/[locale]/(2026)/_types/seats";

const POLL_INTERVAL = 5000;

export function useSeatAvailability(section: string | null) {
  const [seatStatuses, setSeatStatuses] = useState<Record<number, SeatStatus>>(
    {},
  );
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sectionRef = useRef(section);
  sectionRef.current = section;

  const startPolling = useCallback(
    (sectionId: string) => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(
        () => fetchStatus(sectionId),
        POLL_INTERVAL,
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

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

  // Pause polling when tab is hidden, resume when visible
  useEffect(() => {
    const handleVisibility = () => {
      const sec = sectionRef.current;
      if (!sec) return;

      if (document.visibilityState === "visible") {
        fetchStatus(sec);
        startPolling(sec);
      } else {
        stopPolling();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [fetchStatus, startPolling, stopPolling]);

  useEffect(() => {
    stopPolling();

    if (!section) {
      setSeatStatuses({});
      return;
    }

    setLoading(true);
    fetchStatus(section).finally(() => setLoading(false));

    if (document.visibilityState === "visible") {
      startPolling(section);
    }

    return stopPolling;
  }, [section, fetchStatus, startPolling, stopPolling]);

  return { seatStatuses, loading };
}
