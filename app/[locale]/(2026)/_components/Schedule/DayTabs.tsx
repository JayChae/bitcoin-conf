"use client";

import { useState, type ReactNode } from "react";
import type { DayId } from "@/app/messages/2026/schedules";

export type DayTabItem = {
  id: DayId;
  tabLabel: string;
  venueLine: string;
  panel: ReactNode;
};

type Props = {
  days: DayTabItem[];
};

const accentBar: Record<DayId, string> = {
  day1: "bg-[#8C50C8]",
  day2: "bg-[#E947F5]",
};

const fadeMask =
  "linear-gradient(to bottom, transparent 0%, black 4%, black 96%, transparent 100%)";

export default function DayTabs({ days }: Props) {
  const [activeId, setActiveId] = useState(days[0]?.id);
  const active = days.find((d) => d.id === activeId) ?? days[0];

  if (!active) return null;

  return (
    <div>
      <div
        className="sticky top-16 z-20 -mx-4 px-4
                   bg-[#0a0814]/80 backdrop-blur-xl border-b border-white/10"
      >
        <div
          role="tablist"
          aria-label="Schedule day"
          className="flex items-stretch max-w-3xl mx-auto"
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
                className={`relative flex-1 px-4 py-5 md:py-6 text-sm md:text-base
                            font-[family-name:var(--font-ubuntu-mono)] uppercase tracking-[0.2em]
                            transition-colors duration-200
                            ${
                              isActive
                                ? "text-white font-semibold"
                                : "text-white/35 hover:text-white/65 font-medium"
                            }`}
              >
                {d.tabLabel}
                <span
                  aria-hidden
                  className={`absolute left-1/2 -translate-x-1/2 bottom-0 h-[2px] transition-all duration-300
                              ${
                                isActive
                                  ? `${accentBar[d.id]} w-12`
                                  : "bg-transparent w-0"
                              }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative isolate">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -inset-x-4 md:-inset-x-12 -z-10
                     backdrop-blur-md bg-[#0a0814]/80"
          style={{ maskImage: fadeMask, WebkitMaskImage: fadeMask }}
        />

        <p className="text-center text-white/55 text-sm md:text-base pt-8 pb-10 px-4 font-[family-name:var(--font-ubuntu-mono)] tracking-wide">
          {active.venueLine}
        </p>

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
