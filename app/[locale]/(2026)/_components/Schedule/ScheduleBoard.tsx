"use client";

import { useMemo, useRef, useState } from "react";
import type { RoomId } from "@/app/messages/2026/schedules";
import { cn } from "@/lib/utils";
import ScheduleTimeline from "./ScheduleTimeline";
import { DAY_ACCENT, PAGE_BG_CLASS, RULE_CLASS } from "./styles";
import { buildTimeline, type ScheduleDayView } from "./timeline";

type Props = {
  view: ScheduleDayView;
  labels: { roomFilter: string; allRooms: string };
};

type Filter = RoomId | "all";

export default function ScheduleBoard({ view, labels }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const rootRef = useRef<HTMLDivElement>(null);
  const multiRoom = view.rooms.length > 1;
  const accent = DAY_ACCENT[view.id];

  const segments = useMemo(
    () =>
      buildTimeline(
        view.sessions,
        filter === "all"
          ? view.rooms
          : view.rooms.filter((room) => room.id === filter)
      ),
    [view, filter]
  );

  const select = (next: Filter) => {
    setFilter(next);
    // 목록 중간에서 필터를 바꾸면 길이가 달라져 엉뚱한 위치에 남는다 — 목록 맨 위로 되돌린다.
    requestAnimationFrame(() => {
      const root = rootRef.current;
      if (!root) return;
      const offset = parseFloat(getComputedStyle(root).scrollMarginTop) || 0;
      if (root.getBoundingClientRect().top < offset) {
        root.scrollIntoView({ block: "start" });
      }
    });
  };

  return (
    <div
      ref={rootRef}
      className={cn(
        // 고정 nav 와 필터 탭의 높이. 아래로 붙는 것들(sticky 위치, 스크롤 여백)이 모두 여기서 계산된다.
        "[--nav-h:4rem] md:[--nav-h:5rem] [--tabs-h:3rem] scroll-mt-(--nav-h)",
        // 한 공간만 볼 때는 한 줄이 너무 길어지지 않게 좁힌다(왼쪽 기준선은 그대로).
        filter !== "all" && "max-w-4xl"
      )}
    >
      {multiRoom && (
        <div
          className={cn("sticky top-(--nav-h) z-20 -mx-4 px-4", PAGE_BG_CLASS)}
        >
          <div
            role="group"
            aria-label={labels.roomFilter}
            className={cn(
              "flex h-(--tabs-h) gap-6 md:gap-8 overflow-x-auto border-b [scrollbar-width:none]",
              RULE_CLASS
            )}
          >
            {[{ id: "all" as const, label: labels.allRooms }, ...view.rooms].map(
              (tab) => (
                <FilterTab
                  key={tab.id}
                  label={tab.label}
                  bar={accent.bar}
                  active={filter === tab.id}
                  onClick={() => select(tab.id)}
                />
              )
            )}
          </div>
        </div>
      )}

      <ScheduleTimeline
        segments={segments}
        accent={accent.text}
        showRoom={multiRoom && filter === "all"}
        flushTop={multiRoom}
      />
    </div>
  );
}

function FilterTab({
  label,
  bar,
  active,
  onClick,
}: {
  label: string;
  bar: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "relative shrink-0 whitespace-nowrap text-[15px] md:text-base transition-colors duration-200 focus:outline-none focus-visible:text-white focus-visible:underline underline-offset-4",
        active
          ? "font-semibold text-white"
          : "font-medium text-white/50 hover:text-white/80"
      )}
    >
      {label}
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 bottom-0 h-0.5 transition-opacity duration-200",
          bar,
          active ? "opacity-100" : "opacity-0"
        )}
      />
    </button>
  );
}
