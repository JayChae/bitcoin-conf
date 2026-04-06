import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import TicketsGrid from "./TicketsGrid";
import { getSaleStatus } from "@/lib/pricing";

export default async function TicketsSection() {
  const t = await getTranslations("Tickets2026");
  const saleStatus = await getSaleStatus();

  if (saleStatus === "upcoming") return null;

  return (
    <section id="tickets" className="scroll-mt-24 pb-20 px-4">
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

        <TicketsGrid saleStatus={saleStatus} />

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
