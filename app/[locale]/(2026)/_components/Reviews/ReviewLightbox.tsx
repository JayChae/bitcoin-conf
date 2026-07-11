"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { openModal } from "@/app/_utils/modal";
import type { Shot } from "@/app/messages/2026/reviews";

type Props = {
  shots: Shot[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  altPrefix: string;
  closeLabel: string;
  prevLabel: string;
  nextLabel: string;
};

const CTRL_CLASS =
  "z-10 grid place-items-center rounded-full border border-white/15 bg-black/60 text-white transition-colors hover:bg-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-glow-purple/50";

export default function ReviewLightbox({
  shots,
  index,
  onClose,
  onPrev,
  onNext,
  altPrefix,
  closeLabel,
  prevLabel,
  nextLabel,
}: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const shot = shots[index];

  // 스크롤 락 · ESC · 포커스 트랩/복원은 공용 openModal 이 담당하고,
  // 라이트박스 고유의 좌우 화살표 내비게이션만 여기서 얹는다.
  useEffect(
    () =>
      openModal(onClose, {
        container: dialogRef.current,
        onKeyDown: (e) => {
          if (e.key === "ArrowLeft") onPrev();
          else if (e.key === "ArrowRight") onNext();
        },
      }),
    [onClose, onPrev, onNext]
  );

  // 단일 포인터 가로 드래그만 스와이프로 처리 → 네이티브 핀치줌을 방해하지 않는다.
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.isPrimary) startX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (startX.current == null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 50) (dx < 0 ? onNext : onPrev)();
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${altPrefix} ${index + 1}`}
      tabIndex={-1}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 outline-none animate-in fade-in duration-200"
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

      <span
        aria-live="polite"
        className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-sm font-medium text-white/80"
      >
        {index + 1} / {shots.length}
      </span>

      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className={cn(CTRL_CLASS, "absolute right-4 top-4 size-11")}
      >
        <X className="size-5" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label={prevLabel}
        className={cn(
          CTRL_CLASS,
          "absolute left-2 top-1/2 size-11 -translate-y-1/2 sm:left-4 sm:size-14"
        )}
      >
        <ChevronLeft className="size-6" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label={nextLabel}
        className={cn(
          CTRL_CLASS,
          "absolute right-2 top-1/2 size-11 -translate-y-1/2 sm:right-4 sm:size-14"
        )}
      >
        <ChevronRight className="size-6" />
      </button>

      {/* next/image 로 카드와 같은 최적화본(WebP)을 재사용한다 — 원본 JPEG 를 다시 받지 않는다.
          key 를 주지 않아야 넘길 때 엘리먼트가 유지돼 다음 장이 디코드될 때까지 빈 프레임이 안 뜬다. */}
      <Image
        src={shot.src}
        alt={`${altPrefix} ${index + 1}`}
        width={shot.width}
        height={shot.height}
        sizes="92vw"
        quality={82}
        priority
        draggable={false}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        className="relative z-[1] h-auto max-h-[85dvh] w-auto max-w-[92vw] select-none rounded-lg object-contain [touch-action:pinch-zoom]"
      />
    </div>
  );
}
