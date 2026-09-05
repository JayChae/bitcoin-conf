import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
import TicketCard from "./TicketCard";
import StudentTicketCard from "./StudentTicketCard";
import { VISIBLE_TICKETS } from "../../_constants/tickets";
import { getDiscountedPrice, isDiscounted, formatKRW } from "../../_utils/tickets";
import { getCurrentPhase } from "@/lib/pricing";
import { isTierPurchasable } from "@/lib/shopify-config";
import { cn } from "@/lib/utils";

const PHASE_KEYS: Record<string, { phase: string; discount: string }> = {
  earlybird1: { phase: "phaseEarlybird1", discount: "discountEarlybird1" },
  earlybird2: { phase: "phaseEarlybird2", discount: "discountEarlybird2" },
};

/**
 * 카드 수에 맞춘 lg 이상 열 배치. 티어를 숨기면 카드가 줄어드는데 열 수가 고정이면
 * 빈 칸이 남아 카드가 왼쪽으로 쏠린다. Tailwind가 클래스를 정적으로 수집해야 하므로
 * 문자열을 조립하지 않고 카드 수별로 미리 적어둔다.
 * 5장은 칸이 좁아 간격을 한 단계 줄인다.
 */
const GRID_BY_CARD_COUNT: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5 lg:gap-4 xl:gap-6",
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

  // 학생 카드 1장 + 노출 중인 티어 카드
  const cardCount = 1 + VISIBLE_TICKETS.length;

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6",
        GRID_BY_CARD_COUNT[cardCount] ?? "lg:grid-cols-4",
      )}
    >
      <div>
        <StudentTicketCard
          tierLabel={t("student")}
          freeLabel={t("studentFree")}
          subLabel={t("studentNotice")}
          description={t("studentDescription")}
          benefits={studentBenefitKeys.map((key) => ({ text: t(key) }))}
          notice={t("studentIdRequired")}
          applyLabel={t("ctaApply")}
          applyHref="https://forms.gle/4K2PxaYT5PRzPQT26"
          closed
          closedLabel={t("closed")}
        />
      </div>
      {await Promise.all(
        VISIBLE_TICKETS.map(async (ticket) => {
          const phase = await getCurrentPhase(ticket.tier);
          const discounted = isDiscounted(phase);
          const phaseKey = PHASE_KEYS[phase];
          const benefits = ticket.benefitKeys.map((key) => ({
            text: t(key),
            soldOut: ticket.soldOutKeys?.includes(key),
          }));
          const currentPrice = getDiscountedPrice(ticket.basePrice, phase);
          // Shopify variant 미등록 티어는 결제가 불가능하므로 마감으로 표시한다
          const tierSaleStatus = isTierPurchasable(ticket.tier)
            ? saleStatus
            : "closed";

          return (
            <div key={ticket.tier}>
              <TicketCard
                tierLabel={t(ticket.tier)}
                description={
                  ticket.descriptionKey ? t(ticket.descriptionKey) : undefined
                }
                benefits={benefits}
                ctaLabel={t("ctaBuy")}
                ctaHref={`/tickets/${ticket.tier}`}
                currentPrice={formatKRW(currentPrice, locale)}
                originalPrice={formatKRW(ticket.basePrice, locale)}
                currencyLabel={t("currency")}
                vatNote={t("vatNote")}
                isDiscounted={discounted}
                phaseLabel={phaseKey ? t(phaseKey.phase) : ""}
                discountLabel={phaseKey ? t(phaseKey.discount) : ""}
                saleStatus={tierSaleStatus}
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
