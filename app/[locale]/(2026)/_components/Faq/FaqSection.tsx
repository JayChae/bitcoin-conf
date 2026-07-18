import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import faq from "@/app/messages/2026/faq";
import SectionTitle from "../SectionTitle";
import FaqAccordion from "./FaqAccordion";

export default async function FaqSection() {
  const t = await getTranslations("Faq2026");
  const locale = (await getLocale()) as Locale;
  const items = faq[locale];

  return (
    <section id="faq" className="scroll-mt-24 mt-40 md:mt-44 pb-28 md:pb-36">
      <div className="mx-auto max-w-3xl px-4">
        <SectionTitle title={t("sectionTitle")} className="mb-4" />

        <p className="mx-auto mb-10 max-w-xl text-center text-base text-white/60 md:mb-12 md:text-lg">
          {t("lead")}
        </p>
      </div>

      <FaqAccordion items={items} />
    </section>
  );
}
