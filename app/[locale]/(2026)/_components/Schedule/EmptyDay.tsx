import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

type Props = {
  title: string;
  subtitle: string;
  ctaLabel: string;
};

export default function EmptyDay({ title, subtitle, ctaLabel }: Props) {
  return (
    <div className="py-16 md:py-24 text-center">
      <div
        aria-hidden
        className="font-[family-name:var(--font-ubuntu-mono)] font-extrabold leading-none
                   text-white/[0.06] text-7xl md:text-9xl tracking-tighter mb-8 select-none"
      >
        TBA
      </div>

      <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
        {title}
      </h3>

      <p className="text-sm md:text-base text-white/55 max-w-md mx-auto mb-10 leading-relaxed px-4">
        {subtitle}
      </p>

      <Link
        href="/speakers"
        className="group inline-flex items-center gap-2
                   font-[family-name:var(--font-ubuntu-mono)] uppercase tracking-[0.2em] text-xs md:text-sm
                   text-white/85 hover:text-white transition-colors duration-200
                   border-b border-white/25 hover:border-white/70 pb-1"
      >
        <span>{ctaLabel}</span>
        <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
