"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Plus, Minus, RotateCcw } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const SCALE_STEP = 0.3;

export default function SeatMapPdfViewer() {
  const [scale, setScale] = useState(1);
  const [pageWidth, setPageWidth] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const pinchRef = useRef<{
    initialDistance: number;
    initialScale: number;
  } | null>(null);
  const scaleRef = useRef(scale);
  scaleRef.current = scale;

  const handleLoadSuccess = useCallback(() => {
    setLoading(false);
  }, []);

  const zoomIn = useCallback(() => {
    setScale((s) => Math.min(MAX_SCALE, s + SCALE_STEP));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((s) => Math.max(MIN_SCALE, s - SCALE_STEP));
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1);
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, []);

  // Fit PDF width to container — fill the screen on mobile, cap on desktop
  const handlePageLoadSuccess = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 16;
      setPageWidth(Math.min(containerWidth, 800));
    }
  }, []);

  // Pinch-to-zoom via native event listeners (non-passive to allow preventDefault)
  const getDistance = (touches: TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        pinchRef.current = {
          initialDistance: getDistance(e.touches),
          initialScale: scaleRef.current,
        };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && pinchRef.current) {
        e.preventDefault();
        const currentDistance = getDistance(e.touches);
        const ratio = currentDistance / pinchRef.current.initialDistance;
        const newScale = Math.min(
          MAX_SCALE,
          Math.max(MIN_SCALE, pinchRef.current.initialScale * ratio),
        );
        setScale(newScale);
      }
    };

    const onTouchEnd = () => {
      pinchRef.current = null;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Zoom controls */}
      <div className="flex items-center justify-center gap-2 py-3 shrink-0">
        <button
          type="button"
          onClick={zoomOut}
          disabled={scale <= MIN_SCALE}
          className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <Minus className="size-4" />
        </button>
        <span className="text-white/60 text-sm w-16 text-center tabular-nums">
          {Math.round(scale * 100)}%
        </span>
        <button
          type="button"
          onClick={zoomIn}
          disabled={scale >= MAX_SCALE}
          className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <Plus className="size-4" />
        </button>
        <button
          type="button"
          onClick={resetZoom}
          className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors cursor-pointer ml-1"
        >
          <RotateCcw className="size-4" />
        </button>
      </div>

      {/* PDF container */}
      <div ref={containerRef} className="relative flex-1 overflow-auto">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="size-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
          </div>
        )}

        <Document
          file="/2026/seat-map.pdf"
          onLoadSuccess={handleLoadSuccess}
          loading={null}
          className="flex items-center justify-center min-h-full p-2"
        >
          <Page
            pageNumber={1}
            scale={scale}
            width={pageWidth}
            onLoadSuccess={handlePageLoadSuccess}
            className="shadow-2xl [&_canvas]:rounded-lg"
          />
        </Document>
      </div>
    </div>
  );
}
