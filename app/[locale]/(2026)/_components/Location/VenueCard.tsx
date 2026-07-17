import type { CSSProperties } from "react";
import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type SubVenue = {
  name: string;
  address: string;
  mapUrl: string;
};

type DayNumber = "01" | "02";

type Props = {
  dayNumber: DayNumber;
  dayBadgeText: string;
  fullDate: string;
  viewMapText: string;
  venues: SubVenue[];
};

// 사진은 카드 네 변에서 배경으로 녹아든다 — 테두리 없이 분위기 레이어로만 존재시킨다.
const photoMask =
  "linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%), " +
  "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)";

const photoMaskStyle: CSSProperties = {
  maskImage: photoMask,
  WebkitMaskImage: photoMask,
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
  maskSize: "100% 100%",
  WebkitMaskSize: "100% 100%",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
};

const dayStyle: Record<
  DayNumber,
  {
    text: string;
    numeral: string;
    dot: string;
    side: "left" | "right";
    photoSrc: string;
    photoClass: string;
    // grayscale 로 만든 휘도 판 위에 그림자/하이라이트를 각 데이 액센트로 매핑한다.
    duoShadow: string;
    duoHighlight: string;
    scrim: string;
  }
> = {
  "01": {
    text: "text-[#C8A0FF]",
    // 사진 위에서는 #8C50C8 가 같은 색상 계열이라 뭉갠다 — 밝은 액센트로 명도 대비를 준다.
    numeral: "text-[#C8A0FF]/[0.32]",
    dot: "bg-[#8C50C8]",
    side: "right",
    photoSrc: "/2026/coex.webp",
    // 3024px 원본이라 블러 불필요. y=62% 는 하늘을 덜어내고 유리 드럼과 coex 사인을 남긴다.
    photoClass: "object-cover object-[50%_62%] grayscale contrast-[1.1]",
    duoShadow: "bg-[#2A1247]",
    duoHighlight: "bg-[#B98CE8]",
    // 스크림도 데이 색을 띤다 — 중성 검정으로 덮으면 듀오톤 색상이 죽는다. b>r 이라 보라로 안착.
    scrim:
      "bg-[linear-gradient(105deg,rgba(12,8,28,0.93)_0%,rgba(12,8,28,0.78)_38%,rgba(12,8,28,0.5)_72%,rgba(12,8,28,0.42)_100%)]",
  },
  "02": {
    text: "text-[#F490FF]",
    numeral: "text-[#F490FF]/[0.28]",
    dot: "bg-[#E947F5]",
    side: "left",
    photoSrc: "/2026/masil.webp",
    // 620px 원본이 데스크톱에서 ~1.6x 늘어난다 → 약한 블러로 업스케일을 피사계심도처럼 감춘다.
    photoClass:
      "object-cover object-[50%_45%] grayscale contrast-[1.1] blur-[1.5px] scale-105",
    duoShadow: "bg-[#4A0B3E]",
    duoHighlight: "bg-[#FFA6F2]",
    // 듀얼 베뉴 = 데스크톱에서 타이포가 전폭을 쓴다 → 방향성 대신 균일한 스크림.
    // r>b 인 마젠타 계열 스크림이라야 Day 2 가 보라로 돌아가지 않는다.
    scrim:
      "bg-[linear-gradient(to_bottom,rgba(24,6,26,0.88)_0%,rgba(24,6,26,0.62)_28%,rgba(24,6,26,0.62)_72%,rgba(24,6,26,0.88)_100%)]",
  },
};

export default function VenueCard({
  dayNumber,
  dayBadgeText,
  fullDate,
  viewMapText,
  venues,
}: Props) {
  const isDual = venues.length > 1;
  const style = dayStyle[dayNumber];

  return (
    <article className="relative px-1 md:px-2 py-16 md:py-24 overflow-hidden">
      {/* isolate 필수 — 없으면 mix-blend 가 뒤의 프로스티드 패널까지 물고 들어간다. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 isolate overflow-hidden"
        style={photoMaskStyle}
      >
        <Image
          src={style.photoSrc}
          alt=""
          fill
          sizes="(min-width: 1024px) 976px, 100vw"
          className={style.photoClass}
        />
        <div className={cn("absolute inset-0 mix-blend-lighten", style.duoShadow)} />
        <div
          className={cn("absolute inset-0 mix-blend-multiply", style.duoHighlight)}
        />
        <div className={cn("absolute inset-0", style.scrim)} />
      </div>

      <span
        aria-hidden
        className={cn(
          `pointer-events-none select-none absolute -top-4 md:-top-8
           font-[family-name:var(--font-ubuntu-mono)] font-extrabold leading-none
           text-[7rem] sm:text-[10rem] md:text-[14rem] tracking-tighter`,
          style.numeral,
          style.side === "right" ? "right-0" : "left-0"
        )}
      >
        {dayNumber}
      </span>

      <header className="relative z-10 [text-shadow:0_1px_14px_rgba(10,8,20,0.85)]">
        <div
          className={cn(
            "flex items-center gap-3 text-xs md:text-sm font-[family-name:var(--font-ubuntu-mono)] uppercase tracking-[0.25em] mb-3",
            style.text
          )}
        >
          <span className={cn("size-1.5 rounded-full", style.dot)} aria-hidden />
          <span className="font-bold">{dayBadgeText}</span>
          <span className="text-white/40">·</span>
          <time className="text-white/70">{fullDate}</time>
        </div>
      </header>

      <div
        className={cn(
          "relative z-10 mt-6 [text-shadow:0_1px_14px_rgba(10,8,20,0.85)]",
          isDual && "grid grid-cols-1 md:grid-cols-2 gap-y-10 md:gap-x-12"
        )}
      >
        {venues.map((v, i) => (
          <div key={v.name} className="relative">
            {isDual && i > 0 && (
              <div
                aria-hidden
                className="md:hidden border-t border-dashed border-white/10 mb-10"
              />
            )}
            <h3
              className={cn(
                "font-extrabold text-white leading-[0.95]",
                isDual
                  ? "text-3xl md:text-4xl lg:text-5xl"
                  : "text-5xl md:text-6xl lg:text-7xl"
              )}
            >
              {v.name}
            </h3>

            <div className="mt-4 flex items-start gap-2 text-white/70 text-sm md:text-base leading-relaxed">
              <MapPin
                className="size-4 mt-1 flex-shrink-0 text-white/45"
                aria-hidden
              />
              <span>{v.address}</span>
            </div>

            <a
              href={v.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 inline-flex items-center gap-1.5
                         font-[family-name:var(--font-ubuntu-mono)] uppercase tracking-[0.18em] text-xs md:text-sm
                         text-white/75 hover:text-white transition-colors duration-200
                         border-b border-white/20 hover:border-white/60 pb-1"
            >
              <span>{viewMapText}</span>
              <ArrowUpRight
                className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              />
            </a>
          </div>
        ))}
      </div>
    </article>
  );
}
