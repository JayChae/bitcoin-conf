import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
import TicketCard from "./TicketCard";
import StudentTicketCard from "./StudentTicketCard";
import { TICKETS } from "../../_constants/tickets";
import { getDiscountedPrice, isDiscounted, formatKRW } from "../../_utils/tickets";
import { getCurrentPhase } from "@/lib/pricing";

const PHASE_KEYS: Record<string, { phase: string; discount: string }> = {
  earlybird1: { phase: "phaseEarlybird1", discount: "discountEarlybird1" },
  earlybird2: { phase: "phaseEarlybird2", discount: "discountEarlybird2" },
};

export default async function TicketsGrid({
  saleStatus,
}: {
  saleStatus: "open" | "closed";
}) {
  const t = await getTranslations("Tickets2026");
  const locale = await getLocale();

  const studentBenefitKeys = [
    "studentBenefitNote",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <div>
        <StudentTicketCard
          tierLabel={t("student")}
          freeLabel={t("studentFree")}
          description={t("studentDescription")}
          benefits={studentBenefitKeys.map((key) => ({ text: t(key) }))}
          notice={t("studentIdRequired")}
          comingSoonLabel={t("comingSoon")}
        />
      </div>
      {await Promise.all(
        TICKETS.map(async (ticket) => {
          const phase = await getCurrentPhase(ticket.tier);
          const discounted = isDiscounted(phase);
          const phaseKey = PHASE_KEYS[phase];
          const benefits = ticket.benefitKeys.map((key) => ({
            text: t(key),
          }));
          const currentPrice = getDiscountedPrice(ticket.basePrice, phase);

          return (
            <div key={ticket.tier}>
              <TicketCard
                tierLabel={t(ticket.tier)}
                benefits={benefits}
                ctaLabel={t("ctaBuy")}
                ctaHref={`/tickets/${ticket.tier}`}
                currentPrice={formatKRW(currentPrice, locale)}
                originalPrice={formatKRW(ticket.basePrice, locale)}
                currencyLabel={t("currency")}
                isDiscounted={discounted}
                phaseLabel={phaseKey ? t(phaseKey.phase) : ""}
                discountLabel={phaseKey ? t(phaseKey.discount) : ""}
                saleStatus={saleStatus}
                closedLabel={t("closed")}
                comingSoonLabel={t("comingSoon")}
                bestOffer={ticket.tier === "premium"}
                bestOfferLabel={t("bestOffer")}
              />
            </div>
          );
        }),
      )}
    </div>
  );
}
