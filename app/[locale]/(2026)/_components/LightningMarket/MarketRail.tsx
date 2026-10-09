"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { MONO_CLASS } from "../Schedule/styles";

type Props = {
  // 목차에 쓰는 셀러 이름. 순서는 children 레인 순서와 같아야 한다.
  vendors: { slug: string; name: string }[];
  // 서버에서 렌더링한 셀러 레인(<li>, VendorLane)들
  children: ReactNode;
  labels: {
    index: string;
    rail: string;
    more: string;
  };
};

// 마켓 골목: 셀러 목차 + 가로 레일. 스크롤·스냅은 CSS 가 맡고, 여기서는 목차만 다룬다 —
// 지금 보이는 셀러를 표시하고, 이름을 누르면 레일을 그 셀러로 옮긴다.
//
// --rail-gutter = 위·아래 섹션(px-4 > max-w-7xl) 콘텐츠의 왼쪽 선. 목차, 레일 여백, 스냅 기준이
// 모두 이 값을 읽는다. 100vw 와 달리 cqw 는 스크롤바 폭이 끼어들지 않는다.
export default function MarketRail({ vendors, children, labels }: Props) {
  const railRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const railId = useId();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    const list = listRef.current;
    if (!rail || !list) return;

    // 자기 폭 대비 가장 많이 보이는 레인이 지금 셀러다. 비율이 같으면 왼쪽 레인 —
    // 끝까지 밀어도 시작선에 못 오는 짧은 레인을 눌렀을 때도 그 셀러가 표시된다.
    const update = () => {
      const view = rail.getBoundingClientRect();
      let best = 0;
      let bestRatio = -1;
      Array.from(list.children).forEach((lane, index) => {
        const rect = lane.getBoundingClientRect();
        const visible =
          Math.min(rect.right, view.right) - Math.max(rect.left, view.left);
        const ratio = Math.max(0, visible) / rect.width;
        if (ratio > bestRatio) {
          best = index;
          bestRatio = ratio;
        }
      });
      setActive(best);
    };

    update();
    rail.addEventListener("scroll", update);
    const observer = new ResizeObserver(update);
    observer.observe(rail);
    return () => {
      rail.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  // 레일만 옮겨 그 셀러의 첫 타일을 시작선(scroll-padding)에 맞춘다 — 페이지는 움직이지 않는다.
  // behavior 를 넘기지 않아야 CSS scroll-behavior 를 따른다(모션 최소화면 즉시 이동).
  const goTo = (index: number) => {
    const rail = railRef.current;
    const lane = listRef.current?.children[index];
    if (!rail || !lane) return;
    const gutter = parseFloat(getComputedStyle(rail).scrollPaddingLeft) || 0;
    rail.scrollBy({
      left:
        lane.getBoundingClientRect().left -
        rail.getBoundingClientRect().left -
        gutter,
    });
  };

  return (
    <div className="@container [--rail-gutter:max(1rem,50cqw_-_40rem)]">
      {/* 셀러 목차 — 몇 곳이 있는지 한눈에 보이고, 누르면 그 셀러로 건너뛴다. */}
      <nav
        aria-label={labels.index}
        className="flex flex-wrap items-baseline gap-x-6 md:gap-x-8 gap-y-3 px-(--rail-gutter)"
      >
        {vendors.map((vendor, index) => (
          <button
            key={vendor.slug}
            type="button"
            aria-controls={railId}
            aria-current={index === active ? "true" : undefined}
            onClick={() => goTo(index)}
            className={cn(
              "inline-flex items-baseline gap-2 border-b-2 pb-1.5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
              index === active
                ? "border-white text-white"
                : "border-transparent text-white/55 hover:text-white/80",
            )}
          >
            <span className={cn(MONO_CLASS, "text-[13px] md:text-sm tabular-nums")}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-lg md:text-xl font-bold break-keep">
              {vendor.name}
            </span>
          </button>
        ))}
        <span className="text-[13px] md:text-sm text-white/55">
          {labels.more}
        </span>
      </nav>

      <div
        id={railId}
        ref={railRef}
        className="mt-5 md:mt-6 overflow-x-auto overflow-y-hidden overscroll-x-contain snap-x snap-mandatory scroll-px-(--rail-gutter) scroll-smooth motion-reduce:scroll-auto scrollbar-none"
      >
        {/* 끝 여백이 사라지지 않도록 패딩은 스크롤 컨테이너가 아니라 안쪽 w-max 목록에 둔다. */}
        <ul
          ref={listRef}
          aria-label={labels.rail}
          className="flex w-max gap-10 md:gap-14 px-(--rail-gutter)"
        >
          {children}
        </ul>
      </div>
    </div>
  );
}
