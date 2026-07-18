import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { SideEvent } from "@/app/messages/2026/sideEvents";
import { EYEBROW_CLASS } from "../Speakers/InfoField";
import SideEventImage from "./SideEventImage";

type Labels = {
  host: string;
  cta: string;
  imageComingSoon: string;
};

type Props = {
  event: SideEvent;
  labels: Labels;
};

export default function SideEventCard({ event, labels }: Props) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl
        bg-[#15122a]/90 backdrop-blur-2xl
        border border-white/10 hover:border-white/25
        transition-all duration-300
        sm:hover:-translate-y-0.5
        flex flex-col sm:flex-row"
    >
      <Link
        href={`/side-events/${event.slug}`}
        aria-label={event.title}
        className="absolute inset-0 z-10 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-glow-purple/50"
      />

      <div className="relative shrink-0 w-full sm:w-[42%] aspect-[16/10] sm:aspect-auto overflow-hidden bg-[#0d0a1c]">
        <SideEventImage
          src={event.cardImage ?? event.image}
          alt={event.title}
          placeholderLabel={labels.imageComingSoon}
          size="card"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#15122a]/40 hidden sm:block"
        />
      </div>

      <div className="flex flex-col flex-1 min-w-0 gap-3 p-5 sm:p-6 md:p-7">
        <span className={EYEBROW_CLASS}>{event.date}</span>

        <div className="flex flex-col gap-1.5">
          <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
            {event.title}
          </h3>
          <p className="text-sm text-white/65 leading-snug">
            <span className="text-white/45">{labels.host} · </span>
            <span>{event.host}</span>
          </p>
        </div>

        <p className="text-sm text-white/70 leading-relaxed line-clamp-3">
          {event.shortDescription}
        </p>

        <div className="mt-auto flex justify-end items-center gap-1.5 pt-2">
          <span className="text-sm font-medium text-[#F8C8FF] group-hover:text-white transition-colors">
            {labels.cta}
          </span>
          <ArrowUpRight className="size-4 text-[#F8C8FF] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
      </div>
    </div>
  );
}
