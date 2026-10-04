import type { DayId } from "@/app/messages/2026/schedules";

export const MONO_CLASS = "font-[family-name:var(--font-ubuntu-mono)]";

// 표의 가로선. 색은 여기 한 곳에서만 정한다.
export const RULE_CLASS = "border-white/[0.12]";

// 스크롤되는 내용 위에 붙는 막대의 배경. (2026) 레이아웃의 페이지 배경과 같은 색이어야 한다.
export const PAGE_BG_CLASS = "bg-[#101018]";

// 일차별 액센트(1일차 보라 / 2일차 마젠타) — VenueCard 와 같은 색.
export const DAY_ACCENT: Record<DayId, { text: string; bar: string }> = {
  day1: { text: "text-[#C8A0FF]", bar: "bg-[#C8A0FF]" },
  day2: { text: "text-[#F490FF]", bar: "bg-[#F490FF]" },
};
