import { getTranslations } from "next-intl/server";
import SectionTitle from "../SectionTitle";
import MediaPartnerTiers from "./MediaPartnerTiers";
import { hasMediaPartners } from "@/app/messages/2026/mediaPartners";

// 미디어 파트너 — 후원사와 다른 개념이라 독립 섹션. 스폰서 섹션 바로 아래, 팀 트랙 레코드 위.
// 리드 문단이 붙어 Section 래퍼 대신 SectionTitle 을 직접 쓴다(FAQ·리캡과 같은 구성).
export default async function MediaPartnersSection() {
  if (!hasMediaPartners) return null;

  const t = await getTranslations("MediaPartners2026");

  return (
    <section id="media-partners" className="w-full scroll-mt-24 mt-40 md:mt-44">
      <div className="mx-auto max-w-3xl px-4">
        <SectionTitle title={t("title")} className="mb-4" />
        <p className="mx-auto mb-10 max-w-xl break-keep text-center text-base text-white/60 md:mb-12 md:text-lg">
          {t("lead")}
        </p>
      </div>

      <MediaPartnerTiers />
    </section>
  );
}
