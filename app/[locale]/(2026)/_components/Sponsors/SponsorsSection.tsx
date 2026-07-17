import { getTranslations } from "next-intl/server";
import Section from "../Section";
import SponsorTiers from "./SponsorTiers";
import SponsorInquiryCta from "./SponsorInquiryCta";
import TrackRecordBand from "../Partners/TrackRecordBand";
import ViewAllLink from "../ViewAllLink";

// 스폰서 + 트랙 레코드 통합 섹션. 티어 → 후원 문의 → 트랙 레코드 → 전체 보기.
export default async function SponsorsSection() {
  const t = await getTranslations("Sponsor");
  const tSponsors = await getTranslations("Sponsors2026");

  return (
    <Section id="sponsors" title={t("title")} className="pb-28 md:pb-36">
      {/* 블록 1 — 2026 스폰서 */}
      <SponsorTiers />
      <SponsorInquiryCta
        label={tSponsors("inquiryCta")}
        description={tSponsors("inquiryLead")}
      />

      {/* 구분선 — 스폰서(위) / 트랙 레코드(아래) 경계를 명확히 */}
      <div className="mx-auto mt-24 md:mt-32 h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      {/* 블록 2 — 트랙 레코드 */}
      <div className="mt-16 md:mt-20">
        <TrackRecordBand />
        <ViewAllLink href="/sponsors" label={tSponsors("viewAll")} />
      </div>
    </Section>
  );
}
