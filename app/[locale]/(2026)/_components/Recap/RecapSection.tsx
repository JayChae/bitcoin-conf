import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import press from "@/app/messages/2026/press";
import { RECAP_VIDEO_ID } from "@/app/messages/2026/recap";
import HighlightsMarquee from "./HighlightsMarquee";
import YouTubePlayer from "../YouTubePlayer";
import SectionTitle from "../SectionTitle";
import PressCard from "./PressCard";

export default async function RecapSection() {
  const t = await getTranslations("Recap2026");
  const locale = (await getLocale()) as Locale;
  const articles = press[locale];

  if (articles.length === 0) return null;

  return (
    <section id="recap" className="scroll-mt-24 pb-20 pt-20">
      <div className="max-w-7xl mx-auto px-4">
        <SectionTitle title={t("sectionTitle")} className="mb-4" />

        <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto text-center mb-10 md:mb-12">
          {t("lead")}
        </p>
      </div>

      <HighlightsMarquee altPrefix={t("highlightsAlt")} />

      <div className="max-w-7xl mx-auto px-4 mt-10 md:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7">
            <YouTubePlayer
              videoId={RECAP_VIDEO_ID}
              title={t("videoTitle")}
              className="lg:aspect-auto lg:h-full"
            />
          </div>
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5 lg:auto-rows-fr">
            {articles.map((article) => (
              <PressCard
                key={article.id}
                article={article}
                ctaLabel={t("readArticle")}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
