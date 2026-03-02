import { getTranslations } from "next-intl/server";
import SeatingChart from "../_components/Tickets/SeatingChart";
import TicketsGrid from "../_components/Tickets/TicketsGrid";

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

        <SeatingChart />
        <TicketsGrid />
      </div>
    </main>
  );
}
