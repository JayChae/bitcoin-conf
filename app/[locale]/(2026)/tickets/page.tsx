import { getTranslations } from "next-intl/server";
import TicketsGrid from "../_components/Tickets/TicketsGrid";
import FloatingLines from "@/components/FloatingLines";

export default async function TicketsPage() {
  const t = await getTranslations("Tickets2026");

  return (
    <main className="relative z-10 min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {t("pageTitle")}
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            {t("pageDescription")}
          </p>
        </div>

        <TicketsGrid />
      </div>
    </main>
  );
}
