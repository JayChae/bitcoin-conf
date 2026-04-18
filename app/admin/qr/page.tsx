"use client";

import { useState } from "react";
import type { QRPayload } from "@/lib/qr";

function decodeToken(token: string): QRPayload | null {
  try {
    const dotIndex = token.lastIndexOf(".");
    if (dotIndex === -1) return null;
    const b64 = token.slice(0, dotIndex).replace(/-/g, "+").replace(/_/g, "/");
    const data = decodeURIComponent(
      atob(b64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(data) as QRPayload;
  } catch {
    return null;
  }
}

function downloadQR(token: string, filename: string) {
  const a = document.createElement("a");
  a.href = `/api/qr/${token}`;
  a.download = filename;
  a.click();
}

export default function QRAdminPage() {
  const [tokenInput, setTokenInput] = useState("");
  const [decoded, setDecoded] = useState<QRPayload | null>(null);
  const [decodeAttempted, setDecodeAttempted] = useState(false);

  const [fields, setFields] = useState({ cid: "", sec: "", seat: "", tier: "premium", ap: false });
  const [generatedToken, setGeneratedToken] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");

  const handleTokenChange = (value: string) => {
    setTokenInput(value);
    setDecoded(null);
    setDecodeAttempted(false);
  };

  const handleDecode = () => {
    const token = tokenInput.trim();
    if (!token) return;
    setDecoded(decodeToken(token));
    setDecodeAttempted(true);
  };

  const fillFromDecoded = () => {
    if (!decoded) return;
    setFields({
      cid: decoded.cid,
      sec: decoded.sec,
      seat: String(decoded.seat),
      tier: decoded.tier,
      ap: decoded.ap,
    });
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGenError("");
    setGeneratedToken("");
    const res = await fetch("/api/admin/qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...fields, seat: Number(fields.seat) }),
    });
    setGenerating(false);
    if (res.ok) {
      const { token } = await res.json();
      setGeneratedToken(token);
    } else {
      const { error } = await res.json();
      setGenError(error ?? "오류가 발생했습니다.");
    }
  };

  const trimmedToken = tokenInput.trim();
  const inputCls = "w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-neutral-600 font-mono";
  const labelCls = "block text-xs text-neutral-500 mb-1.5";

  return (
    <div className="min-h-screen bg-black text-white max-w-lg mx-auto px-5 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-lg font-bold text-neutral-200">QR 관리</h1>
        <a
          href="/admin"
          className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-neutral-400 hover:text-neutral-200 hover:border-neutral-600 transition-colors"
        >
          ← Admin
        </a>
      </div>

      <section className="mb-10">
        <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">
          토큰 분석
        </h2>
        <div className="space-y-3">
          <div>
            <label className={labelCls}>QR Token</label>
            <textarea
              rows={3}
              value={tokenInput}
              onChange={(e) => handleTokenChange(e.target.value)}
              placeholder="_qr_token 값 붙여넣기"
              className={inputCls + " resize-none"}
            />
          </div>
          <button
            onClick={handleDecode}
            className="w-full py-2.5 rounded-lg bg-neutral-800 text-sm text-neutral-200 hover:bg-neutral-700 transition-colors"
          >
            디코딩
          </button>
        </div>

        {decodeAttempted && !decoded && (
          <p className="mt-3 text-sm text-red-400">유효하지 않은 토큰입니다.</p>
        )}

        {decoded && (
          <div className="mt-4 rounded-lg bg-neutral-900 border border-neutral-800 p-4 space-y-2">
            <Row label="cid" value={decoded.cid} />
            <Row label="섹션" value={decoded.sec} />
            <Row label="좌석" value={String(decoded.seat)} />
            <Row label="티어" value={decoded.tier.toUpperCase()} />
            <Row label="애프터파티" value={decoded.ap ? "✓ 포함" : "✗ 미포함"} highlight={decoded.ap} />

            <div className="pt-3 flex flex-col items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/qr/${trimmedToken}`}
                alt="QR Code"
                width={180}
                height={180}
                className="rounded-lg"
              />
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => downloadQR(trimmedToken, `qr-${decoded.sec}${decoded.seat}.png`)}
                  className="flex-1 py-2 rounded-lg bg-neutral-800 text-sm text-neutral-200 hover:bg-neutral-700 transition-colors"
                >
                  QR 다운로드
                </button>
                <button
                  onClick={fillFromDecoded}
                  className="flex-1 py-2 rounded-lg bg-neutral-800 text-sm text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200 transition-colors"
                >
                  아래에 채우기 ↓
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      <hr className="border-neutral-800 mb-10" />

      <section className="mb-10">
        <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">
          QR 생성
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>CID</label>
              <input
                type="text"
                value={fields.cid}
                onChange={(e) => setFields({ ...fields, cid: e.target.value })}
                placeholder="328432a6"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>섹션</label>
              <input
                type="text"
                value={fields.sec}
                onChange={(e) => setFields({ ...fields, sec: e.target.value })}
                placeholder="C"
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>좌석 번호</label>
              <input
                type="number"
                value={fields.seat}
                onChange={(e) => setFields({ ...fields, seat: e.target.value })}
                placeholder="42"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>티어</label>
              <select
                value={fields.tier}
                onChange={(e) => setFields({ ...fields, tier: e.target.value })}
                className={inputCls}
              >
                <option value="vip">VIP</option>
                <option value="premium">Premium</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-3 px-3 py-3 rounded-lg bg-neutral-900 border border-neutral-800 cursor-pointer hover:border-neutral-700 transition-colors">
            <input
              type="checkbox"
              checked={fields.ap}
              onChange={(e) => setFields({ ...fields, ap: e.target.checked })}
              className="w-4 h-4 accent-white"
            />
            <span className="text-sm text-neutral-200">애프터파티 포함</span>
            {fields.ap && (
              <span className="ml-auto text-xs text-amber-400">AP ✓</span>
            )}
          </label>

          <button
            onClick={handleGenerate}
            disabled={generating || !fields.cid || !fields.sec || !fields.seat}
            className="w-full py-3 rounded-xl bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition-colors disabled:opacity-40"
          >
            {generating ? "생성 중..." : "토큰 & QR 생성"}
          </button>

          {genError && (
            <p className="text-sm text-red-400">{genError}</p>
          )}
        </div>

        {generatedToken && (
          <div className="mt-4 rounded-lg bg-neutral-900 border border-neutral-800 p-4 space-y-3">
            <div>
              <p className="text-xs text-neutral-500 mb-1.5">Token</p>
              <p
                className="text-xs text-neutral-300 font-mono break-all bg-neutral-950 rounded p-2 cursor-pointer select-all"
                onClick={() => navigator.clipboard.writeText(generatedToken)}
                title="클릭하여 복사"
              >
                {generatedToken}
              </p>
              <p className="text-xs text-neutral-600 mt-1">클릭하여 복사</p>
            </div>

            <div className="flex flex-col items-center gap-3 pt-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/qr/${generatedToken}`}
                alt="Generated QR Code"
                width={200}
                height={200}
                className="rounded-lg"
              />
              <button
                onClick={() => downloadQR(generatedToken, `qr-${fields.sec}${fields.seat}-new.png`)}
                className="w-full py-2.5 rounded-lg bg-neutral-800 text-sm text-neutral-200 hover:bg-neutral-700 transition-colors"
              >
                QR 다운로드
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-neutral-500">{label}</span>
      <span className={`text-sm font-mono ${highlight ? "text-amber-400" : "text-neutral-200"}`}>
        {value}
      </span>
    </div>
  );
}
