import { Link } from "@/i18n/navigation";
import { SCHEDULE_PATH, type DayId } from "@/app/messages/2026/schedules";
import { cn } from "@/lib/utils";
import { DAY_ACCENT, MONO_CLASS } from "./styles";

type Props = {
  active: DayId;
  label: string;
  items: { id: DayId; label: string }[];
};

const activeStyle: Record<DayId, string> = {
  day1: "bg-glow-purple/22 border-glow-purple/55 text-white shadow-[0_0_20px_-6px_rgba(140,80,200,0.55)]",
  day2: "bg-glow-pink/22 border-glow-pink/55 text-white shadow-[0_0_20px_-6px_rgba(233,71,245,0.55)]",
};

// 일차마다 URL 이 따로 있어 링크로 공유할 수 있다 — 탭 상태가 아니라 라우트 이동이다.
export default function DayNav({ active, label, items }: Props) {
  return (
    <nav
      aria-label={label}
      className="mx-auto flex w-full max-w-md items-center gap-1 rounded-full border border-white/12 bg-white/[0.04] p-1.5"
    >
      {items.map((item) => {
        const isActive = item.id === active;
        return (
          <Link
            key={item.id}
            href={SCHEDULE_PATH[item.id]}
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative flex-1 inline-flex items-center justify-center gap-1.5 md:gap-2 rounded-full border px-2 md:px-4 py-2.5 md:py-3 text-[11px] md:text-sm whitespace-nowrap uppercase tracking-[0.08em] md:tracking-[0.18em] transition-all duration-200",
              MONO_CLASS,
              isActive
                ? activeStyle[item.id]
                : "border-transparent text-white/45 hover:text-white/80 hover:bg-white/[0.05]"
            )}
          >
            <span
              aria-hidden
              className={cn(
                "size-1.5 rounded-full transition-opacity",
                isActive ? DAY_ACCENT[item.id].bar : "bg-white/40 opacity-50"
              )}
            />
            <span className={isActive ? "font-semibold" : "font-medium"}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
