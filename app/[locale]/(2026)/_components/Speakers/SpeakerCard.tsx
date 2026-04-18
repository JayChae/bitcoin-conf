import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Speaker } from "@/app/messages/2026/speakers";
import DifficultyBadge from "./DifficultyBadge";
import SnsLinks from "./SnsLinks";

type Props = {
  speaker: Speaker;
};

export default function SpeakerCard({ speaker }: Props) {
  return (
    <div
      className="group relative flex flex-col rounded-2xl
        bg-[#0a0814]/75 backdrop-blur-md
        border border-white/8 hover:border-white/20
        p-3 transition-all duration-300
        hover:-translate-y-0.5 hover:bg-[#0a0814]/85"
    >
      <Link
        href={`/speakers/${speaker.slug}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-glow-purple/50 rounded-xl"
      >
        <div className="relative aspect-square overflow-hidden rounded-xl bg-[#0d0a1c]">
          <Image
            src={speaker.image}
            alt={speaker.title}
            fill
            sizes="(min-width: 1280px) 18vw, (min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>

        <div className="pt-3 px-1">
          <h3 className="text-sm md:text-base font-semibold text-white leading-snug truncate">
            {speaker.title}
          </h3>
          <p className="text-xs text-white/65 mt-1 line-clamp-1">
            {speaker.subtitle}
          </p>
        </div>
      </Link>

      <div className="mt-3 px-1 flex items-center justify-between gap-2">
        <DifficultyBadge difficulty={speaker.difficulty} />
        <SnsLinks links={speaker.links} size="xs" />
      </div>
    </div>
  );
}
