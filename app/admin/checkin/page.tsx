"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

type CheckinResult =
  | { valid: false; reason: string }
  | {
      valid: true;
      alreadyCheckedIn: boolean;
      payload: { cid: string; sec: string; seat: number; tier: string; ap: boolean };
      checkedInAt?: string;
    };

export default function CheckinPage() {
  const router = useRouter();
  const [manualInput, setManualInput] = useState("");
  const [result, setResult] = useState<CheckinResult | null>(null);
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);
  const lastScannedRef = useRef<string>("");
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissResult = useCallback(() => {
    setResult(null);
    lastScannedRef.current = "";
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
  }, []);

  // ─── Verify Token ───

  const verifyToken = useCallback(async (token: string) => {
    // Prevent duplicate scans of the same token
    if (token === lastScannedRef.current) return;
    lastScannedRef.current = token;

    try {
      const res = await fetch("/api/checkin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (res.status === 401) {
        router.refresh();
        return;
      }
      const data: CheckinResult = await res.json();
      setResult(data);

      // Clear previous auto-dismiss timer
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }

      // Haptic feedback
      try {
        if (navigator.vibrate) {
          if (!data.valid || data.alreadyCheckedIn) {
            navigator.vibrate([200, 100, 200]);
          } else {
            navigator.vibrate(200);
          }
        }
      } catch {
        // vibrate not supported
      }

      // Auto-dismiss after 3 seconds
      dismissTimerRef.current = setTimeout(() => {
        setResult(null);
        lastScannedRef.current = "";
        dismissTimerRef.current = null;
      }, 3000);
    } catch {
      setResult({ valid: false, reason: "Network error" });
    }
  }, [router]);

  // ─── Camera Scanner ───

  const startScanner = useCallback(async () => {
    if (!scannerRef.current) return;
    setCameraError("");

    // Make container visible BEFORE starting scanner so clientWidth > 0
    setScanning(true);

    // Wait for React to render the visible container
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          verifyToken(decodedText);
        },
        () => {
          // ignore scan failures (no QR detected in frame)
        },
      );

      // Fix Tailwind preflight killing video visibility
      const video = scannerRef.current?.querySelector("video");
      if (video) {
        video.style.maxWidth = "none";
        video.style.height = "100%";
        video.style.objectFit = "cover";
      }

      // Scroll camera preview into view on mobile
      setTimeout(() => {
        scannerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } catch (err) {
      setScanning(false);
      setCameraError(
        err instanceof Error ? err.message : "Camera access denied",
      );
    }
  }, [verifyToken]);

  const stopScanner = useCallback(async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
      } catch {
        // already stopped
      }
      html5QrCodeRef.current = null;
    }
    setScanning(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanner();
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
    };
  }, [stopScanner]);

  // ─── Manual Input ───

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      verifyToken(manualInput.trim());
      setManualInput("");
    }
  };

  // ─── Main UI ───

  const tierColors: Record<string, string> = {
    vip: "#FFD700",
    premium: "#FF8C00",
    general: "#4CAF50",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "system-ui, sans-serif", padding: 16 }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, textAlign: "center", marginBottom: 24 }}>Check-in Scanner</h1>

        {/* Camera Scanner */}
        <div style={{ marginBottom: 24 }}>
          {!scanning ? (
            <button
              onClick={startScanner}
              style={{ width: "100%", padding: "14px 16px", borderRadius: 8, border: "none", background: "#FF8C00", color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer" }}
            >
              Start Camera
            </button>
          ) : (
            <button
              onClick={stopScanner}
              style={{ width: "100%", padding: "14px 16px", borderRadius: 8, border: "none", background: "#333", color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer" }}
            >
              Stop Camera
            </button>
          )}
          {cameraError && (
            <p style={{ color: "#FF4500", fontSize: 14, marginTop: 8 }}>{cameraError}</p>
          )}
          <div
            id="qr-reader"
            ref={scannerRef}
            style={{
              marginTop: 16,
              borderRadius: 12,
              overflow: "hidden",
              display: scanning ? "block" : "none",
              border: "2px solid #FF8C00",
              background: "#111",
              minHeight: scanning ? 300 : 0,
              WebkitTransform: "translateZ(0)",
              isolation: "isolate" as const,
            }}
          />
        </div>

        {/* Manual Input */}
        <form onSubmit={handleManualSubmit} style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Paste QR token..."
            style={{ flex: 1, padding: "12px 16px", borderRadius: 8, border: "1px solid #333", background: "#111", color: "#fff", fontSize: 14 }}
          />
          <button
            type="submit"
            style={{ padding: "12px 20px", borderRadius: 8, border: "none", background: "#333", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
          >
            Verify
          </button>
        </form>

      </div>

      {/* Full-screen result overlay */}
      <AnimatePresence>
        {result && (
          <CheckinResultOverlay
            key="checkin-overlay"
            result={result}
            onDismiss={dismissResult}
            tierColors={tierColors}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckinResultOverlay({
  result,
  onDismiss,
  tierColors,
}: {
  result: CheckinResult;
  onDismiss: () => void;
  tierColors: Record<string, string>;
}) {
  const isInvalid = !result.valid;
  const isDuplicate = result.valid && result.alreadyCheckedIn;

  const config = isInvalid
    ? { bg: "rgba(220, 38, 38, 0.95)", icon: "✗", label: "INVALID", sublabel: result.reason }
    : isDuplicate
      ? {
          bg: "rgba(217, 119, 6, 0.95)",
          icon: "⚠",
          label: "ALREADY CHECKED IN",
          sublabel: `Checked in at: ${new Date(result.checkedInAt!).toLocaleString("ko-KR")}`,
        }
      : { bg: "rgba(22, 163, 74, 0.95)", icon: "✓", label: "WELCOME", sublabel: null };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onDismiss}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: config.bg,
        cursor: "pointer",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        style={{ textAlign: "center", padding: 32, maxWidth: 400, width: "100%" }}
      >
        <p style={{ fontSize: 96, margin: "0 0 16px", lineHeight: 1 }}>{config.icon}</p>
        <p style={{ fontSize: 32, fontWeight: 800, color: "#fff", margin: "0 0 16px", letterSpacing: "0.05em", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
          {config.label}
        </p>

        {result.valid && (
          <div style={{ fontSize: 24, lineHeight: 1.6, color: "rgba(255,255,255,0.95)" }}>
            <p style={{ margin: "0 0 8px" }}>
              <span style={{ color: tierColors[result.payload.tier] ?? "#fff", fontWeight: 800, textTransform: "uppercase", fontSize: 28, textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
                {result.payload.tier}
              </span>
            </p>
            <p style={{ margin: 0, fontSize: 22 }}>
              Section <span style={{ fontWeight: 700 }}>{result.payload.sec}</span>
              {" · "}Seat <span style={{ fontWeight: 700 }}>{result.payload.seat}</span>
            </p>
            {result.payload.ap && (
              <p style={{ margin: "8px 0 0", fontSize: 22 }}>✓ After Party</p>
            )}
          </div>
        )}

        {config.sublabel && (
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", marginTop: 16 }}>{config.sublabel}</p>
        )}

        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginTop: 32 }}>
          Tap anywhere to dismiss
        </p>
      </motion.div>
    </motion.div>
  );
}
