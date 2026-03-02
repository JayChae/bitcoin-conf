"use client";

import { useState, useEffect } from "react";

function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

export function useSessionId(): string {
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("bkc-session-id");
    if (stored) {
      setSessionId(stored);
    } else {
      const id = generateSessionId();
      localStorage.setItem("bkc-session-id", id);
      setSessionId(id);
    }
  }, []);

  return sessionId;
}
