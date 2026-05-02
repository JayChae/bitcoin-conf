const badgeVariants = {
  topic: "bg-glow-blue/15 border-glow-blue/40 text-[#C8D6FF]",
  session: "bg-glow-purple/15 border-glow-purple/40 text-[#E0C8FF]",
  stage: "bg-glow-pink/15 border-glow-pink/40 text-[#F8C8FF]",
} as const;

export type InfoFieldVariant = keyof typeof badgeVariants;

export const EYEBROW_CLASS =
  "font-[family-name:var(--font-ubuntu-mono)] uppercase tracking-[0.22em] text-[10px] md:text-[11px] text-white/50";

type Props = {
  label: string;
  value: string | undefined;
  variant: InfoFieldVariant;
  comingSoonText: string;
};

export default function InfoField({
  label,
  value,
  variant,
  comingSoonText,
}: Props) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <span className={EYEBROW_CLASS}>{label}</span>
      {value ? (
        <span
          className={`inline-flex w-fit items-center px-3 py-1.5 rounded-md text-sm font-medium border ${badgeVariants[variant]}`}
        >
          {value}
        </span>
      ) : (
        <span className="inline-flex w-fit items-center px-3 py-1.5 rounded-md text-sm font-medium border border-dashed border-white/15 bg-white/[0.03] text-white/40">
          {comingSoonText}
        </span>
      )}
    </div>
  );
}
