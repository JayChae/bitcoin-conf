"use client";

import { useState, type ReactNode } from "react";
import type { DayId } from "@/app/messages/2026/schedules";

export type DayTabItem = {
  id: DayId;
  tabLabel: string;
  panel: ReactNode;
};

type Props = {
  days: DayTabItem[];
};

const activeStyle: Record<DayId, string> = {
  day1: "bg-[#8C50C8]/22 border-[#8C50C8]/55 text-white shadow-[0_0_20px_-6px_rgba(140,80,200,0.55)]",
  day2: "bg-[#E947F5]/22 border-[#E947F5]/55 text-white shadow-[0_0_20px_-6px_rgba(233,71,245,0.55)]",
};

const dotStyle: Record<DayId, string> = {
  day1: "bg-[#C8A0FF]",
  day2: "bg-[#F490FF]",
};

export default function DayTabs({ days }: Props) {
  const [activeId, setActiveId] = useState(days[0]?.id);
  const active = days.find((d) => d.id === activeId) ?? days[0];

  if (!active) return null;

  return (
    <div>
      <div className="sticky top-16 z-20 -mx-4 px-4 py-4 md:py-5 bg-[#0a0814]/85 backdrop-blur-xl">
        <div
          role="tablist"
          aria-label="Schedule day"
          className="mx-auto flex w-full max-w-md items-center gap-1 rounded-full border border-white/12 bg-white/[0.04] p-1.5"
        >
          {days.map((d) => {
            const isActive = d.id === active.id;
            return (
              <button
                key={d.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-controls={`panel-${d.id}`}
                id={`tab-${d.id}`}
                onClick={() => setActiveId(d.id)}
                className={`relative flex-1 inline-flex items-center justify-center gap-1.5 md:gap-2
                            rounded-full border px-2 md:px-4 py-2.5 md:py-3
                            text-[11px] md:text-sm whitespace-nowrap
                            font-[family-name:var(--font-ubuntu-mono)] uppercase tracking-[0.08em] md:tracking-[0.18em]
                            transition-all duration-200
                            ${
                              isActive
                                ? activeStyle[d.id]
                                : "border-transparent text-white/45 hover:text-white/80 hover:bg-white/[0.05]"
                            }`}
              >
                <span
                  aria-hidden
                  className={`size-1.5 rounded-full transition-opacity ${
                    isActive ? `${dotStyle[d.id]} opacity-100` : "bg-white/40 opacity-50"
                  }`}
                />
                <span className={isActive ? "font-semibold" : "font-medium"}>
                  {d.tabLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-8 md:pt-10">
        {days.map((d) => (
          <div
            key={d.id}
            role="tabpanel"
            id={`panel-${d.id}`}
            aria-labelledby={`tab-${d.id}`}
            hidden={d.id !== active.id}
            className="pb-8"
          >
            {d.panel}
          </div>
        ))}
      </div>
    </div>
  );
}
