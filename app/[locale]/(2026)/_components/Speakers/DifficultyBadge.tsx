import { getTranslations } from "next-intl/server";
import type { Difficulty } from "@/app/messages/2026/speakers";
import DifficultyDots from "./DifficultyDots";

// DIFFICULTY_LEVEL의 정식 위치는 DifficultyDots. 기존 import 호환을 위해 재노출한다.
export { DIFFICULTY_LEVEL } from "./DifficultyDots";

export default async function DifficultyBadge({
  difficulty,
}: {
  difficulty: Difficulty;
}) {
  const t = await getTranslations("Speakers2026");

  return (
    <div className="inline-flex items-center gap-3">
      <span className="text-[10px] font-medium tracking-[0.22em] uppercase text-white/50">
        {t("difficultyLabel")}
      </span>
      <DifficultyDots difficulty={difficulty} />
      <span className="text-sm font-semibold text-white">
        {t(`difficulty${difficulty}`)}
      </span>
    </div>
  );
}
