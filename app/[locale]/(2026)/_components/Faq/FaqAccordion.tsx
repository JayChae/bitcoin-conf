"use client";

import { Fragment, useId, useState, type ElementType } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { FaqCta, FaqItem } from "@/app/messages/2026/faq";

type Props = {
  items: FaqItem[];
};

// 본문에 섞인 이메일 주소를 mailto 링크로 바꿔준다. 이메일은 형태가 명확해
// 자동 링크로 처리해도 오탐 위험이 낮다.
const EMAIL_RE = /([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/i;

function withEmailLinks(text: string) {
  // 캡처 그룹으로 split 하면 결과가 [텍스트, 이메일, 텍스트, ...] 로 번갈아
  // 나오므로, 홀수 인덱스만 mailto 링크로 감싼다.
  return text.split(EMAIL_RE).map((part, i) =>
    i % 2 === 1 ? (
      <a
        key={i}
        href={`mailto:${part}`}
        className="font-medium text-glow-pink-soft underline decoration-glow-pink-soft/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60"
      >
        {part}
      </a>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}

function CtaLink({ cta }: { cta: FaqCta }) {
  // 외부 링크(http/mailto)는 평범한 <a>, 내부 경로는 i18n Link 로 렌더한다.
  const isExternal = /^(https?:|mailto:)/.test(cta.href);
  const Tag: ElementType = isExternal ? "a" : Link;

  return (
    <Tag
      href={cta.href}
      className="group/cta mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-glow-pink-soft transition-colors hover:text-white"
    >
      <span>{cta.label}</span>
      <ArrowUpRight className="size-4 transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
    </Tag>
  );
}

function ToggleIcon({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative grid size-8 shrink-0 place-items-center rounded-full border transition-colors duration-200",
        open
          ? "border-glow-pink/50 bg-glow-pink/10"
          : "border-white/15 bg-white/[0.04] group-hover:border-white/30"
      )}
    >
      {/* 가로 막대는 고정, 세로 막대만 회전시켜 +/− 로 부드럽게 전환한다. */}
      <span className="absolute h-px w-3.5 rounded-full bg-current text-white/80" />
      <span
        className={cn(
          "absolute h-3.5 w-px rounded-full bg-current text-white/80 transition-transform duration-300 ease-out",
          open && "rotate-90"
        )}
      />
    </span>
  );
}

export default function FaqAccordion({ items }: Props) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const baseId = useId();

  const toggle = (index: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  return (
    <div className="mx-auto max-w-3xl space-y-3 px-4 md:space-y-4">
      {items.map((item, index) => {
        const isOpen = open.has(index);
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <div
            key={index}
            className={cn(
              "group overflow-hidden rounded-2xl border backdrop-blur-2xl transition-colors duration-300",
              isOpen
                ? "border-glow-purple/40 bg-[#171334]/85"
                : "border-white/10 bg-[#15122a]/70 hover:border-white/20"
            )}
          >
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                className="flex w-full items-center gap-4 px-5 py-5 text-left md:px-7 md:py-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-glow-purple/50 focus-visible:ring-inset"
              >
                <span className="mt-0.5 shrink-0 font-[family-name:var(--font-ubuntu-mono)] text-sm font-semibold tabular-nums text-glow-pink-soft/70 md:text-base">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-base font-semibold leading-snug text-white md:text-lg">
                  {item.question}
                </span>
                <ToggleIcon open={isOpen} />
              </button>
            </h3>

            {/* grid-rows 0fr→1fr 로 측정 없이 부드럽게 높이를 애니메이션한다. */}
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  inert={!isOpen}
                  className="px-5 pb-6 pl-[calc(1.25rem+1.75rem)] md:px-7 md:pb-7 md:pl-[calc(1.75rem+2rem)]"
                >
                  <div className="space-y-3 text-sm leading-relaxed text-white/70 md:text-base">
                    {item.answer.map((paragraph, i) => (
                      <p key={i}>{withEmailLinks(paragraph)}</p>
                    ))}
                  </div>
                  {item.cta && <CtaLink cta={item.cta} />}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
