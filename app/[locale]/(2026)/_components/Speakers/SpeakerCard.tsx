import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Speaker } from "@/app/messages/2026/speakers";
import { DIFFICULTY_LEVEL } from "./DifficultyBadge";
import InfoField, { EYEBROW_CLASS } from "./InfoField";

type Labels = {
  topic: string;
  session: string;
  stage: string;
  bio: string;
  cta: string;
  comingSoon: string;
  difficulty: string;
};

type Props = {
  speaker: Speaker;
  labels: Labels;
};

export default function SpeakerCard({ speaker, labels }: Props) {
  return (
    <div
      className="group relative rounded-2xl
        bg-[#15122a]/90 backdrop-blur-2xl
        border border-white/10 hover:border-white/25
        transition-all duration-300
        sm:hover:-translate-y-0.5
        flex flex-col sm:flex-row gap-5 p-5 sm:p-6 md:p-7"
    >
      <Link
        href={`/speakers/${speaker.slug}`}
        aria-label={speaker.title}
        className="absolute inset-0 z-10 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-glow-purple/50"
      />

      <div className="relative shrink-0 size-36 sm:size-40 md:size-48 lg:size-52 mx-auto sm:mx-0 sm:self-center">
        <div
          aria-hidden
          className="absolute -inset-3 rounded-full bg-gradient-to-br from-glow-blue/20 via-glow-purple/15 to-glow-pink/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
        <div className="relative size-full rounded-full overflow-hidden bg-[#0d0a1c] ring-1 ring-white/10 transition-all duration-300 group-hover:ring-white/30">
          <Image
            src={speaker.image}
            alt={speaker.title}
            fill
            sizes="(min-width: 1024px) 208px, (min-width: 768px) 192px, (min-width: 640px) 160px, 144px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      </div>

      <div className="flex flex-col flex-1 min-w-0 gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
            {speaker.title}
          </h3>
          <p className="text-sm text-white/65 leading-snug">
            {speaker.subtitle.join(" · ")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <InfoField
            label={labels.topic}
            value={speaker.topic}
            variant="topic"
            comingSoonText={labels.comingSoon}
          />
          <InfoField
            label={labels.session}
            value={speaker.session}
            variant="session"
            comingSoonText={labels.comingSoon}
          />
          <div className="col-span-2">
            <InfoField
              label={labels.stage}
              value={speaker.stage}
              variant="stage"
              comingSoonText={labels.comingSoon}
            />
          </div>
          <div className="col-span-2 flex flex-col gap-1.5">
            <span className={EYEBROW_CLASS}>{labels.difficulty}</span>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 3 }, (_, i) => (
                <span
                  key={i}
                  className={`size-2 rounded-full ${
                    i < DIFFICULTY_LEVEL[speaker.difficulty].count
                      ? DIFFICULTY_LEVEL[speaker.difficulty].color
                      : "bg-white/15"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className={EYEBROW_CLASS}>{labels.bio}</span>
          <p className="text-sm text-white/70 leading-relaxed line-clamp-3">
            {speaker.bio}
          </p>
        </div>

        <div className="mt-auto flex justify-end items-center gap-1.5 pt-1">
          <span className="text-sm font-medium text-[#F8C8FF] group-hover:text-white transition-colors">
            {labels.cta}
          </span>
          <ArrowUpRight className="size-4 text-[#F8C8FF] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
      </div>
    </div>
  );
}
