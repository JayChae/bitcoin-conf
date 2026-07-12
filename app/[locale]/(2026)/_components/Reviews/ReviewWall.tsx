"use client";

import { useMemo, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { REVIEW_SHOTS } from "@/app/messages/2026/reviews";
import type { ReviewLabels } from "./labels";
import ReviewCard from "./ReviewCard";

type Props = {
  labels: ReviewLabels;
  onOpen: (index: number) => void;
  paused: boolean;
};

// 벽의 열 수만큼은 CSS 로 못 줄인다: 열을 display:none 으로 감추면 라운드로빈으로
// 그 열에 배분된 후기가 통째로 사라진다. 그래서 실제 뷰포트가 몇 열인지 JS 로 읽고
// 전량 재분배한다. 값은 Tailwind 의 sm/lg 와 동일.
const COLUMN_BREAKPOINTS = [
  { query: "(min-width: 1024px)", columns: 3 },
  { query: "(min-width: 640px)", columns: 2 },
];
const MOBILE_COLUMNS = 1;

// 열마다 다른 속도 → 살아있는 벽. 항목당 초로 잡아야 열 길이가 달라져도(모바일 1열에
// 17장이 몰림) 스크롤 속도가 일정하다. 홀수 열은 reverse 로 교대 방향.
// 열 수가 늘어도 조용히 NaN 이 되지 않도록 순환시켜 쓴다.
const SECONDS_PER_SHOT = [10, 12.5, 11];

// 실제 렌더 폭에 맞춘 sizes — 1/2/3 열.
const WALL_SIZES =
  "(min-width: 1280px) 405px, (min-width: 1024px) 31vw, (min-width: 640px) 47vw, calc(100vw - 2rem)";

// MediaQueryList 는 렌더마다 새로 열지 않고 한 번만 만든다 — getSnapshot 은 렌더마다 불린다.
let mediaQueries: { mql: MediaQueryList; columns: number }[] | null = null;
const getMediaQueries = () =>
  (mediaQueries ??= COLUMN_BREAKPOINTS.map(({ query, columns }) => ({
    mql: window.matchMedia(query),
    columns,
  })));

const subscribeToBreakpoints = (onChange: () => void) => {
  const queries = getMediaQueries();
  queries.forEach(({ mql }) => mql.addEventListener("change", onChange));
  return () =>
    queries.forEach(({ mql }) => mql.removeEventListener("change", onChange));
};

const readColumnCount = () =>
  getMediaQueries().find(({ mql }) => mql.matches)?.columns ?? MOBILE_COLUMNS;

// SSR 스냅샷은 모바일 1열 (mobile first) — 하이드레이션 후 넓은 화면에서 정정된다.
const useColumnCount = () =>
  useSyncExternalStore(
    subscribeToBreakpoints,
    readColumnCount,
    () => MOBILE_COLUMNS
  );

export default function ReviewWall({ labels, onOpen, paused }: Props) {
  const columnCount = useColumnCount();

  // 보이는 열 수만큼 라운드로빈 분배 — 어떤 뷰포트에서도 17장이 모두 실린다.
  // 라이트박스가 원본을 찾을 수 있도록 전역 인덱스를 함께 들고 다닌다.
  const columns = useMemo(
    () =>
      Array.from({ length: columnCount }, (_, c) =>
        REVIEW_SHOTS.map((shot, index) => ({ shot, index })).filter(
          (_, i) => i % columnCount === c
        )
      ),
    [columnCount]
  );

  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
    >
      {columns.map((col, c) => (
        <div
          key={c}
          className={cn(
            "marquee-y min-w-0 [--wall-h:640px] sm:[--wall-h:680px] lg:[--wall-h:760px]",
            paused && "marquee-y-paused"
          )}
        >
          {/* 각 열을 두 번 렌더해 translateY(-50%) 로 무한 루프 */}
          <ul
            className={cn(
              // gap 금지: 세트 높이가 정확히 50% 여야 이음매가 안 튄다 → 항목 pb-* 로 간격.
              "animate-marquee-y flex flex-col",
              c % 2 === 1 && "[animation-direction:reverse]"
            )}
            style={
              {
                "--marquee-duration": `${
                  col.length * SECONDS_PER_SHOT[c % SECONDS_PER_SHOT.length]
                }s`,
              } as React.CSSProperties
            }
          >
            {[...col, ...col].map(({ shot, index }, i) => {
              // 뒤쪽 절반은 루프용 중복본 — 스크린리더에서 숨기고 탭 순서에서 뺀다.
              const dup = i >= col.length;
              return (
                <li key={i} className={cn("pb-4", dup && "marquee-dup")}>
                  <ReviewCard
                    shot={shot}
                    index={index}
                    onOpen={onOpen}
                    openLabel={labels.openReview}
                    altPrefix={labels.shotAlt}
                    sizes={WALL_SIZES}
                    decorative={dup}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
