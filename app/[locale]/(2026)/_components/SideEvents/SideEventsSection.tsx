import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import sideEvents from "@/app/messages/2026/sideEvents";
import SideEventsGrid from "./SideEventsGrid";
import ViewAllLink from "../ViewAllLink";

export default async function SideEventsSection() {
  const t = await getTranslations("SideEvents2026");
  const locale = (await getLocale()) as Locale;
  const list = sideEvents[locale];

  if (list.length === 0) return null;

  return (
    <section id="side-events" className="scroll-mt-24 pb-20 pt-20 px-4">
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

        <SideEventsGrid events={list} />

        <ViewAllLink href="/side-events" label={t("viewAll")} />
      </div>
    </section>
  );
}
