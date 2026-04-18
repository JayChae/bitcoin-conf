import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import speakers from "@/app/messages/2026/speakers";
import DifficultyBadge from "../../_components/Speakers/DifficultyBadge";
import SnsLinks from "../../_components/Speakers/SnsLinks";

type Params = { locale: "en" | "ko"; slug: string };

export async function generateStaticParams() {
  const locales = ["en", "ko"] as const;
  return locales.flatMap((locale) =>
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
  return {
    title: speaker.title,
    description: speaker.subtitle,
    openGraph: {
      title: speaker.title,
      description: speaker.subtitle,
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
  const locale = (await getLocale()) as "en" | "ko";
  const list = speakers[locale];
  const index = list.findIndex((s) => s.slug === slug);

  if (index === -1) notFound();

  const speaker = list[index];
  const prev = index > 0 ? list[index - 1] : null;
  const next = index < list.length - 1 ? list[index + 1] : null;

  const t = await getTranslations("Speakers2026");

  return (
    <main className="relative z-10 min-h-screen pt-28 pb-24 px-4">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/speakers"
          className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors mb-12 md:mb-16"
        >
          <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
          {t("backToList")}
        </Link>

        {/* Hero */}
        <header className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-8 md:gap-12 lg:gap-16 items-center">
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-6 md:-inset-8 rounded-full bg-gradient-to-br from-glow-blue/25 via-glow-purple/15 to-glow-pink/25 blur-3xl opacity-70"
            />
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#0d0a1c] ring-1 ring-white/10">
              <Image
                src={speaker.image}
                alt={speaker.title}
                fill
                priority
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <DifficultyBadge difficulty={speaker.difficulty} />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight">
              {speaker.title}
            </h1>
            <p className="text-base md:text-lg text-white/60 leading-relaxed">
              {speaker.subtitle}
            </p>
            <SnsLinks links={speaker.links} size="md" className="mt-1" />
          </div>
        </header>

        {/* Body */}
        <div className="mt-16 md:mt-24 max-w-2xl">
          <div className="text-[15px] md:text-base text-white/75 leading-[1.85] whitespace-pre-line font-light">
            {speaker.bio}
          </div>

          {speaker.lectureTitle && (
            <div className="mt-12 pl-5 border-l-2 border-glow-purple/60">
              <div className="text-[10px] font-medium tracking-[0.25em] uppercase text-glow-pink mb-2">
                {t("lectureLabel")}
              </div>
              <div className="text-xl md:text-2xl font-semibold text-white leading-snug">
                {speaker.lectureTitle}
              </div>
            </div>
          )}
        </div>

        {/* Prev / Next */}
        {(prev || next) && (
          <nav className="mt-20 md:mt-28 pt-8 border-t border-white/10 flex items-center justify-between gap-4">
            {prev ? (
              <Link
                href={`/speakers/${prev.slug}`}
                className="group flex items-center gap-3 min-w-0 max-w-[45%]"
              >
                <ArrowLeft className="size-4 text-white/40 group-hover:text-white transition-all duration-300 group-hover:-translate-x-1 shrink-0" />
                <div className="flex flex-col min-w-0 text-left">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/35">
                    {t("prev")}
                  </span>
                  <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors truncate">
                    {prev.title}
                  </span>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {next ? (
              <Link
                href={`/speakers/${next.slug}`}
                className="group flex items-center gap-3 min-w-0 max-w-[45%] ml-auto"
              >
                <div className="flex flex-col min-w-0 text-right">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/35">
                    {t("next")}
                  </span>
                  <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors truncate">
                    {next.title}
                  </span>
                </div>
                <ArrowRight className="size-4 text-white/40 group-hover:text-white transition-all duration-300 group-hover:translate-x-1 shrink-0" />
              </Link>
            ) : null}
          </nav>
        )}
      </div>
    </main>
  );
}
