import { Check, IdCard } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  tierLabel: string;
  freeLabel: string;
  description: string;
  benefits: { text: string }[];
  notice?: string;
};

export default function StudentTicketCard({
  tierLabel,
  freeLabel,
  description,
  benefits,
  notice,
}: Props) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl overflow-hidden h-full",
        "bg-[#15122a]/90 backdrop-blur-2xl border border-white/10",
        "transition-all duration-250 ease-out hover:-translate-y-1 hover:border-white/15",
      )}
    >
      <div className="flex flex-col flex-grow p-6 md:p-10">
        {/* Header: tier */}
        <div className="flex items-center justify-between mb-8 md:mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-white">
            {tierLabel}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm text-white/60 mb-4">{description}</p>

        {/* Price — spacer matches strikethrough line in other cards */}
        <div className="mb-8 md:mb-20">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              {freeLabel}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-6 md:mb-8" />

        {/* Benefits */}
        <ul className="grid grid-cols-1 gap-y-3 md:gap-y-3.5">
          {benefits.map((benefit, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <Check className="size-4 mt-0.5 flex-shrink-0 text-white/50" />
              <span className="text-sm text-white/80 leading-tight">
                {benefit.text}
              </span>
            </li>
          ))}
          {notice && (
            <li className="flex items-start gap-2.5">
              <IdCard className="size-4 mt-0.5 flex-shrink-0 text-white/50" />
              <span className="text-sm text-white/80 leading-tight">
                {notice}
              </span>
            </li>
          )}
        </ul>

        {/* CTA */}
        <div className="mt-auto pt-8 md:pt-10">
          <button
            disabled
            className={cn(
              "w-full flex items-center justify-center",
              "text-sm font-semibold py-3.5 px-6 rounded-full",
              "bg-white/10 text-white/40 border border-white/15",
              "cursor-not-allowed",
            )}
          >
            준비중
          </button>
        </div>
      </div>
    </div>
  );
}
