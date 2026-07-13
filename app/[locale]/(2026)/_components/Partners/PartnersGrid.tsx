import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import PartnerLogo from "./PartnerLogo";
import { logoScale, type Partner } from "@/app/messages/2026/partners";

type Props = {
  partners: Partner[];
};

// 밝은 회색 타일 — 검정 로고도 대비가 확보된다. 로고는 원본 색 그대로.
// 로고는 마퀴처럼 "고정 높이 밴드" 안에 object-contain — 높이 기준으로 통일하되
// 정사각형에 가까운 로고는 logoScale(--ls)로 줄여 체감 크기를 맞춘다.
// fill 모드라 로고 고유 크기가 타일(aspect-[3/2]) 레이아웃을 밀어내지 못한다.
// 밴드 높이는 각 브레이크포인트에서 타일 콘텐츠 높이(= 열너비×2/3 − 패딩)보다 항상 작게.
const TILE =
  "flex aspect-[3/2] items-center justify-center rounded-2xl bg-neutral-400 p-6 transition-transform duration-300 sm:p-8";
const LOGO_BOX =
  "w-full h-[calc(2.5rem*var(--ls,1))] sm:h-[calc(3.5rem*var(--ls,1))] lg:h-[calc(5rem*var(--ls,1))]";
const LOGO_SIZES = "(min-width: 1024px) 260px, (min-width: 640px) 30vw, 45vw";

export default function PartnersGrid({ partners }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
      {partners.map((p, i) => (
        <PartnerLogo
          key={i}
          partner={p}
          imageClassName="object-contain"
          sizes={LOGO_SIZES}
          fillBoxClassName={LOGO_BOX}
          wrapperClassName={cn(TILE, "hover:-translate-y-0.5")}
          wrapperStyle={{ "--ls": logoScale(p) } as CSSProperties}
        />
      ))}
    </div>
  );
}
