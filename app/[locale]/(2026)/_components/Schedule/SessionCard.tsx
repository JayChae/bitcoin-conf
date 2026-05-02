import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import TrackBadge from "./TrackBadge";
import type { Session, Track } from "@/app/messages/2026/schedules";

type SpeakerInfo = {
  slug: string;
  name: string;
};

type Props = {
  session: Session;
  title: string;
  description?: string;
  trackLabel: string;
  venueLabel: string;
  showVenueBadge: boolean;
  speakers: SpeakerInfo[];
  isLast: boolean;
};

export default function SessionCard({
  session,
  title,
  description,
  trackLabel,
  venueLabel,
  showVenueBadge,
  speakers,
  isLast,
}: Props) {
  const isMuted: Track[] = ["break", "networking"];
  const muted = isMuted.includes(session.track);

  return (
    <li
      className={`flex gap-5 md:gap-8 py-6 md:py-8 ${
        isLast ? "" : "border-b border-white/[0.07]"
      } ${muted ? "opacity-65" : ""}`}
    >
      <div className="w-14 md:w-24 flex-shrink-0 text-right">
        <time className="font-[family-name:var(--font-ubuntu-mono)] font-semibold text-base md:text-2xl text-white tabular-nums leading-none">
          {session.startTime}
        </time>
        {session.endTime && (
          <div className="font-[family-name:var(--font-ubuntu-mono)] text-[11px] md:text-xs text-white/35 tabular-nums mt-1.5">
            — {session.endTime}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
          <TrackBadge track={session.track} label={trackLabel} />
          {showVenueBadge && (
            <span className="font-[family-name:var(--font-ubuntu-mono)] uppercase tracking-[0.2em] text-[10px] md:text-[11px] font-semibold text-white/55">
              @ {venueLabel}
            </span>
          )}
        </div>

        <h3 className="text-lg md:text-2xl font-bold text-white leading-snug mb-3">
          {title}
        </h3>

        {speakers.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mb-2">
            {speakers.map((s) => (
              <Link
                key={s.slug}
                href={`/speakers/${s.slug}`}
                className="group inline-flex items-center gap-1 text-sm md:text-base text-white/70 hover:text-white transition-colors"
              >
                <span>{s.name}</span>
                <ArrowUpRight className="size-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </Link>
            ))}
          </div>
        )}

        {description && (
          <p className="text-sm md:text-base text-white/45 leading-relaxed mt-3 max-w-2xl">
            {description}
          </p>
        )}
      </div>
    </li>
  );
}
