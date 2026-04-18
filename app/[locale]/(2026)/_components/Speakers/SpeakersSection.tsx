import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import speakers from "@/app/messages/2026/speakers";
import SpeakersGrid from "./SpeakersGrid";

export default async function SpeakersSection() {
  const t = await getTranslations("Speakers2026");
  const locale = (await getLocale()) as "en" | "ko";
  const list = speakers[locale];

  if (list.length === 0) return null;

  return (
    <section id="speakers" className="scroll-mt-24 pb-20 pt-20 px-4">
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

        <SpeakersGrid speakers={list} />

        <div className="flex justify-center mt-10 md:mt-12">
          <Link
            href="/speakers"
            className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white/10 backdrop-blur-2xl text-white text-base font-semibold border border-white/15 transition-colors duration-200 hover:bg-white/15 active:scale-[0.97]"
          >
            {t("pageTitle")}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
