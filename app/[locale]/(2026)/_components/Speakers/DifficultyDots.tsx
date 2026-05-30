import type { Difficulty } from "@/app/messages/2026/speakers";
import { cn } from "@/lib/utils";

export const DIFFICULTY_LEVEL: Record<
  Difficulty,
  { count: 1 | 2 | 3; color: string }
> = {
  Low: { count: 1, color: "bg-emerald-400" },
  Medium: { count: 2, color: "bg-amber-400" },
  High: { count: 3, color: "bg-glow-pink" },
};

// 난이도 3점 표시. SpeakerCard와 DifficultyBadge가 공유한다.
export default function DifficultyDots({
  difficulty,
  className,
}: {
  difficulty: Difficulty;
  className?: string;
}) {
  const { count, color } = DIFFICULTY_LEVEL[difficulty];
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {Array.from({ length: 3 }, (_, i) => (
        <span
          key={i}
          className={cn("size-2 rounded-full", i < count ? color : "bg-white/15")}
        />
      ))}
    </div>
  );
}
