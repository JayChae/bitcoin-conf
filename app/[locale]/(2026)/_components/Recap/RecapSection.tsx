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
    // 히어로(h-lvh) 바로 다음 섹션 — 위 마진 없이 스크롤 시작하자마자 보여야 한다
    <section id="recap" className="scroll-mt-24">
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
            <YouTubePlayer videoId={RECAP_VIDEO_ID} title={t("videoTitle")} />
          </div>
          {/* lg: 행 높이는 16:9 플레이어가 정한다 — 컴팩트 카드(2줄 클램프)의 총
              min-content 가 플레이어보다 항상 작아서다. 카드 열은 auto-rows-fr 로
              그 높이를 균등 분할하므로 목록의 위아래가 영상 모서리와 딱 맞는다. */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-1 lg:auto-rows-fr lg:gap-3">
            {articles.map((article) => (
              <PressCard
                key={article.id}
                article={article}
                ctaLabel={t("readArticle")}
                compact
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
