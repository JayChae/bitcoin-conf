"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { X, ZoomIn } from "lucide-react";

export default function SeatMapOverview() {
  const t = useTranslations("Tickets2026");
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <>
      {/* Card preview */}
      <button
        type="button"
        onClick={handleOpen}
        className="group relative w-full rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 overflow-hidden cursor-pointer transition-all hover:border-white/20"
      >
        <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full">
          <Image
            src="/2026/seat-map.webp"
            alt={t("seatMap")}
            fill
            className="object-contain p-2 sm:p-4"
            sizes="(max-width: 768px) 100vw, 896px"
            priority
          />
        </div>

        {/* Overlay hint */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
          <span className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white/80 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="size-3.5" />
            {t("tapToExpand")}
          </span>
        </div>

        {/* Title bar */}
        <div className="px-4 py-3 border-t border-white/5">
          <span className="text-sm font-medium text-white/70">
            {t("seatMap")}
          </span>
        </div>
      </button>

      {/* Fullscreen overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={handleClose}
        >
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="size-6" />
          </button>

          <div
            className="relative w-[95vw] h-[85vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src="/2026/seat-map.webp"
              alt={t("seatMap")}
              fill
              className="object-contain"
              sizes="95vw"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
