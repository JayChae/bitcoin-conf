import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import speakers from "@/app/messages/2026/speakers";
import PagedCarousel from "../PagedCarousel";
import SpeakerCard from "./SpeakerCard";
import { getSpeakerLabels } from "./labels";
import ViewAllLink from "../ViewAllLink";

// 모바일은 1장씩이라 전원을 다 넣으면 도트가 너무 많아진다. 앞 8명만 보여주고
// 나머지는 "모든 연사 보기"로 넘긴다.
const MOBILE_LIMIT = 8;

export default async function SpeakersSection() {
  const t = await getTranslations("Speakers2026");
  const locale = (await getLocale()) as Locale;
  const list = speakers[locale];

  if (list.length === 0) return null;

  const labels = getSpeakerLabels(t);

  return (
    <section id="speakers" className="scroll-mt-24 mt-40 md:mt-44 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="relative inline-block mb-10 md:mb-12 w-full text-center">
          <div className="absolute inset-0 section-title-glow pointer-events-none" />
          <h2
            className="relative text-3xl md:text-4xl lg:text-5xl font-bold pointer-events-none animate-fade-in px-6 py-3"
            style={{ color: "#FFFFFF" }}
          >
            {t("sectionTitle")}
          </h2>
        </div>

        <PagedCarousel
          items={list.map((speaker) => ({
            key: speaker.slug,
            node: <SpeakerCard speaker={speaker} labels={labels} />,
          }))}
          labels={labels}
          viewAllHref="/speakers"
          mobileLimit={MOBILE_LIMIT}
        />

        <ViewAllLink href="/speakers" label={t("viewAll")} />
      </div>
    </section>
  );
}
