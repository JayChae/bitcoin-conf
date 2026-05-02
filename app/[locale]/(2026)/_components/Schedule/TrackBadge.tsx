import type { Track } from "@/app/messages/2026/schedules";

type Props = {
  track: Track;
  label: string;
};

const dotColor: Record<Track, string> = {
  keynote: "bg-[#E947F5]",
  panel: "bg-[#8C50C8]",
  workshop: "bg-[#5B7BD8]",
  networking: "bg-white/50",
  break: "bg-white/30",
};

const textColor: Record<Track, string> = {
  keynote: "text-[#F8C8FF]",
  panel: "text-[#E0C8FF]",
  workshop: "text-[#C8D6FF]",
  networking: "text-white/70",
  break: "text-white/50",
};

export default function TrackBadge({ track, label }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-[family-name:var(--font-ubuntu-mono)]
                  uppercase tracking-[0.22em] text-[10px] md:text-[11px] font-semibold ${textColor[track]}`}
    >
      <span className={`size-1.5 rounded-full ${dotColor[track]}`} aria-hidden />
      <span>{label}</span>
    </span>
  );
}
