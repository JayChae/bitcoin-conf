"use client";

import { useState, useEffect, useCallback } from "react";

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

type TierStatus = {
  phase: string;
  sold: number;
};

type PricingData = {
  config: PricingConfig;
  tiers: Record<string, TierStatus>;
};

type ActiveMode = "earlybird1" | "earlybird2" | "regular";

const PHASE_LABELS: Record<string, string> = {
  earlybird1: "Early Bird 1 (20%)",
  earlybird2: "Early Bird 2 (10%)",
  regular: "정가",
};

function getActiveMode(config: PricingConfig): ActiveMode {
  if (config.phase1.enabled) return "earlybird1";
  if (config.phase2.enabled) return "earlybird2";
  return "regular";
}

/** Check if any tier's actual phase differs from the configured mode */
function getPhaseWarning(
  activeMode: ActiveMode,
  tiers: Record<string, TierStatus>,
): string | null {
  if (activeMode === "earlybird1") {
    const allRegular = Object.values(tiers).every((t) => t.phase === "regular");
    if (allRegular) return "EB1이 활성화되어 있지만 기간이 지나 실제로는 정가가 적용 중입니다.";
  }
  if (activeMode === "earlybird2") {
    const allRegular = Object.values(tiers).every((t) => t.phase === "regular");
    if (allRegular) return "EB2가 활성화되어 있지만 모든 티어의 할인 수량이 소진되어 정가가 적용 중입니다.";
  }
  return null;
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [data, setData] = useState<PricingData | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/admin/pricing");
    if (res.ok) {
      setData(await res.json());
      setAuthed(true);
    } else if (res.status === 401) {
      setAuthed(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    if (!data) return;
    setSaving(true);
    const res = await fetch("/api/admin/pricing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data.config),
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
    if (!data) return;
    setData({ ...data, config: updater(data.config) });
  };

  const setActiveMode = (mode: ActiveMode) => {
    updateConfig((c) => ({
      ...c,
      override: null,
      phase1: { ...c.phase1, enabled: mode === "earlybird1" },
      phase2: { ...c.phase2, enabled: mode === "earlybird2" },
    }));
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

  if (!data)
    return (
      <div className="min-h-screen bg-black p-8 text-center text-sm text-neutral-500">
        로딩 중...
      </div>
    );

  const { config, tiers } = data;
  const activeMode = getActiveMode(config);
  const phaseWarning = getPhaseWarning(activeMode, tiers);

  // ─── Dashboard ───
  return (
    <div className="min-h-screen bg-black text-white max-w-lg mx-auto px-5 py-12">
      <div className="mb-10">
        <h1 className="text-lg font-bold text-neutral-200">할인 관리</h1>
      </div>

      {/* Phase Warning */}
      {phaseWarning && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-amber-900/30 border border-amber-800/50">
          <p className="text-xs text-amber-400">{phaseWarning}</p>
        </div>
      )}

      {/* Current Status */}
      <section className="mb-10">
        <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">
          현재 상태
        </h2>
        <div className="space-y-2">
          {Object.entries(tiers).map(([tier, status]) => (
            <div key={tier} className="flex items-center justify-between py-2">
              <span className="text-sm text-neutral-400">
                {tier.toUpperCase()}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-neutral-200">
                  {PHASE_LABELS[status.phase] ?? status.phase}
                </span>
                {status.phase === "earlybird2" && (
                  <span className="text-xs text-neutral-500 tabular-nums">
                    {status.sold}/{config.phase2.maxTickets[tier] ?? 0}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-neutral-800 mb-10" />

      {/* Mode Selection */}
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
                activeMode === option.value
                  ? "bg-neutral-800/80"
                  : "hover:bg-neutral-800/40"
              }`}
            >
              <input
                type="radio"
                name="activeMode"
                value={option.value}
                checked={activeMode === option.value}
                onChange={() => setActiveMode(option.value)}
                className="w-3.5 h-3.5 accent-white"
              />
              <span className="text-sm text-neutral-200">{option.label}</span>
              <span className="text-xs text-neutral-500">{option.desc}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Earlybird 1 Config */}
      {activeMode === "earlybird1" && (
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
                  value={toKSTDatetime(config.phase1.startDate)}
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
                  value={toKSTDatetime(config.phase1.endDate)}
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
      {activeMode === "earlybird2" && (
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
                    value={config.phase2.maxTickets[tier] ?? 0}
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
