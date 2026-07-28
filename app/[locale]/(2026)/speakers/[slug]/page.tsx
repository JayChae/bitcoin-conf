import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import speakers, { type Speaker } from "@/app/messages/2026/speakers";
import DifficultyBadge from "../../_components/Speakers/DifficultyBadge";
import { EYEBROW_CLASS } from "../../_components/Speakers/InfoField";

import SnsLinks from "../../_components/Speakers/SnsLinks";
import { pageMetadata } from "../../_utils/metadata";
import { cn } from "@/lib/utils";

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
  return pageMetadata({
    locale,
    pathname: `/speakers/${slug}`,
    title: speaker.title,
    description: speaker.subtitle.join(" · "),
    ogImage: { url: speaker.image },
  });
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
          {/* 본문이 길어도 사진이 함께 따라오도록 데스크톱에서만 고정한다. */}
          <div className="relative aspect-square w-full max-w-[260px] mx-auto md:mx-0 md:sticky md:top-28 rounded-2xl overflow-hidden">
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
            <div className="flex flex-col gap-1 text-lg md:text-xl text-white/60 leading-relaxed break-keep">
              {speaker.subtitle.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <SnsLinks links={speaker.links} size="md" className="mt-1" />

            {/* 강의 주제는 이 페이지의 본론이라 소개글보다 먼저 읽히도록 올린다. */}
            <div className="mt-10 md:mt-12 pt-8 border-t border-white/10">
              <span className={EYEBROW_CLASS}>{t("lectureLabel")}</span>
              <p
                className={cn(
                  "mt-3 text-2xl md:text-3xl font-semibold leading-snug break-keep",
                  speaker.lectureTitle ? "text-white" : "text-white/35"
                )}
              >
                {speaker.lectureTitle || t("comingSoon")}
              </p>

              <dl className="mt-7 flex flex-wrap gap-x-12 gap-y-4">
                <MetaItem
                  label={t("sessionLabel")}
                  value={speaker.session}
                  comingSoonText={t("comingSoon")}
                />
                <MetaItem
                  label={t("stageLabel")}
                  value={speaker.stage}
                  comingSoonText={t("comingSoon")}
                />
              </dl>
            </div>

            <div className="mt-8 md:mt-10 pt-8 border-t border-white/10 text-base md:text-lg text-white/75 leading-[1.85] whitespace-pre-line font-light break-keep">
              {speaker.bio}
            </div>
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

// 값이 없어도 자리를 지켜야 하는 부가 정보라, 배지 대신 조용한 텍스트로 둔다.
function MetaItem({
  label,
  value,
  comingSoonText,
}: {
  label: string;
  value: string | undefined;
  comingSoonText: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <dt className={EYEBROW_CLASS}>{label}</dt>
      <dd
        className={cn(
          "text-sm font-medium truncate",
          value ? "text-white" : "text-white/35"
        )}
      >
        {value || comingSoonText}
      </dd>
    </div>
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
