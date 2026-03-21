import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
import TicketCard from "./TicketCard";
import StudentTicketCard from "./StudentTicketCard";
import { TICKETS, CURRENT_PHASE } from "../../_constants/tickets";
import { getDiscountedPrice, isDiscounted, formatKRW } from "../../_utils/tickets";
import { getRemainingSeatsByTier } from "../../_utils/seats";

const PHASE_KEYS: Record<string, { phase: string; discount: string }> = {
  earlybird1: { phase: "phaseEarlybird1", discount: "discountEarlybird1" },
  earlybird2: { phase: "phaseEarlybird2", discount: "discountEarlybird2" },
};

export default async function TicketsGrid() {
  const t = await getTranslations("Tickets2026");
  const locale = await getLocale();
  const discounted = isDiscounted();
  const phaseKey = PHASE_KEYS[CURRENT_PHASE];
  const remaining = await getRemainingSeatsByTier();

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
          ctaLabel={t("ctaApply")}
          ctaHref="#"
        />
      </div>
      {TICKETS.map((ticket) => {
        const benefits = ticket.benefitKeys.map((key) => ({
          text: t(key),
        }));

        const currentPrice = getDiscountedPrice(ticket.basePrice);

        return (
          <div key={ticket.tier}>
            <TicketCard
              tier={ticket.tier}
              tierLabel={t(ticket.tier)}
              totalSeats={ticket.totalSeats}
              remainingSeats={remaining[ticket.tier]}
              seatsLabel={t("seats")}
              benefits={benefits}
              ctaLabel={t("ctaBuy")}
              ctaHref={`/tickets/${ticket.tier}`}
              currentPrice={formatKRW(currentPrice, locale)}
              originalPrice={formatKRW(ticket.basePrice, locale)}
              currencyLabel={t("currency")}
              isDiscounted={discounted}
              phaseLabel={phaseKey ? t(phaseKey.phase) : ""}
              discountLabel={phaseKey ? t(phaseKey.discount) : ""}
            />
          </div>
        );
      })}
    </div>
  );
}
