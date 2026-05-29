"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Speaker } from "@/app/messages/2026/speakers";
import SpeakerCard from "./SpeakerCard";
import type { SpeakerLabels } from "./labels";

type Props = {
  speakers: Speaker[];
  labels: SpeakerLabels;
};

const NAV_BUTTON_CLASS =
  "hidden md:flex absolute top-1/2 -translate-y-1/2 size-14 items-center justify-center rounded-full bg-[#1b1635] border border-white/15 text-white shadow-xl shadow-black/50 transition-all duration-200 hover:bg-[#262049] hover:border-white/25 active:scale-95 disabled:opacity-0 disabled:pointer-events-none z-20";

export default function SpeakersCarousel({ speakers, labels }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const [active, setActive] = useState(0);
  const [metrics, setMetrics] = useState({ step: 0, max: 0 });
  // 슬라이드 이동 시에만 애니메이션 (리사이즈 시에는 즉시 반영)
  const [animate, setAnimate] = useState(false);

  // 한 칸(카드 + gap) 너비와 최대 이동 거리 측정
  const measure = useCallback(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport || track.children.length < 1) {
      return { step: 0, max: 0 };
    }
    const first = track.children[0] as HTMLElement;
    const second = track.children[1] as HTMLElement | undefined;
    const step = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
    const max = Math.max(0, track.scrollWidth - viewport.clientWidth);
    return { step, max };
  }, []);

  // 마운트 / 리사이즈 시 측정 (리사이즈는 애니메이션 없이 즉시 반영)
  useEffect(() => {
    const update = () => {
      setAnimate(false);
      setMetrics(measure());
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [measure]);

  const { step, max } = metrics;
  // 실제 이동 가능한 위치(=도트) 수. 데스크톱 2장 노출이면 마지막 위치까지 1장씩.
  const positions =
    step > 0
      ? Math.min(speakers.length, Math.round(max / step) + 1)
      : speakers.length;
  const maxIndex = positions - 1;

  const goTo = useCallback(
    (index: number) => {
      setAnimate(true);
      setActive(Math.max(0, Math.min(maxIndex, index)));
    },
    [maxIndex]
  );

  // 모바일 스와이프
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta < -50) goTo(active + 1);
    else if (delta > 50) goTo(active - 1);
    touchStartX.current = null;
  };

  // 끝을 넘어가지 않도록 clamp (렌더 시점의 active/metrics에서 직접 파생)
  const offset = Math.min(active * step, max);
  const atStart = active <= 0;
  const atEnd = active >= maxIndex;

  return (
    <div className="relative">
      <div
        ref={viewportRef}
        className="overflow-hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label="Speakers"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          ref={trackRef}
          className={cn(
            "flex gap-4 md:gap-5 lg:gap-6",
            animate && "transition-transform duration-500 ease-out"
          )}
          style={{ transform: `translateX(-${offset}px)` }}
        >
          {speakers.map((speaker, i) => (
            <div
              key={speaker.slug}
              className="shrink-0 w-full lg:w-[calc(50%-0.75rem)]"
              onFocus={() => goTo(i)}
            >
              <SpeakerCard speaker={speaker} labels={labels} />
            </div>
          ))}
        </div>
      </div>

      {/* 좌우 버튼 (데스크톱) */}
      <button
        type="button"
        aria-label="Previous"
        onClick={() => goTo(active - 1)}
        disabled={atStart}
        className={cn(NAV_BUTTON_CLASS, "left-0 -translate-x-1/2")}
      >
        <ChevronLeft className="size-7 text-[#F8C8FF]" />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={() => goTo(active + 1)}
        disabled={atEnd}
        className={cn(NAV_BUTTON_CLASS, "right-0 translate-x-1/2")}
      >
        <ChevronRight className="size-7 text-[#F8C8FF]" />
      </button>

      {/* 도트 인디케이터 (이동 가능한 위치별) */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {Array.from({ length: positions }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === active}
            onClick={() => goTo(i)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === active
                ? "w-6 bg-[#F8C8FF]"
                : "w-2 bg-white/25 hover:bg-white/40"
            )}
          />
        ))}
      </div>
    </div>
  );
}
