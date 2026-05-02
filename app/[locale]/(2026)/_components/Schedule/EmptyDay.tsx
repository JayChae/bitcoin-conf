import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
};

export default function EmptyDay({ eyebrow, title, subtitle, ctaLabel }: Props) {
  return (
    <div className="relative rounded-3xl border border-dashed border-white/15 bg-white/[0.02] py-16 md:py-24 px-6 text-center overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-10 h-40 bg-gradient-to-b from-white/[0.04] to-transparent"
      />

      <p className="relative font-[family-name:var(--font-ubuntu-mono)] uppercase tracking-[0.3em] text-[10px] md:text-xs text-white/55 mb-6">
        {eyebrow}
      </p>

      <div
        aria-hidden
        className="relative font-[family-name:var(--font-ubuntu-mono)] font-extrabold leading-none
                   text-7xl md:text-9xl tracking-tighter mb-8 select-none
                   bg-gradient-to-br from-[#C8A0FF]/55 to-[#F490FF]/45 bg-clip-text text-transparent"
      >
        TBA
      </div>

      <h3 className="relative text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
        {title}
      </h3>

      <p className="relative text-sm md:text-base text-white/60 max-w-md mx-auto mb-10 leading-relaxed">
        {subtitle}
      </p>

      <Link
        href="/speakers"
        className="group relative inline-flex items-center gap-2
                   font-[family-name:var(--font-ubuntu-mono)] uppercase tracking-[0.2em] text-xs md:text-sm
                   text-white/85 hover:text-white transition-colors duration-200
                   border-b border-white/30 hover:border-white/80 pb-1"
      >
        <span>{ctaLabel}</span>
        <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
