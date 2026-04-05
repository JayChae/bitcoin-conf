"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

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

      // Reset duplicate guard after 3 seconds to allow re-scan
      setTimeout(() => {
        lastScannedRef.current = "";
      }, 3000);
    } catch {
      setResult({ valid: false, reason: "Network error" });
    }
  }, [router]);

  // ─── Camera Scanner ───

  const startScanner = useCallback(async () => {
    if (!scannerRef.current) return;
    setCameraError("");

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
      setScanning(true);
    } catch (err) {
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
            style={{ marginTop: 16, borderRadius: 12, overflow: "hidden", display: scanning ? "block" : "none" }}
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

        {/* Result Display */}
        {result && (
          <div
            style={{
              padding: 24,
              borderRadius: 12,
              border: `2px solid ${!result.valid ? "#FF4500" : result.alreadyCheckedIn ? "#FFD700" : "#4CAF50"}`,
              background: !result.valid ? "rgba(255,69,0,0.1)" : result.alreadyCheckedIn ? "rgba(255,215,0,0.1)" : "rgba(76,175,80,0.1)",
              textAlign: "center",
            }}
          >
            {!result.valid ? (
              <>
                <p style={{ fontSize: 48, margin: "0 0 8px" }}>✗</p>
                <p style={{ fontSize: 20, fontWeight: 700, color: "#FF4500", margin: "0 0 4px" }}>INVALID</p>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", margin: 0 }}>{result.reason}</p>
              </>
            ) : result.alreadyCheckedIn ? (
              <>
                <p style={{ fontSize: 48, margin: "0 0 8px" }}>⚠</p>
                <p style={{ fontSize: 20, fontWeight: 700, color: "#FFD700", margin: "0 0 12px" }}>ALREADY CHECKED IN</p>
                <SeatInfo payload={result.payload} tierColors={tierColors} />
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 12 }}>
                  Checked in at: {new Date(result.checkedInAt!).toLocaleString("ko-KR")}
                </p>
              </>
            ) : (
              <>
                <p style={{ fontSize: 48, margin: "0 0 8px" }}>✓</p>
                <p style={{ fontSize: 20, fontWeight: 700, color: "#4CAF50", margin: "0 0 12px" }}>WELCOME</p>
                <SeatInfo payload={result.payload} tierColors={tierColors} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SeatInfo({
  payload,
  tierColors,
}: {
  payload: { sec: string; seat: number; tier: string; ap: boolean };
  tierColors: Record<string, string>;
}) {
  return (
    <div style={{ fontSize: 16, lineHeight: 1.8 }}>
      <p style={{ margin: 0 }}>
        <span style={{ color: tierColors[payload.tier] ?? "#fff", fontWeight: 700, textTransform: "uppercase" }}>
          {payload.tier}
        </span>
      </p>
      <p style={{ margin: 0 }}>
        Section <span style={{ color: "#FF8C00", fontWeight: 700 }}>{payload.sec}</span>
        {" · "}Seat <span style={{ fontWeight: 700 }}>{payload.seat}</span>
      </p>
      {payload.ap && (
        <p style={{ margin: 0, color: "#FF8C00" }}>✓ After Party</p>
      )}
    </div>
  );
}
