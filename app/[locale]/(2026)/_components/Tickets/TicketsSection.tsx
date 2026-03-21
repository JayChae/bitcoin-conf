import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import TicketsGrid from "./TicketsGrid";

export default async function TicketsSection() {
  const t = await getTranslations("Tickets2026");

  return (
    <section id="tickets" className="scroll-mt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-10 md:mb-12">
          {t("sectionTitle")}
        </h2>

        <TicketsGrid />

        <div className="flex justify-center mt-10 md:mt-12">
          <Link
            href="/tickets"
            className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white/10 backdrop-blur-2xl text-white text-base font-semibold border border-white/15 transition-colors duration-200 hover:bg-white/15 active:scale-[0.97]"
          >
            {t("viewAll")}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
