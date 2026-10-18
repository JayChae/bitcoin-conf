import { getTranslations } from "next-intl/server";
import Section from "../Section";
import SponsorTiers from "./SponsorTiers";
import SponsorInquiryCta from "./SponsorInquiryCta";

// 스폰서 섹션 — 티어 → 후원 문의. 트랙 레코드는 미디어 파트너 섹션 뒤로 옮겼다(TrackRecordSection).
export default async function SponsorsSection() {
  const t = await getTranslations("Sponsor");
  const tSponsors = await getTranslations("Sponsors2026");

  return (
    <Section id="sponsors" title={t("title")}>
      <SponsorTiers />
      <SponsorInquiryCta
        label={tSponsors("inquiryCta")}
        description={tSponsors("inquiryLead")}
      />
    </Section>
  );
}
