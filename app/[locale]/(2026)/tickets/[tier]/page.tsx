import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { isValidTier } from "../../_utils/tierMapping";
import { TICKETS } from "../../_constants/tickets";
import {
  getDiscountedPrice,
  isDiscounted as checkDiscount,
  formatKRW,
} from "../../_utils/tickets";
import { getCurrentPhase, getSaleStatus } from "@/lib/pricing";
import { redirect } from "next/navigation";
import SeatMapOverview from "../../_components/Tickets/SeatMapOverview";
import PurchaseFlow from "./_components/PurchaseFlow";

type Props = {
  params: Promise<{ locale: string; tier: string }>;
};

export default async function TierPage({ params }: Props) {
  const { locale, tier } = await params;

  if (!isValidTier(tier)) notFound();

  const saleStatus = await getSaleStatus();
  // if (saleStatus !== "open") redirect(`/${locale}/#tickets`);

  const t = await getTranslations("Tickets2026");
  const ticket = TICKETS.find((tk) => tk.tier === tier)!;
  const phase = await getCurrentPhase(tier);
  const currentPrice = getDiscountedPrice(ticket.basePrice, phase);
  const discounted = checkDiscount(phase);

  return (
    <main className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
            {t(tier)} {t("pageTitle")}
          </h1>
          <p className="text-lg text-white/60">
            {formatKRW(currentPrice, locale)}
            {t("currency")}
            {discounted && (
              <span className="ml-2 text-sm line-through text-white/30">
                {formatKRW(ticket.basePrice, locale)}
                {t("currency")}
              </span>
            )}
          </p>
        </div>

        <SeatMapOverview />
        <PurchaseFlow tier={tier} locale={locale} phase={phase} />
      </div>
    </main>
  );
}
