import { Check, IdCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { CARD } from "./cardStyles";

type Props = {
  tierLabel: string;
  freeLabel: string;
  subLabel?: string;
  description: string;
  benefits: { text: string }[];
  notice?: string;
  applyLabel: string;
  applyHref: string;
  closed?: boolean;
  closedLabel?: string;
};

export default function StudentTicketCard({
  tierLabel,
  freeLabel,
  subLabel,
  description,
  benefits,
  notice,
  applyLabel,
  applyHref,
  closed,
  closedLabel,
}: Props) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl overflow-hidden h-full",
        "bg-[#15122a]/90 backdrop-blur-2xl border border-white/10",
        "transition-all duration-250 ease-out hover:-translate-y-1 hover:border-white/15",
      )}
    >
      <div className={cn("flex flex-col flex-grow", CARD.pad)}>
        {/* Header: tier */}
        <div className="flex items-center justify-between mb-8 md:mb-8">
          <h3 className={cn(CARD.title, "text-white")}>{tierLabel}</h3>
        </div>

        {/* Description */}
        <p className={cn(CARD.description, "mb-4")}>{description}</p>

        {/* Price — spacer matches strikethrough line in other cards */}
        <div className="mb-8 md:mb-20 lg:mb-14 xl:mb-20">
          <div className="flex items-baseline gap-1.5">
            <span className={CARD.price}>{freeLabel}</span>
          </div>
          {subLabel && (
            <p className="text-xs text-white/40 mt-2">{subLabel}</p>
          )}
        </div>

        {/* Divider */}
        <div className={CARD.divider} />

        {/* Benefits */}
        <ul className={CARD.benefits}>
          {benefits.map((benefit, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <Check className="size-4 mt-0.5 flex-shrink-0 text-white/50" />
              <span className={cn(CARD.benefitText, "text-white/80")}>
                {benefit.text}
              </span>
            </li>
          ))}
          {notice && (
            <li className="flex items-start gap-2.5">
              <IdCard className="size-4 mt-0.5 flex-shrink-0 text-white/50" />
              <span className={cn(CARD.benefitText, "text-white/80")}>
                {notice}
              </span>
            </li>
          )}
        </ul>

        {/* CTA */}
        <div className={CARD.ctaWrap}>
          {closed ? (
            <button
              disabled
              className={cn(
                CARD.ctaButton,
                "bg-white/10 text-white/40 border border-white/15",
                "cursor-not-allowed",
              )}
            >
              {closedLabel}
            </button>
          ) : (
            <a
              href={applyHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                CARD.ctaButton,
                "bg-white/10 text-white border border-white/15",
                "transition-colors duration-200 hover:bg-white/15",
              )}
            >
              {applyLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
