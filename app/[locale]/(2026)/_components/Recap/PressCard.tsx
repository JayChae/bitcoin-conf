import { ArrowUpRight, Newspaper } from "lucide-react";
import type { PressArticle } from "@/app/messages/2026/press";
import { EYEBROW_CLASS } from "../Speakers/InfoField";

type Props = {
  article: PressArticle;
  ctaLabel: string;
};

export default function PressCard({ article, ctaLabel }: Props) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl
        bg-[#15122a]/90 backdrop-blur-2xl
        border border-white/10 hover:border-white/25
        transition-all duration-300
        sm:hover:-translate-y-0.5
        flex flex-col h-full p-5 sm:p-6 md:p-7"
    >
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={article.headline}
        className="absolute inset-0 z-10 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-glow-purple/50"
      />

      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute -top-3 right-4 -z-10 font-serif text-8xl leading-none text-glow-purple/20"
      >
        “
      </span>

      <div className="flex items-center gap-2">
        <Newspaper aria-hidden="true" className="size-3.5 text-white/40" />
        <span className={EYEBROW_CLASS}>
          {article.outlet} · {article.date}
        </span>
      </div>

      <h3 className="mt-3 text-lg md:text-xl font-bold text-white leading-snug">
        {article.headline}
      </h3>

      {article.quote ? (
        <blockquote className="mt-3 border-l-2 border-glow-pink/50 pl-3 text-sm text-white/75 leading-relaxed">
          “{article.quote}”
          {article.quoteAttribution && (
            <footer className="mt-1.5 text-xs text-white/45">
              {article.quoteAttribution}
            </footer>
          )}
        </blockquote>
      ) : article.excerpt ? (
        <p className="mt-3 text-sm text-white/70 leading-relaxed line-clamp-3">
          {article.excerpt}
        </p>
      ) : null}

      <div className="mt-auto flex justify-end items-center gap-1.5 pt-4">
        <span className="text-sm font-medium text-[#F8C8FF] group-hover:text-white transition-colors">
          {ctaLabel}
        </span>
        <ArrowUpRight className="size-4 text-[#F8C8FF] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </div>
    </div>
  );
}
