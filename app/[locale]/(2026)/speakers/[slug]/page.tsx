import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import speakers, { type Speaker } from "@/app/messages/2026/speakers";
import DifficultyBadge from "../../_components/Speakers/DifficultyBadge";
import SnsLinks from "../../_components/Speakers/SnsLinks";

type Params = { locale: Locale; slug: string };

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    speakers[locale].map((s) => ({ locale, slug: s.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, slug } = await params;
  const speaker = speakers[locale].find((s) => s.slug === slug);
  if (!speaker) return {};
  const description = speaker.subtitle.join(" · ");
  return {
    title: speaker.title,
    description,
    openGraph: {
      title: speaker.title,
      description,
      images: [{ url: speaker.image }],
    },
  };
}

export default async function SpeakerDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;
  const list = speakers[locale];
  const i = list.findIndex((s) => s.slug === slug);

  if (i === -1) notFound();

  const speaker = list[i];
  const prev = list[i - 1] ?? null;
  const next = list[i + 1] ?? null;

  const t = await getTranslations("Speakers2026");

  return (
    <main className="relative z-10 min-h-screen pt-28 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/speakers"
          className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors mb-12 md:mb-16"
        >
          <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
          {t("backToList")}
        </Link>

        <div className="grid md:grid-cols-[260px_1fr] gap-8 md:gap-12 items-start">
          <div className="relative aspect-square w-full max-w-[260px] mx-auto md:mx-0 rounded-2xl overflow-hidden">
            <Image
              src={speaker.image}
              alt={speaker.title}
              fill
              priority
              sizes="(min-width: 768px) 260px, 100vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-5 min-w-0">
            <DifficultyBadge difficulty={speaker.difficulty} />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight">
              {speaker.title}
            </h1>
            <div className="flex flex-col gap-1 text-lg md:text-xl text-white/60 leading-relaxed">
              {speaker.subtitle.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <SnsLinks links={speaker.links} size="md" className="mt-1" />

            <div className="mt-10 md:mt-12 text-base md:text-lg text-white/75 leading-[1.85] whitespace-pre-line font-light">
              {speaker.bio}
            </div>

            {speaker.lectureTitle && (
              <div className="mt-8 pl-5 border-l-2 border-glow-purple/60">
                <div className="text-xs font-medium tracking-[0.25em] uppercase text-glow-pink mb-2">
                  {t("lectureLabel")}
                </div>
                <div className="text-2xl md:text-3xl font-semibold text-white leading-snug">
                  {speaker.lectureTitle}
                </div>
              </div>
            )}
          </div>
        </div>

        {(prev || next) && (
          <nav className="mt-20 md:mt-28 pt-8 border-t border-white/15 flex items-center justify-between gap-4">
            <AdjacentLink direction="prev" speaker={prev} label={t("prev")} />
            <AdjacentLink direction="next" speaker={next} label={t("next")} />
          </nav>
        )}
      </div>
    </main>
  );
}

function AdjacentLink({
  direction,
  speaker,
  label,
}: {
  direction: "prev" | "next";
  speaker: Speaker | null;
  label: string;
}) {
  if (!speaker) return <div />;

  const isPrev = direction === "prev";
  const Arrow = isPrev ? ArrowLeft : ArrowRight;

  return (
    <Link
      href={`/speakers/${speaker.slug}`}
      className={`group flex items-center gap-3 min-w-0 max-w-[45%] ${isPrev ? "" : "ml-auto"}`}
    >
      {isPrev && (
        <Arrow className="size-5 text-white/80 group-hover:text-white transition-all duration-300 group-hover:-translate-x-1 shrink-0" />
      )}
      <div
        className={`flex flex-col min-w-0 ${isPrev ? "text-left" : "text-right"}`}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/60">
          {label}
        </span>
        <span className="text-sm font-semibold text-white truncate">
          {speaker.title}
        </span>
      </div>
      {!isPrev && (
        <Arrow className="size-5 text-white/80 group-hover:text-white transition-all duration-300 group-hover:translate-x-1 shrink-0" />
      )}
    </Link>
  );
}
