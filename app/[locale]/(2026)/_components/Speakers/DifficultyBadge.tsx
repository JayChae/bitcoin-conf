import type { Difficulty } from "@/app/messages/2026/speakers";

type Props = {
  difficulty: Difficulty;
  label: string;
};

export default function DifficultyBadge({ difficulty, label }: Props) {
  return (
    <div className="inline-flex items-baseline gap-2.5">
      <span className="text-[10px] font-medium tracking-[0.22em] uppercase text-white/50">
        {label}
      </span>
      <span className="text-sm font-semibold text-white">{difficulty}</span>
    </div>
  );
}
