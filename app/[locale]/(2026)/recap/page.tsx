import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import press from "@/app/messages/2026/press";
import { RECAP_VIDEO_ID } from "@/app/messages/2026/recap";
import HighlightsMarquee from "../_components/Recap/HighlightsMarquee";
import RecapVideo from "../_components/Recap/RecapVideo";
import PressCard from "../_components/Recap/PressCard";

export async function generateMetadata() {
  const t = await getTranslations("Recap2026");
  return {
    title: t("pageTitle"),
    description: t("pageSubtitle"),
  };
}

export default async function RecapPage() {
  const t = await getTranslations("Recap2026");
  const locale = (await getLocale()) as Locale;
  const articles = press[locale];

  return (
    <main className="relative z-10 min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {t("pageTitle")}
          </h1>
          <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto">
            {t("pageSubtitle")}
          </p>
        </div>

        <div className="mb-12 md:mb-16">
          <HighlightsMarquee altPrefix={t("highlightsAlt")} />
        </div>

        <div className="max-w-4xl mx-auto mb-12 md:mb-16">
          <RecapVideo videoId={RECAP_VIDEO_ID} title={t("videoTitle")} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
          {articles.map((article) => (
            <PressCard
              key={article.id}
              article={article}
              ctaLabel={t("readArticle")}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
