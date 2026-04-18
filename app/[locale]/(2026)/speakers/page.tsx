import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import speakers from "@/app/messages/2026/speakers";
import SpeakersGrid from "../_components/Speakers/SpeakersGrid";

export async function generateMetadata() {
  const t = await getTranslations("Speakers2026");
  return {
    title: t("pageTitle"),
    description: t("pageSubtitle"),
  };
}

export default async function SpeakersPage() {
  const t = await getTranslations("Speakers2026");
  const locale = (await getLocale()) as Locale;
  const list = speakers[locale];

  return (
    <main className="relative z-10 min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {t("pageTitle")}
          </h1>
          <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto">
            {t("pageSubtitle")}
          </p>
        </div>
        <SpeakersGrid speakers={list} />
      </div>
    </main>
  );
}
