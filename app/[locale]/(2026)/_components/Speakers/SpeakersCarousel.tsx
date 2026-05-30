"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Speaker } from "@/app/messages/2026/speakers";
import SpeakerCard from "./SpeakerCard";
import type { SpeakerLabels } from "./labels";

type Props = {
  speakers: Speaker[];
  labels: SpeakerLabels;
};

const NAV_BUTTON_CLASS =
  "hidden md:flex absolute top-1/2 -translate-y-1/2 size-14 items-center justify-center rounded-full bg-nav-surface border border-white/15 text-white shadow-xl shadow-black/50 transition-all duration-200 hover:bg-nav-surface-hover hover:border-white/25 active:scale-95 disabled:opacity-0 disabled:pointer-events-none z-20";

export default function SpeakersCarousel({ speakers, labels }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const [active, setActive] = useState(0);
  // step: 한 칸(카드 + gap) 너비, max: 최대 이동 거리, perView: 동시에 보이는 카드 수
  const [metrics, setMetrics] = useState({ step: 0, max: 0, perView: 1 });
  // 슬라이드 이동 시에만 애니메이션 (리사이즈 시에는 즉시 반영)
  const [animate, setAnimate] = useState(false);

  const measure = useCallback(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport || track.children.length < 1) {
      return { step: 0, max: 0, perView: 1 };
    }
    const first = track.children[0] as HTMLElement;
    const second = track.children[1] as HTMLElement | undefined;
    const step = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
    const max = Math.max(0, track.scrollWidth - viewport.clientWidth);
    // 보이는 카드 수를 뷰포트/스텝 비율로 직접 계산 (round(max/step) 추정으로 인한 도트 오차 방지)
    const perView =
      step > 0 ? Math.max(1, Math.round(viewport.clientWidth / step)) : 1;
    return { step, max, perView };
  }, []);

  // 레이아웃 변화(리사이즈·폰트/이미지 로드로 인한 리플로우 등)를 ResizeObserver로 감지.
  // rAF로 이벤트를 합치고, 값이 실제로 바뀔 때만 상태를 갱신한다.
  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport) return;

    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setAnimate(false);
        const next = measure();
        setMetrics((prev) =>
          prev.step === next.step &&
          prev.max === next.max &&
          prev.perView === next.perView
            ? prev
            : next
        );
      });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(viewport);
    if (track) ro.observe(track);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [measure]);

  const { step, max, perView } = metrics;
  const measured = step > 0;
  // 한 번에 한 장씩 이동하므로 위치(도트) 수 = 전체 - 동시 노출 수 + 1
  const positions = measured
    ? Math.max(1, speakers.length - perView + 1)
    : speakers.length;
  const maxIndex = positions - 1;

  // 레이아웃 변화로 위치 수가 줄어들면 active를 범위 안으로 다시 clamp
  useEffect(() => {
    setActive((a) => Math.min(a, maxIndex));
  }, [maxIndex]);

  const goTo = useCallback(
    (index: number) => {
      setAnimate(true);
      setActive(Math.max(0, Math.min(maxIndex, index)));
    },
    [maxIndex]
  );

  // 모바일 스와이프: 세로 스크롤과 구분하기 위해 가로 이동이 더 크고 50px 이상일 때만 반응
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < 50 || Math.abs(dx) <= Math.abs(dy)) return;
    if (dx < 0) goTo(active + 1);
    else goTo(active - 1);
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
        aria-label={labels.carousel}
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
          {speakers.map((speaker, i) => {
            // 현재 화면에 보이는 카드만 포커스/스크린리더에 노출
            const visible =
              !measured || (i >= active && i < active + perView);
            return (
              <div
                key={speaker.slug}
                className="shrink-0 w-full lg:w-[calc(50%-0.75rem)]"
                inert={!visible}
                aria-hidden={!visible}
              >
                <SpeakerCard speaker={speaker} labels={labels} />
              </div>
            );
          })}
        </div>
      </div>

      {/* 좌우 버튼 (데스크톱) */}
      <button
        type="button"
        aria-label={labels.prev}
        onClick={() => goTo(active - 1)}
        disabled={atStart}
        className={cn(NAV_BUTTON_CLASS, "left-0 -translate-x-1/2")}
      >
        <ChevronLeft className="size-7 text-glow-pink-soft" />
      </button>
      {/* 마지막 장에서는 다음 버튼이 전체 연사 목록으로 이동 */}
      {atEnd ? (
        <Link
          href="/speakers"
          aria-label={labels.viewAll}
          className={cn(NAV_BUTTON_CLASS, "right-0 translate-x-1/2")}
        >
          <ChevronRight className="size-7 text-glow-pink-soft" />
        </Link>
      ) : (
        <button
          type="button"
          aria-label={labels.next}
          onClick={() => goTo(active + 1)}
          className={cn(NAV_BUTTON_CLASS, "right-0 translate-x-1/2")}
        >
          <ChevronRight className="size-7 text-glow-pink-soft" />
        </button>
      )}

      {/* 도트 인디케이터 (측정 완료 후, 이동 가능한 위치별) */}
      {measured && positions > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {Array.from({ length: positions }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`${labels.slide} ${i + 1}`}
              aria-current={i === active}
              onClick={() => goTo(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === active
                  ? "w-6 bg-glow-pink-soft"
                  : "w-2 bg-white/25 hover:bg-white/40"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
