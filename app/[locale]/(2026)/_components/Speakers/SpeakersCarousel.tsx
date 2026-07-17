"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  "hidden md:flex absolute top-1/2 -translate-y-1/2 size-16 items-center justify-center rounded-full bg-nav-surface border border-white/15 text-white shadow-xl shadow-black/50 transition-all duration-200 hover:bg-nav-surface-hover hover:border-white/25 active:scale-95 disabled:opacity-0 disabled:pointer-events-none z-20";

// lg부터 2×2로 4장씩, 그 아래는 1장씩 넘긴다. 카드가 가로로 읽히는 순서를 지키려면
// 한 열씩이 아니라 페이지 단위로 넘겨야 해서, 페이지 크기를 JS로 정한다.
const LG_QUERY = "(min-width: 1024px)";
const PER_PAGE_DESKTOP = 4;
const PER_PAGE_MOBILE = 1;
// 모바일은 1장씩이라 전원을 다 넣으면 도트가 너무 많아진다. 앞 8명만 보여주고
// 나머지는 "모든 연사 보기"로 넘긴다.
const MOBILE_LIMIT = 8;

function chunk<T>(items: T[], size: number): T[][] {
  const pages = Array.from({ length: Math.ceil(items.length / size) }, (_, i) =>
    items.slice(i * size, i * size + size),
  );
  // 연사 수가 페이지 크기로 나누어떨어지지 않으면 마지막 페이지가 비어 보인다.
  // 앞쪽 연사를 다시 끌어와 칸을 채운다. 단 전체가 한 페이지도 못 채우는 경우엔
  // 같은 페이지에 같은 연사가 중복되므로 그대로 둔다.
  const last = pages.at(-1);
  if (last && last.length < size && items.length >= size) {
    last.push(...items.slice(0, size - last.length));
  }
  return pages;
}

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
  // step: 한 페이지(+gap) 너비, max: 최대 이동 거리
  const [metrics, setMetrics] = useState({ step: 0, max: 0 });
  // 슬라이드 이동 시에만 애니메이션 (리사이즈 시에는 즉시 반영)
  const [animate, setAnimate] = useState(false);
  // 서버/첫 렌더는 모바일 기준으로 두고, 마운트 후 실제 화면 폭에 맞춘다.
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(LG_QUERY);
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const pages = useMemo(() => {
    const list = isDesktop ? speakers : speakers.slice(0, MOBILE_LIMIT);
    return chunk(list, isDesktop ? PER_PAGE_DESKTOP : PER_PAGE_MOBILE);
  }, [speakers, isDesktop]);

  const measure = useCallback(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport || track.children.length < 1) {
      return { step: 0, max: 0 };
    }
    const first = track.children[0] as HTMLElement;
    const second = track.children[1] as HTMLElement | undefined;
    const step = second
      ? second.offsetLeft - first.offsetLeft
      : first.offsetWidth;
    const max = Math.max(0, track.scrollWidth - viewport.clientWidth);
    return { step, max };
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
          prev.step === next.step && prev.max === next.max ? prev : next,
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

  const { step, max } = metrics;
  const measured = step > 0;
  // 한 페이지가 뷰포트를 꽉 채우므로 위치(도트) 수 = 페이지 수
  const positions = pages.length;
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
    [maxIndex],
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
    const forward =
      moved <= -distanceThreshold || velocity <= -velocityThreshold;
    const backward =
      moved >= distanceThreshold || velocity >= velocityThreshold;

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
    <div>
      {/* 화살표의 top-1/2이 카드 영역 기준이 되도록, 도트는 이 relative 밖에 둔다.
          (도트까지 감싸면 기준 높이가 늘어나 화살표가 아래로 치우친다) */}
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
              animate && "transition-transform duration-500 ease-out",
            )}
            style={{ transform: `translateX(-${baseOffset}px)` }}
          >
            {pages.map((page, p) => {
              // 현재 페이지의 카드만 포커스/스크린리더에 노출
              const visible = p === active;
              return (
                <div
                  key={page[0].slug}
                  // lg에서 행을 2개로 고정해야 카드가 4장 미만인 마지막 페이지에서도
                  // 카드가 세로로 늘어나지 않고 제 높이를 유지한다.
                  className="shrink-0 w-full grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-4 md:gap-5 lg:gap-6"
                  inert={!visible}
                  aria-hidden={!visible}
                >
                  {page.map((speaker) => (
                    <SpeakerCard
                      key={speaker.slug}
                      speaker={speaker}
                      labels={labels}
                    />
                  ))}
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
          className={cn(NAV_BUTTON_CLASS, "left-0 -translate-x-1/4")}
        >
          <ChevronLeft className="size-8 text-glow-pink-soft" />
        </button>
        {/* 마지막 장에서는 다음 버튼이 전체 연사 목록으로 이동 */}
        {atEnd ? (
          <Link
            href="/speakers"
            aria-label={labels.viewAll}
            className={cn(NAV_BUTTON_CLASS, "right-0 translate-x-1/4")}
          >
            <ChevronRight className="size-8 text-glow-pink-soft" />
          </Link>
        ) : (
          <button
            type="button"
            aria-label={labels.next}
            onClick={() => goTo(active + 1)}
            className={cn(NAV_BUTTON_CLASS, "right-0 translate-x-1/4")}
          >
            <ChevronRight className="size-8 text-glow-pink-soft" />
          </button>
        )}
      </div>

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
                  : "w-2 bg-white/25 hover:bg-white/40",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
