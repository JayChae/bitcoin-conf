import { Check, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CARD } from "./cardStyles";
import { Link } from "@/i18n/navigation";

type Benefit = {
  text: string;
  addon?: string;
  soldOut?: boolean;
};

type SaleStatus = "upcoming" | "open" | "closed";

type Props = {
  tierLabel: string;
  /** 티어명 아래 부가 설명 (예: "11월 7일 행사만 참석") */
  description?: string;
  benefits: Benefit[];
  ctaLabel: string;
  ctaHref: string;
  // Pricing
  currentPrice: string;
  originalPrice: string;
  currencyLabel: string;
  isDiscounted: boolean;
  // Phase
  phaseLabel: string;
  discountLabel: string;
  // Note
  vatNote?: string;
  // Sale status
  saleStatus: SaleStatus;
  closedLabel: string;
  comingSoonLabel: string;
  // Best offer
  bestOffer?: boolean;
  bestOfferLabel?: string;
};

export default function TicketCard({
  tierLabel,
  description,
  benefits,
  ctaLabel,
  ctaHref,
  currentPrice,
  originalPrice,
  currencyLabel,
  isDiscounted,
  phaseLabel,
  discountLabel,
  vatNote,
  saleStatus,
  closedLabel,
  comingSoonLabel,
  bestOffer,
  bestOfferLabel,
}: Props) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl overflow-hidden h-full",
        "bg-[#15122a]/90 backdrop-blur-2xl",
        "transition-all duration-250 ease-out",
        bestOffer
          ? "border-2 border-glow-purple/60 hover:-translate-y-1 animate-glow-pulse"
          : "border border-white/10 hover:border-white/15 hover:-translate-y-1",
      )}
    >
      {/* Best Offer banner */}
      {bestOffer && (
        <div className="flex items-center justify-center gap-2 py-2.5 border-b border-glow-purple/20 bg-gradient-to-r from-glow-blue/15 via-glow-purple/15 to-glow-pink/15">
          <Sparkles className="size-3.5 text-glow-pink" />
          <span className="text-xs font-semibold tracking-widest uppercase bg-gradient-to-r from-[#7BA4F7] via-[#C084FC] to-[#F0ABFC] bg-clip-text text-transparent">
            {bestOfferLabel}
          </span>
        </div>
      )}

      <div className={cn("flex flex-col flex-grow", CARD.pad)}>
        {/* Header: tier */}
        <div className={description ? "mb-2" : "mb-6 md:mb-8"}>
          <h3 className={cn(CARD.title, "text-white")}>{tierLabel}</h3>
        </div>

        {/* Description */}
        {description && (
          <p className={cn(CARD.description, "mb-6 md:mb-8")}>{description}</p>
        )}

        {/* Early Bird - desktop only */}
        {isDiscounted && (
          <div className="hidden md:inline-flex flex-wrap max-w-full items-center gap-2 lg:gap-1.5 px-3 lg:px-2 py-1.5 rounded-full text-xs lg:text-[10px] xl:text-xs font-medium border border-white/15 bg-white/5 text-white/70 w-fit mb-5">
            <span>{phaseLabel}</span>
            <span className="text-white/30">|</span>
            <span>{discountLabel}</span>
          </div>
        )}

        {/* Price */}
        <div className="mb-8 md:mb-10">
          {isDiscounted && (
            <div className="flex items-center gap-2 mb-1.5">
              <del className="text-sm lg:text-xs text-white/50 tabular-nums">
                {originalPrice} {currencyLabel}
              </del>
              {/* Early bird inline - mobile only */}
              <span className="inline-flex md:hidden items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border border-white/15 bg-white/5 text-white/50">
                {phaseLabel} · {discountLabel}
              </span>
            </div>
          )}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className={cn(CARD.price, "tabular-nums")}>
              {currentPrice}
            </span>
            <span className="text-base lg:text-sm xl:text-base text-white/40 font-medium">
              {currencyLabel}
            </span>
          </div>
          {vatNote && (
            <p className="text-xs text-white/40 mt-2">{vatNote}</p>
          )}
        </div>

        {/* Divider */}
        <div className={CARD.divider} />

        {/* Benefits */}
        <ul className={CARD.benefits}>
          {benefits.map((benefit, i) => (
            <li key={i} className="flex items-start gap-2.5">
              {benefit.soldOut ? (
                <X className="size-4 mt-0.5 flex-shrink-0 text-white/25" />
              ) : (
                <Check className="size-4 mt-0.5 flex-shrink-0 text-white/50" />
              )}
              <span
                className={cn(
                  CARD.benefitText,
                  benefit.soldOut ? "text-white/40" : "text-white/80",
                )}
              >
                <span className={cn(benefit.soldOut && "line-through")}>
                  {benefit.text}
                </span>
                {benefit.soldOut && (
                  <span className="ml-1.5 text-[11px] font-medium text-white/50 no-underline">
                    {closedLabel}
                  </span>
                )}
                {benefit.addon && (
                  <span className="text-white/30 ml-0.5">
                    ({benefit.addon})
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className={CARD.ctaWrap}>
          {saleStatus === "open" ? (
            <Link
              href={ctaHref}
              className={cn(
                CARD.ctaButton,
                "transition-colors duration-200",
                bestOffer
                  ? "bg-gradient-to-r from-glow-purple to-glow-pink text-white hover:opacity-90"
                  : "bg-white/10 text-white border border-white/15 hover:bg-white/15",
              )}
            >
              {ctaLabel}
            </Link>
          ) : (
            <button
              disabled
              className={cn(
                CARD.ctaButton,
                "bg-white/10 text-white/40 border border-white/15",
                "cursor-not-allowed",
              )}
            >
              {saleStatus === "closed" ? closedLabel : comingSoonLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
