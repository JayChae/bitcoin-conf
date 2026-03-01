import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Benefit = {
  text: string;
  addon?: string;
};

type Props = {
  tier: "vip" | "premium" | "general";
  tierLabel: string;
  totalSeats: number;
  seatsLabel: string;
  benefits: Benefit[];
  ctaLabel: string;
};

const tierStyles = {
  vip: {
    accent: "bg-amber-500",
    check: "text-amber-400",
    glow: "animate-gold-glow",
    badge: "border-amber-500/30 text-amber-300/80",
    cta: "border-amber-500/30 text-amber-300/60",
  },
  premium: {
    accent: "bg-purple-500",
    check: "text-purple-400",
    glow: "animate-purple-glow",
    badge: "border-purple-500/30 text-purple-300/80",
    cta: "border-purple-500/30 text-purple-300/60",
  },
  general: {
    accent: "bg-white/40",
    check: "text-white/50",
    glow: "",
    badge: "border-white/20 text-white/60",
    cta: "border-white/15 text-white/40",
  },
} as const;

export default function TicketCard({
  tier,
  tierLabel,
  totalSeats,
  seatsLabel,
  benefits,
  ctaLabel,
}: Props) {
  const style = tierStyles[tier];

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl overflow-hidden h-full",
        "bg-black/40 backdrop-blur-sm border border-white/10",
        "transition-transform duration-250 ease-out hover:-translate-y-1.5",
        style.glow
      )}
    >
      {/* Accent strip */}
      <div className={cn("h-1 w-full", style.accent)} />

      <div className="flex flex-col flex-grow p-5 md:p-8">
        {/* Header: tier + seats */}
        <div className="flex items-center justify-between mb-5 md:mb-6">
          <h3 className="text-2xl md:text-3xl font-bold text-white">
            {tierLabel}
          </h3>
          <div
            className={cn(
              "px-3 py-1 rounded-full text-xs md:text-sm border",
              "bg-white/5",
              style.badge
            )}
          >
            {totalSeats}{seatsLabel}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-5 md:mb-6" />

        {/* Benefits - 2 columns on mobile, 1 on desktop */}
        <ul className="grid grid-cols-2 md:grid-cols-1 gap-x-2 gap-y-2.5 md:gap-y-3">
          {benefits.map((benefit, i) => (
            <li key={i} className="flex items-start gap-2 md:gap-3">
              <Check
                className={cn("size-4 md:size-5 mt-0.5 flex-shrink-0", style.check)}
              />
              <span className="text-white/80 text-xs md:text-base leading-tight">
                {benefit.text}
                {benefit.addon && (
                  <span className="text-white/40 ml-0.5">({benefit.addon})</span>
                )}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="mt-auto pt-6 md:pt-8">
          <div
            className={cn(
              "w-full text-center text-sm md:text-base font-medium py-3 px-6 rounded-xl",
              "bg-white/[0.03] border backdrop-blur-sm cursor-not-allowed",
              "transition-colors duration-200",
              style.cta
            )}
          >
            {ctaLabel}
          </div>
        </div>
      </div>
    </div>
  );
}
