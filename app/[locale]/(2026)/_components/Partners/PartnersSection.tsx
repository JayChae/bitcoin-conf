import { getTranslations } from "next-intl/server";
import partners from "@/app/messages/2026/partners";
import Section from "../Section";
import PartnersMarquee from "./PartnersMarquee";
import ViewAllLink from "../ViewAllLink";

export default async function PartnersSection() {
  const t = await getTranslations("Partners2026");

  if (partners.length === 0) return null;

  return (
    <Section id="partners" title={t("sectionTitle")}>
      {/* 반투명 밴드(bg-white/10). 로고는 카드 없이 밴드 위에 직접,
          높이 기준으로 크기 통일(PartnersMarquee). 로고는 원본 색 그대로. */}
      <div className="w-full bg-white/10 py-8 md:py-10">
        <PartnersMarquee partners={partners} />
      </div>

      <ViewAllLink href="/partners" label={t("viewAll")} />
    </Section>
  );
}
