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
      className="group relative rounded-2xl
        bg-[#15122a]/90
        border border-white/10 hover:border-white/25
        transition-all duration-300
        sm:hover:-translate-y-0.5
        flex flex-row items-center gap-4 p-4
        sm:flex-col sm:items-stretch sm:gap-0 sm:p-5 md:p-6"
    >
      <Link
        href={`/speakers/${speaker.slug}`}
        aria-label={speaker.title}
        className="absolute inset-0 z-10 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-glow-purple/50"
      />

      <div
        className="relative shrink-0 w-24 aspect-square
          order-1
          sm:order-2 sm:w-[72%] sm:mx-auto"
      >
        <div
          aria-hidden
          className="hidden sm:block absolute -inset-3 rounded-full bg-gradient-to-br from-glow-blue/20 via-glow-purple/15 to-glow-pink/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
        <div className="relative size-full rounded-full overflow-hidden bg-[#0d0a1c] ring-1 ring-white/10 transition-all duration-300 group-hover:ring-white/30">
          <Image
            src={speaker.image}
            alt={speaker.title}
            fill
            sizes="(min-width: 1280px) 200px, (min-width: 1024px) 180px, (min-width: 640px) 150px, 96px"
            className="object-cover transition-transform duration-500 sm:group-hover:scale-[1.05]"
          />
        </div>
      </div>

      <div
        className="flex flex-col min-w-0 flex-1 gap-1.5
          order-2
          sm:order-1 sm:flex-none sm:gap-0 sm:text-center sm:mb-5"
      >
        <h3 className="text-base sm:text-lg font-bold text-white leading-tight truncate">
          {speaker.title}
        </h3>
        <p className="text-xs text-white/65 line-clamp-2 leading-snug sm:mt-1.5 sm:min-h-[2.4em]">
          {speaker.subtitle.join(" · ")}
        </p>
        {/* z-20 keeps SNS clickable above the stretched link */}
        <div className="sm:hidden relative z-20 mt-1">
          <SnsLinks links={speaker.links} size="xs" />
        </div>
      </div>

      <div className="hidden sm:flex relative z-20 mt-auto pt-5 items-center justify-center sm:order-3">
        <SnsLinks links={speaker.links} size="xs" />
      </div>
    </div>
  );
}
