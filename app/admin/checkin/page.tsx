"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { TIER_VALID_DAYS, tierLabel } from "@/app/[locale]/(2026)/_constants/tickets";
import type { TierKey } from "@/app/[locale]/(2026)/_types/tickets";

type CheckinResult =
  | { valid: false; reason: string }
  | {
      valid: true;
      alreadyCheckedIn: boolean;
      payload: { cid: string; sec: string; seat: number; tier: string; ap: boolean };
      checkedInAt?: string;
    };

/** 서버·네트워크 오류. 티켓 무효(INVALID)와 구분해 "다시 스캔"으로 보여준다 */
type ScanResult = CheckinResult | { error: true };

/** 같은 QR은 카메라에서 이만큼 사라졌다가 다시 잡혀야 다시 처리한다 */
const RESCAN_GAP_MS = 2000;
/** 응답이 이보다 늦으면 오류로 보고 스캐너를 풀어준다 */
const VERIFY_TIMEOUT_MS = 8000;
/** 실패한 시도 이후의 체크인 기록인지 판단할 때 허용하는 폰·서버 시계 오차 */
const CLOCK_SKEW_MS = 30_000;

function buzz(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    // vibrate not supported
  }
}

/** 스캐너 판독용 티어 식별색 (좌석도의 TIER_COLORS와는 목적이 다른 별개 팔레트) */
const TIER_COLORS: Record<TierKey, string> = {
  vip: "#FFD700",
  premium: "#FF8C00",
  general: "#FFFFFF",
  mainday: "#22D3EE",
};

export default function CheckinPage() {
  const router = useRouter();
  const [manualInput, setManualInput] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);
  const lastScannedRef = useRef<string>("");
  // 마지막으로 처리한 QR이 카메라에 마지막으로 잡힌 시각
  const lastSeenAtRef = useRef(0);
  // 확인 중이거나 결과 화면이 떠 있는 동안 true — 그 사이 잡힌 QR(뒷사람 것 포함)은 무시한다
  const busyRef = useRef(false);
  // 오류로 끝난 시도 — 같은 QR을 재시도했을 때 결과를 해석하는 데 쓴다
  const failedAttemptRef = useRef<{ token: string; startedAt: number } | null>(null);
  const dismissResult = useCallback(() => {
    setResult(null);
    busyRef.current = false;
    // 닫는 순간을 "방금 봤다"로 친다. 결과를 보는 사이 QR을 잠깐 놓쳤다가
    // 닫을 때 다시 비춰도 같은 손님이 다시 처리되지 않는다
    lastSeenAtRef.current = Date.now();
  }, []);

  // ─── Verify Token ───

  const verifyToken = useCallback(async (token: string) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setChecking(true);
    lastScannedRef.current = token;
    const startedAt = Date.now();
    lastSeenAtRef.current = startedAt;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);
    try {
      const res = await fetch("/api/checkin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
        signal: controller.signal,
      });
      if (res.status === 401) {
        busyRef.current = false;
        lastScannedRef.current = "";
        router.refresh();
        return;
      }
      // 서버 오류를 티켓 무효로 보여주면 정상 손님을 돌려보내게 된다
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      let data: CheckinResult = await res.json();

      const failed = failedAttemptRef.current;
      if (failed?.token === token) {
        failedAttemptRef.current = null;
        // 실패로 보였던 시도가 실은 서버에 닿아 기록됐던 경우 — 그 기록이 이 손님의 최초 입장이다
        if (
          data.valid &&
          data.alreadyCheckedIn &&
          Date.parse(data.checkedInAt!) >= failed.startedAt - CLOCK_SKEW_MS
        ) {
          data = { valid: true, alreadyCheckedIn: false, payload: data.payload };
        }
      }
      setResult(data);

      // Haptic feedback
      buzz(!data.valid || data.alreadyCheckedIn ? [200, 100, 200] : 200);
    } catch {
      // 결과 화면을 닫으면 같은 QR을 바로 다시 시도할 수 있게 한다
      lastScannedRef.current = "";
      if (failedAttemptRef.current?.token !== token) {
        failedAttemptRef.current = { token, startedAt };
      }
      setResult({ error: true });
      buzz([100, 50, 100, 50, 100]);
    } finally {
      clearTimeout(timeout);
      setChecking(false);
    }
  }, [router]);

  /**
   * 카메라는 QR이 화면에 있는 동안 같은 값을 계속 보고한다.
   * 결과 화면을 닫은 직후 같은 QR이 다시 잡혀 "이미 체크인됨"이 뜨지 않도록,
   * 같은 QR은 카메라에서 잠시 사라졌다가 다시 나타나야 처리한다.
   */
  const handleDecoded = useCallback((token: string) => {
    if (token === lastScannedRef.current) {
      const now = Date.now();
      const stillInView = now - lastSeenAtRef.current < RESCAN_GAP_MS;
      lastSeenAtRef.current = now;
      if (stillInView) return;
    }
    verifyToken(token);
  }, [verifyToken]);

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
          handleDecoded(decodedText);
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
  }, [handleDecoded]);

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
    // 확인 중에는 입력을 지우지 않고 남겨 둔다 — 지우면 처리 안 된 줄 모른다
    if (busyRef.current) return;
    if (manualInput.trim()) {
      verifyToken(manualInput.trim());
      setManualInput("");
    }
  };

  // ─── Main UI ───

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

      {/* 확인 중 표시 — 응답이 빠르면 깜빡이지 않도록 잠깐 늦게 나타난다 */}
      {checking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.15 }}
          style={{ position: "fixed", inset: 0, zIndex: 40, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0, 0, 0, 0.7)" }}
        >
          <p style={{ fontSize: 28, fontWeight: 800, color: "#fff", textAlign: "center", lineHeight: 1.4 }}>
            확인 중…
            <br />
            <span style={{ fontSize: 18, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>Checking…</span>
          </p>
        </motion.div>
      )}

      {/* Full-screen result overlay */}
      <AnimatePresence>
        {result && (
          <CheckinResultOverlay
            key="checkin-overlay"
            result={result}
            onDismiss={dismissResult}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckinResultOverlay({
  result,
  onDismiss,
}: {
  result: ScanResult;
  onDismiss: () => void;
}) {
  const ticket = "error" in result || !result.valid ? null : result;
  const validity = ticket
    ? TIER_VALID_DAYS[ticket.payload.tier as TierKey]
    : undefined;

  const config =
    "error" in result
      ? {
          bg: "rgba(51, 65, 85, 0.95)",
          icon: "↻",
          label: "SCAN AGAIN",
          sublabel: "통신 오류 — 티켓 문제가 아닙니다 · Network error, not a ticket problem",
        }
      : !result.valid
        ? { bg: "rgba(220, 38, 38, 0.95)", icon: "✗", label: "INVALID", sublabel: result.reason }
        : result.alreadyCheckedIn
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

        {ticket && (
          <div style={{ fontSize: 24, lineHeight: 1.6, color: "rgba(255,255,255,0.95)" }}>
            <p style={{ margin: "0 0 8px" }}>
              <span style={{ color: TIER_COLORS[ticket.payload.tier as TierKey] ?? "#fff", fontWeight: 800, textTransform: "uppercase", fontSize: 28, textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
                {tierLabel(ticket.payload.tier)}
              </span>
            </p>
            {validity && (
              <p style={{ margin: "0 0 12px" }}>
                <span style={{ display: "inline-block", background: TIER_COLORS[ticket.payload.tier as TierKey] ?? "#22D3EE", color: "#000", fontSize: 22, fontWeight: 800, padding: "6px 14px", borderRadius: 999, letterSpacing: "0.02em" }}>
                  {validity.badge}
                </span>
              </p>
            )}
            <p style={{ margin: 0, fontSize: 22 }}>
              Section <span style={{ fontWeight: 700 }}>{ticket.payload.sec}</span>
              {" · "}Seat <span style={{ fontWeight: 700 }}>{ticket.payload.seat}</span>
            </p>
            {ticket.payload.ap && (
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
