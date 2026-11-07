"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight, MapPin, X } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { venueMapUrl } from "@/app/messages/2026/venues";

// Day 1 당일에만 띄운다 — 8일(Day 2, 명동)에 코엑스 안내가 뜨면 오히려 헷갈린다.
const SHOW_UNTIL = Date.parse("2026-11-08T00:00:00+09:00");
// 세션당 한 번만. 닫은 뒤에도 장소 섹션·일정 페이지에 같은 정보가 있다.
const DISMISS_KEY = "bkc-venue-notice-2026-11-07";

export default function VenueNoticeModal() {
  const t = useTranslations("VenueNotice2026");
  const locale = useLocale() as Locale;
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (Date.now() >= SHOW_UNTIL) return;
    try {
      if (sessionStorage.getItem(DISMISS_KEY)) return;
    } catch {
      // 스토리지 접근이 막힌 브라우저에서도 안내는 띄운다.
    }
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {}
  }, []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="venue-notice-title"
        aria-describedby="venue-notice-body"
        className="relative w-full max-w-md rounded-2xl bg-[#14111f] border border-white/10 px-6 pt-7 pb-6 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label={t("closeLabel")}
          className="absolute top-3 right-3 p-2 text-white/50 hover:text-white transition-colors"
        >
          <X className="size-5" aria-hidden />
        </button>

        <p className="font-[family-name:var(--font-ubuntu-mono)] uppercase tracking-[0.2em] text-xs text-[#C8A0FF]">
          {t("eyebrow")}
        </p>
        <h2
          id="venue-notice-title"
          className="mt-3 text-3xl font-extrabold leading-tight"
        >
          {t("title")}
        </h2>
        <p
          id="venue-notice-body"
          className="mt-3 text-base leading-relaxed text-white/80"
        >
          {t("body")}
        </p>
        <div className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-white/60">
          <MapPin className="size-4 mt-0.5 flex-shrink-0 text-white/40" aria-hidden />
          <span>{t("address")}</span>
        </div>

        <div className="mt-7 flex flex-col gap-2">
          <a
            href={venueMapUrl("coex", locale)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#8C50C8] hover:bg-[#9C62D6] px-5 py-3.5 text-base font-semibold transition-colors"
          >
            <span>{t("mapCta")}</span>
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            className="rounded-xl px-5 py-3 text-base text-white/70 hover:text-white transition-colors"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
}
