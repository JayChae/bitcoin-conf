import { getTranslations } from "next-intl/server";
import type { Difficulty } from "@/app/messages/2026/speakers";

const LEVEL: Record<Difficulty, { count: 1 | 2 | 3; color: string }> = {
  Low: { count: 1, color: "bg-emerald-400" },
  Medium: { count: 2, color: "bg-amber-400" },
  High: { count: 3, color: "bg-glow-pink" },
};

export default async function DifficultyBadge({
  difficulty,
}: {
  difficulty: Difficulty;
}) {
  const t = await getTranslations("Speakers2026");
  const { count, color } = LEVEL[difficulty];

  return (
    <div className="inline-flex items-center gap-3">
      <span className="text-[10px] font-medium tracking-[0.22em] uppercase text-white/50">
        {t("difficultyLabel")}
      </span>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: 3 }, (_, i) => (
          <span
            key={i}
            className={`size-2 rounded-full ${i < count ? color : "bg-white/15"}`}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-white">
        {t(`difficulty${difficulty}`)}
      </span>
    </div>
  );
}
