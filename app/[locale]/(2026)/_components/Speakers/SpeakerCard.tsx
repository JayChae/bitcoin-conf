import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Speaker } from "@/app/messages/2026/speakers";
import SnsLinks from "./SnsLinks";

type Props = {
  speaker: Speaker;
};

export default function SpeakerCard({ speaker }: Props) {
  return (
    <div
      className="group relative flex flex-col rounded-2xl
        bg-[#15122a]/90
        border border-white/10 hover:border-white/25
        p-5 md:p-6 transition-all duration-300
        hover:-translate-y-0.5"
    >
      <Link
        href={`/speakers/${speaker.slug}`}
        aria-label={speaker.title}
        className="absolute inset-0 z-10 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-glow-purple/50"
      />

      <div className="text-center mb-5">
        <h3 className="text-base md:text-lg font-bold text-white leading-tight truncate">
          {speaker.title}
        </h3>
        <p className="text-xs text-white/65 mt-1.5 line-clamp-2 min-h-[2.4em] leading-snug">
          {speaker.subtitle.join(" · ")}
        </p>
      </div>

      <div className="relative mx-auto w-[72%] aspect-square">
        <div
          aria-hidden
          className="absolute -inset-3 rounded-full bg-gradient-to-br from-glow-blue/20 via-glow-purple/15 to-glow-pink/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
        <div className="relative size-full rounded-full overflow-hidden bg-[#0d0a1c] ring-1 ring-white/10 transition-all duration-300 group-hover:ring-white/30">
          <Image
            src={speaker.image}
            alt={speaker.title}
            fill
            sizes="(min-width: 1280px) 10vw, (min-width: 1024px) 13vw, (min-width: 640px) 17vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
        </div>
      </div>

      {/* z-20 keeps SNS clickable above the stretched link */}
      <div className="relative z-20 mt-auto pt-5 flex items-center justify-center">
        <SnsLinks links={speaker.links} size="xs" />
      </div>
    </div>
  );
}
