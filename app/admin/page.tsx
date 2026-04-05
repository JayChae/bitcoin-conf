"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

type PricingConfig = {
  phase1: {
    startDate: string;
    endDate: string;
    enabled: boolean;
  };
  phase2: {
    maxTickets: Record<string, number>;
    enabled: boolean;
  };
  override: string | null;
};

type PhaseSold = Record<string, Record<string, number>>;

type PricingData = {
  config: PricingConfig;
  tiers: Record<string, { phase: string; sold: number }>;
  phaseSold: PhaseSold;
};

type ActiveMode = "earlybird1" | "earlybird2" | "regular";
type Tab = "pricing" | "seats";

type SoldSeatRecord = {
  section: string;
  seat: number;
  tier: string;
  afterParty: boolean;
  email?: string;
};

type SeatSummary = {
  byTier: Record<string, { total: number; sold: number; remaining: number }>;
  afterPartyCount: number;
  fillRate: number;
  soldSeats: SoldSeatRecord[];
};

function getActiveMode(config: PricingConfig): ActiveMode {
  if (config.phase1.enabled) return "earlybird1";
  if (config.phase2.enabled) return "earlybird2";
  return "regular";
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [serverData, setServerData] = useState<PricingData | null>(null);
  const [editConfig, setEditConfig] = useState<PricingConfig | null>(null);
  const [seatData, setSeatData] = useState<SeatSummary | null>(null);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<Tab>("pricing");
  const [tierFilter, setTierFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");

  const fetchData = useCallback(async () => {
    const [pricingRes, seatsRes] = await Promise.all([
      fetch("/api/admin/pricing"),
      fetch("/api/admin/seats"),
    ]);
    if (pricingRes.ok) {
      const d: PricingData = await pricingRes.json();
      setServerData(d);
      setEditConfig(d.config);
      setAuthed(true);
    } else if (pricingRes.status === 401) {
      setAuthed(false);
      return;
    }
    if (seatsRes.ok) {
      setSeatData(await seatsRes.json());
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!authed) return;
    const interval = setInterval(fetchData, 10_000);
    return () => clearInterval(interval);
  }, [authed, fetchData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setPassword("");
      fetchData();
    } else {
      setLoginError("비밀번호가 올바르지 않습니다.");
    }
  };

  const handleSave = async () => {
    if (!editConfig) return;
    setSaving(true);
    const res = await fetch("/api/admin/pricing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editConfig),
    });
    setSaving(false);
    if (res.ok) {
      alert("저장되었습니다.");
      fetchData();
    } else {
      const err = await res.json();
      alert(`오류: ${err.error}`);
    }
  };

  const updateConfig = (updater: (config: PricingConfig) => PricingConfig) => {
    if (!editConfig) return;
    setEditConfig(updater(editConfig));
  };

  const editActiveMode = editConfig ? getActiveMode(editConfig) : "regular";

  const setEditActiveMode = (mode: ActiveMode) => {
    updateConfig((c) => ({
      ...c,
      override: null,
      phase1: { ...c.phase1, enabled: mode === "earlybird1" },
      phase2: { ...c.phase2, enabled: mode === "earlybird2" },
    }));
  };

  const filteredSeats = useMemo(() => {
    if (!seatData) return [];
    let result = [...seatData.soldSeats];
    if (tierFilter !== "all") result = result.filter((s) => s.tier === tierFilter);
    if (sectionFilter !== "all") result = result.filter((s) => s.section === sectionFilter);
    result.sort((a, b) => a.section.localeCompare(b.section) || a.seat - b.seat);
    return result;
  }, [seatData, tierFilter, sectionFilter]);

  const downloadCSV = (seats: SoldSeatRecord[]) => {
    const header = "좌석,티어,애프터파티,이메일";
    const rows = seats.map(
      (s) =>
        `${s.section}-${s.seat},${s.tier.toUpperCase()},${s.afterParty ? "O" : "X"},${s.email ?? ""}`,
    );
    const csv = "\uFEFF" + [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seats_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Login Screen ───
  if (!authed) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 bg-black text-white">
        <form onSubmit={handleLogin} className="w-full max-w-xs">
          <h1 className="text-lg font-bold mb-6 text-center text-neutral-300">
            Admin
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 mb-3 text-sm focus:outline-none focus:border-neutral-600"
          />
          {loginError && (
            <p className="text-red-400 text-xs mb-3">{loginError}</p>
          )}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition-colors"
          >
            로그인
          </button>
        </form>
      </div>
    );
  }

  if (!serverData || !editConfig)
    return (
      <div className="min-h-screen bg-black p-8 text-center text-sm text-neutral-500">
        로딩 중...
      </div>
    );

  const { config: serverConfig, phaseSold } = serverData;
  const serverActiveMode = getActiveMode(serverConfig);

  return (
    <div className="min-h-screen bg-black text-white max-w-lg mx-auto px-5 py-12">
      <div className="mb-8">
        <h1 className="text-lg font-bold text-neutral-200">Admin</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-8 bg-neutral-900 rounded-lg p-1">
        {(
          [
            { value: "pricing", label: "할인 관리" },
            { value: "seats", label: "예약 현황" },
          ] as const
        ).map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-colors ${
              tab === t.value
                ? "bg-neutral-800 text-white"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── Tab 1: 할인 관리 ─── */}
      {tab === "pricing" && (
        <>
          {/* 현재 현황 — server state */}
          <section className="mb-10">
            <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">
              현재 현황
            </h2>
            <div className="space-y-3">
              {(
                [
                  { key: "earlybird1", label: "Early Bird 1", desc: "20% 할인" },
                  { key: "earlybird2", label: "Early Bird 2", desc: "10% 할인" },
                  { key: "regular", label: "정가", desc: "할인 없음" },
                ] as const
              ).map((phase) => {
                const isActive = serverActiveMode === phase.key;
                const tierSold = phaseSold[phase.key] ?? {};
                const totalSold =
                  (tierSold.vip ?? 0) +
                  (tierSold.premium ?? 0) +
                  (tierSold.general ?? 0);
                return (
                  <div
                    key={phase.key}
                    className={`rounded-lg p-4 border ${
                      isActive
                        ? "bg-neutral-800/80 border-white/20"
                        : "bg-neutral-900 border-neutral-800"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-neutral-200">
                          {phase.label}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {phase.desc}
                        </span>
                      </div>
                      {isActive && (
                        <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-white text-black">
                          활성
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {(["vip", "premium", "general"] as const).map((tier) => {
                        const sold = tierSold[tier] ?? 0;
                        const isEB2 = phase.key === "earlybird2";
                        const max = isEB2
                          ? serverConfig.phase2.maxTickets[tier] ?? 0
                          : null;
                        return (
                          <div key={tier}>
                            <p className="text-[10px] text-neutral-600 mb-0.5">
                              {tier.toUpperCase()}
                            </p>
                            <p className="text-sm font-medium text-neutral-300 tabular-nums">
                              {sold}
                              {max !== null && (
                                <span className="text-neutral-600">
                                  /{max}
                                </span>
                              )}
                              <span className="text-[10px] font-normal text-neutral-600 ml-0.5">
                                명
                              </span>
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-2 pt-2 border-t border-neutral-800/50">
                      <span className="text-xs text-neutral-500">
                        합계 {totalSold}명
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <hr className="border-neutral-800 mb-10" />

          {/* Mode Selection — edits local state */}
          <section className="mb-10">
            <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">
              할인 모드
            </h2>
            <div className="space-y-1">
              {(
                [
                  {
                    value: "earlybird1",
                    label: "Early Bird 1",
                    desc: "기간 한정 20% 할인",
                  },
                  {
                    value: "earlybird2",
                    label: "Early Bird 2",
                    desc: "갯수 한정 10% 할인",
                  },
                  { value: "regular", label: "정가", desc: "할인 없음" },
                ] as const
              ).map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors ${
                    editActiveMode === option.value
                      ? "bg-neutral-800/80"
                      : "hover:bg-neutral-800/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="activeMode"
                    value={option.value}
                    checked={editActiveMode === option.value}
                    onChange={() => setEditActiveMode(option.value)}
                    className="w-3.5 h-3.5 accent-white"
                  />
                  <span className="text-sm text-neutral-200">{option.label}</span>
                  <span className="text-xs text-neutral-500">{option.desc}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Earlybird 1 Config */}
          {editActiveMode === "earlybird1" && (
            <>
              <hr className="border-neutral-800 mb-10" />
              <section className="mb-10">
                <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">
                  Early Bird 1 설정
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1.5">
                      시작일 (KST)
                    </label>
                    <input
                      type="datetime-local"
                      value={toKSTDatetime(editConfig.phase1.startDate)}
                      onChange={(e) =>
                        updateConfig((c) => ({
                          ...c,
                          phase1: {
                            ...c.phase1,
                            startDate: fromKSTDatetime(e.target.value),
                          },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-neutral-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1.5">
                      종료일 (KST)
                    </label>
                    <input
                      type="datetime-local"
                      value={toKSTDatetime(editConfig.phase1.endDate)}
                      onChange={(e) =>
                        updateConfig((c) => ({
                          ...c,
                          phase1: {
                            ...c.phase1,
                            endDate: fromKSTDatetime(e.target.value),
                          },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-neutral-600"
                    />
                  </div>
                </div>
                <p className="text-xs text-neutral-600 mt-3">
                  종료일이 지나면 자동으로 정가로 전환됩니다.
                </p>
              </section>
            </>
          )}

          {/* Earlybird 2 Config */}
          {editActiveMode === "earlybird2" && (
            <>
              <hr className="border-neutral-800 mb-10" />
              <section className="mb-10">
                <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">
                  Early Bird 2 설정
                </h2>
                <label className="block text-xs text-neutral-500 mb-3">
                  티어별 최대 할인 티켓 수
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {["vip", "premium", "general"].map((tier) => (
                    <div key={tier}>
                      <label className="block text-xs text-neutral-600 mb-1.5">
                        {tier.toUpperCase()}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editConfig.phase2.maxTickets[tier] ?? 0}
                        onChange={(e) =>
                          updateConfig((c) => ({
                            ...c,
                            phase2: {
                              ...c.phase2,
                              maxTickets: {
                                ...c.phase2.maxTickets,
                                [tier]: Number(e.target.value),
                              },
                            },
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-neutral-600"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-neutral-600 mt-3">
                  각 티어의 할인 수량이 소진되면 해당 티어만 정가로 전환됩니다.
                </p>
              </section>
            </>
          )}

          {/* Save Button */}
          <div className="pt-4 pb-8">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-4 rounded-xl bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </>
      )}

      {/* ─── Tab 2: 예약 현황 ─── */}
      {tab === "seats" && seatData && (
        <>
          <section className="mb-10">
            <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">
              좌석 현황
            </h2>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {(["vip", "premium", "general"] as const).map((tier) => {
                const s = seatData.byTier[tier];
                if (!s) return null;
                const pct = s.total > 0 ? (s.sold / s.total) * 100 : 0;
                return (
                  <div
                    key={tier}
                    className="rounded-lg bg-neutral-900 border border-neutral-800 p-3"
                  >
                    <p className="text-xs text-neutral-500 mb-1">
                      {tier.toUpperCase()}
                    </p>
                    <p className="text-lg font-bold text-neutral-200 tabular-nums">
                      {s.sold}
                      <span className="text-sm font-normal text-neutral-500">
                        /{s.total}
                      </span>
                    </p>
                    <div className="mt-2 h-1 rounded-full bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-white/60"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-sm py-2">
              <span className="text-neutral-500">전체 점유율</span>
              <span className="text-neutral-200 tabular-nums">
                {seatData.fillRate}%
              </span>
            </div>
            <div className="flex items-center justify-between text-sm py-2">
              <span className="text-neutral-500">애프터파티</span>
              <span className="text-neutral-200 tabular-nums">
                {seatData.afterPartyCount}명
              </span>
            </div>
          </section>

          <hr className="border-neutral-800 mb-10" />

          <section className="mb-10">
            <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">
              구매 내역
              <span className="ml-2 text-neutral-600">
                {filteredSeats.length}건
              </span>
            </h2>
            <div className="flex gap-2 mb-4 flex-wrap">
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-neutral-300 focus:outline-none focus:border-neutral-600"
              >
                <option value="all">전체 티어</option>
                <option value="vip">VIP</option>
                <option value="premium">Premium</option>
                <option value="general">General</option>
              </select>
              <select
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-neutral-300 focus:outline-none focus:border-neutral-600"
              >
                <option value="all">전체 섹션</option>
                {Array.from(
                  new Set(seatData.soldSeats.map((s) => s.section)),
                )
                  .sort()
                  .map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}구역
                    </option>
                  ))}
              </select>
              <button
                onClick={() => downloadCSV(filteredSeats)}
                className="ml-auto px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-sm text-neutral-300 hover:bg-neutral-700 transition-colors"
              >
                CSV 다운로드
              </button>
            </div>

            {filteredSeats.length === 0 ? (
              <p className="text-sm text-neutral-600 py-4 text-center">
                구매 내역이 없습니다.
              </p>
            ) : (
              <>
                <div className="space-y-2 md:hidden max-h-[60vh] overflow-y-auto">
                  {filteredSeats.map((s) => (
                    <div
                      key={`${s.section}-${s.seat}`}
                      className="rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2.5"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-neutral-200">
                          {s.section}-{s.seat}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-500">
                            {s.tier.toUpperCase()}
                          </span>
                          {s.afterParty && (
                            <span className="text-xs text-amber-500">AP</span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-neutral-500 truncate">
                        {s.email ?? "-"}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="hidden md:block overflow-x-auto max-h-[60vh] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-neutral-600 border-b border-neutral-800">
                        <th className="pb-2 font-medium">좌석</th>
                        <th className="pb-2 font-medium">티어</th>
                        <th className="pb-2 font-medium">AP</th>
                        <th className="pb-2 font-medium">이메일</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSeats.map((s) => (
                        <tr
                          key={`${s.section}-${s.seat}`}
                          className="border-b border-neutral-800/50"
                        >
                          <td className="py-2 text-neutral-200 tabular-nums">
                            {s.section}-{s.seat}
                          </td>
                          <td className="py-2 text-neutral-400">
                            {s.tier.toUpperCase()}
                          </td>
                          <td className="py-2">
                            {s.afterParty ? (
                              <span className="text-amber-500">O</span>
                            ) : (
                              <span className="text-neutral-700">-</span>
                            )}
                          </td>
                          <td className="py-2 text-neutral-400 truncate max-w-[200px]">
                            {s.email ?? "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>
        </>
      )}

      {tab === "seats" && !seatData && (
        <p className="text-sm text-neutral-600 py-4 text-center">
          로딩 중...
        </p>
      )}
    </div>
  );
}

/** UTC ISO → KST datetime-local 문자열 (항상 한국 시간 기준) */
function toKSTDatetime(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 16);
}

/** datetime-local 입력값(KST 기준) → UTC ISO 문자열 */
function fromKSTDatetime(value: string): string {
  return new Date(value + "+09:00").toISOString();
}
