import { cn } from "@/lib/utils";

type Props = {
  difficulty: string;
  className?: string;
};

const dotByValue: Record<string, string> = {
  High: "bg-glow-pink",
  "상": "bg-glow-pink",
  Medium: "bg-[#C084FC]",
  "중": "bg-[#C084FC]",
  Low: "bg-[#7BA4F7]",
  "하": "bg-[#7BA4F7]",
};

const fallback = "bg-white/40";

export default function DifficultyBadge({ difficulty, className }: Props) {
  const dot = dotByValue[difficulty] ?? fallback;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] uppercase text-white/75",
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", dot)} />
      {difficulty}
    </span>
  );
}
