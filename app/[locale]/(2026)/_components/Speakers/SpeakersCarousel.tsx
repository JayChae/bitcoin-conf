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
  // 스와이프 속도(velocity) 계산용 시작 시각(ms)
  const touchStartTime = useRef(0);
  // 가로 스와이프로 확정된 제스처인지 (세로 스크롤과 구분)
  const horizontalSwipe = useRef(false);
  // 방금 스와이프했는지 — 스와이프 직후 합성되는 클릭이 카드 링크로
  // 잘못 이동하는 것을 막기 위한 플래그
  const didSwipe = useRef(false);
  // 드래그 중 손가락을 따라가는 추가 오프셋(px). 매 프레임 리렌더를 피하려고
  // state 대신 ref에 담고 트랙 transform을 직접 갱신한다.
  const dragRef = useRef(0);

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

  // 끝을 넘어가지 않도록 clamp한 기준 위치 (드래그 오프셋을 더하기 전)
  const baseOffset = Math.min(active * step, max);

  // 모바일 스와이프: 손가락을 따라 실시간으로 이동하고, 놓으면 가까운 칸으로 스냅.
  // touch-action: pan-y 로 세로 스크롤은 브라우저에 맡기고 가로 이동만 직접 처리한다.
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    touchStartTime.current = e.timeStamp;
    horizontalSwipe.current = false;
    didSwipe.current = false;
    setAnimate(false);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.touches[0].clientX - touchStart.current.x;
    const dy = e.touches[0].clientY - touchStart.current.y;
    // 아직 방향이 정해지지 않았으면 우세한 축으로 확정한다
    if (!horizontalSwipe.current) {
      // 세로 이동이 우세하면 이번 제스처는 캐러셀에서 손을 뗀다
      if (Math.abs(dy) > Math.abs(dx)) {
        touchStart.current = null;
        return;
      }
      // 가로 이동이 8px를 넘고 세로보다 클 때만 가로 스와이프로 확정
      if (Math.abs(dx) <= 8 || Math.abs(dx) <= Math.abs(dy)) return;
      horizontalSwipe.current = true;
    }
    // 양 끝에서는 저항을 주어 과한 끌림을 줄인다
    const resistance =
      (active <= 0 && dx > 0) || (active >= maxIndex && dx < 0) ? 0.3 : 1;
    dragRef.current = dx * resistance;
    // 가로 스와이프가 발생했으므로, 직후의 클릭은 무시하도록 표시
    didSwipe.current = true;
    // 리렌더 없이 손가락을 따라가도록 트랙 transform을 직접 갱신
    const track = trackRef.current;
    if (track) {
      track.style.transform = `translateX(-${baseOffset - dragRef.current}px)`;
    }
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    // dragRef는 가로 스와이프로 확정된 뒤에만 갱신되므로, moved가 0이 아니면
    // 이미 가로 제스처였다는 뜻이다.
    const moved = dragRef.current;
    dragRef.current = 0;
    touchStart.current = null;
    horizontalSwipe.current = false;
    if (!moved) return;

    // 끈 거리 또는 튕긴 속도 중 하나만 충족해도 다음/이전 칸으로 넘긴다.
    // 거리 임계값은 한 칸 너비의 1/5(빠르게 짧게 튕기는 제스처도 받도록 낮춤).
    const elapsed = Math.max(1, e.timeStamp - touchStartTime.current);
    const velocity = moved / elapsed; // px/ms
    const distanceThreshold = measured ? step / 5 : 50;
    const velocityThreshold = 0.4; // px/ms — 빠른 플릭 인식
    const forward = moved <= -distanceThreshold || velocity <= -velocityThreshold;
    const backward = moved >= distanceThreshold || velocity >= velocityThreshold;

    const next = forward
      ? Math.min(maxIndex, active + 1)
      : backward
        ? Math.max(0, active - 1)
        : active;

    // 스냅(또는 제자리 복귀)을 부드럽게 애니메이션한다.
    setAnimate(true);

    if (next !== active) {
      // 칸이 바뀌면 baseOffset이 달라져 React가 새 위치로 transform을 다시 쓰며
      // 슬라이드를 애니메이션한다. 슬라이드는 React에 맡긴다.
      setActive(next);
    } else {
      // 제자리 복귀: active가 그대로라 baseOffset이 안 바뀌어 React는 transform을
      // 다시 쓰지 않는다(드래그 중 DOM을 직접 건드려 손가락 위치에 멈춰 있는 상태).
      // 다음 프레임에 기준 위치로 직접 되돌려 복귀 애니메이션이 항상 동작하게 한다.
      requestAnimationFrame(() => {
        const track = trackRef.current;
        if (track) track.style.transform = `translateX(-${baseOffset}px)`;
      });
    }
  };

  // 스와이프 직후 브라우저가 합성하는 클릭이 카드 링크로 잘못 이동하는 것을 막는다.
  // capture 단계에서 가로채 링크의 onClick까지 전파되지 않게 한다.
  const onClickCapture = (e: React.MouseEvent) => {
    if (!didSwipe.current) return;
    e.preventDefault();
    e.stopPropagation();
    didSwipe.current = false;
  };

  const atStart = active <= 0;
  const atEnd = active >= maxIndex;

  return (
    <div className="relative">
      <div
        ref={viewportRef}
        className="overflow-hidden touch-pan-y"
        role="region"
        aria-roledescription="carousel"
        aria-label={labels.carousel}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClickCapture={onClickCapture}
      >
        <div
          ref={trackRef}
          className={cn(
            "flex gap-4 md:gap-5 lg:gap-6",
            animate && "transition-transform duration-500 ease-out"
          )}
          style={{ transform: `translateX(-${baseOffset}px)` }}
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
