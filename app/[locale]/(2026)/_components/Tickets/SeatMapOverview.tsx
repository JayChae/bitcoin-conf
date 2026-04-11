"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { X, Map } from "lucide-react";
import dynamic from "next/dynamic";

const PdfViewer = dynamic(() => import("./SeatMapPdfViewer"), { ssr: false });

export default function SeatMapOverview() {
  const t = useTranslations("Tickets2026");
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  // Lock body scroll + ESC to close when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("keydown", onKeyDown);
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", onKeyDown);
      };
    }
  }, [open]);

  return (
    <>
      {/* Compact button trigger */}
      <button
        type="button"
        onClick={handleOpen}
        className="mb-3 flex w-full sm:w-auto sm:mx-auto items-center justify-center gap-2 rounded-full bg-white/10 border border-white/10 px-5 py-3 sm:px-4 sm:py-2 text-base sm:text-sm text-white/80 hover:bg-white/15 hover:border-white/20 transition-all cursor-pointer"
      >
        <Map className="size-4" />
        {t("seatMap")}
      </button>

      {/* Fullscreen PDF modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={handleClose}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="size-6" />
          </button>

          {/* PDF Viewer */}
          <div
            className="relative w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <PdfViewer />
          </div>
        </div>
      )}
    </>
  );
}
