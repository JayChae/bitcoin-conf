import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import SectionTitle from "../SectionTitle";
import getInvolved from "@/app/messages/2026/getInvolved";
import GetInvolvedCard from "./GetInvolvedCard";

// 참여 신청 허브("함께하기") — 사이드 이벤트·마켓·스폰서·커뮤니티&미디어 파트너
// 4개 신청 경로를 하나의 카드 그리드로 모은 고전환 진입점.
export default async function GetInvolvedSection() {
  const t = await getTranslations("GetInvolved2026");
  const locale = (await getLocale()) as Locale;
  const cards = getInvolved[locale];

  return (
    <section id="get-involved" className="scroll-mt-24 mt-40 md:mt-44">
      <div className="mx-auto max-w-5xl px-4">
        <SectionTitle title={t("sectionTitle")} className="mb-4" />

        <p className="mx-auto mb-10 md:mb-12 max-w-2xl text-center text-base text-white/60 md:text-lg">
          {t("lead")}
        </p>
      </div>

      <div className="mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
          {cards.map((card) => (
            <GetInvolvedCard
              key={card.key}
              card={card}
              applyLabel={t("apply")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
