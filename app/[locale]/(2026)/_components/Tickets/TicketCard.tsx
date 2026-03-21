import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

type Benefit = {
  text: string;
  addon?: string;
};

type Props = {
  tier: "vip" | "premium" | "general";
  tierLabel: string;
  totalSeats: number;
  remainingSeats: number;
  seatsLabel: string;
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
};

export default function TicketCard({
  tierLabel,
  totalSeats,
  remainingSeats,
  seatsLabel,
  benefits,
  ctaLabel,
  ctaHref,
  currentPrice,
  originalPrice,
  currencyLabel,
  isDiscounted,
  phaseLabel,
  discountLabel,
}: Props) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl overflow-hidden h-full",
        "bg-black border border-white/10",
        "transition-all duration-250 ease-out hover:-translate-y-1.5 hover:border-white/20",
      )}
    >
      <div className="flex flex-col flex-grow p-5 md:p-8">
        {/* Header: tier + seats */}
        <div className="flex items-center justify-between mb-5 md:mb-6">
          <h3 className="text-2xl md:text-3xl font-bold text-white">
            {tierLabel}
          </h3>
          <div
            className={cn(
              "px-3 py-1 rounded-full text-xs md:text-sm border tabular-nums",
              remainingSeats / totalSeats <= 0.2
                ? "bg-red-500/10 border-red-500/30 text-red-300"
                : "bg-white/5 border-white/20 text-white/60",
            )}
          >
            {remainingSeats}/{totalSeats} {seatsLabel}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-5 md:mb-6" />

        {/* Phase badge */}
        {isDiscounted && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-white/15 bg-white/5 text-white/60 w-fit mb-3">
            <span>{phaseLabel}</span>
            <span className="opacity-40">|</span>
            <span>{discountLabel}</span>
          </div>
        )}

        {/* Price */}
        <div className="mb-5 md:mb-6">
          {isDiscounted && (
            <del className="text-sm md:text-base text-white/30 tabular-nums block mb-1">
              {originalPrice}
              {currencyLabel}
            </del>
          )}
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl md:text-4xl font-bold text-white tracking-tight tabular-nums">
              {currentPrice}
            </span>
            <span className="text-base md:text-lg text-white/50 font-medium">
              {currencyLabel}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-5 md:mb-6" />

        {/* Benefits */}
        <ul className="grid grid-cols-1 gap-y-2.5 md:gap-y-3">
          {benefits.map((benefit, i) => (
            <li key={i} className="flex items-start gap-2 md:gap-3">
              <Check className="size-4 md:size-5 mt-0.5 flex-shrink-0 text-white/60" />
              <span className="text-white/80 text-xs md:text-base leading-tight whitespace-nowrap">
                {benefit.text}
                {benefit.addon && (
                  <span className="text-white/40 ml-0.5">
                    ({benefit.addon})
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="mt-auto pt-6 md:pt-8">
          <Link
            href={ctaHref}
            className={cn(
              "w-full flex items-center justify-center gap-2",
              "text-sm md:text-base font-medium py-3 px-6 rounded-xl",
              "bg-white/[0.03] border border-white/20 text-white/80 backdrop-blur-sm",
              "transition-all duration-200 hover:bg-white/10 hover:border-white/30",
            )}
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
