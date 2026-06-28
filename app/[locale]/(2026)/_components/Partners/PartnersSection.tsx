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
      {/* 회색 배경 띠: 흰/검은 글자 로고가 섞여 있어 중간 회색으로 깔아 노출 */}
      <div className="w-full bg-neutral-400 py-10 md:py-14">
        <PartnersMarquee partners={partners} />
      </div>

      <ViewAllLink href="/partners" label={t("viewAll")} />
    </Section>
  );
}
