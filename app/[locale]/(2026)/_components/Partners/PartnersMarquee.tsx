import { cn } from "@/lib/utils";
import PartnerLogo from "./PartnerLogo";
import type { Partner } from "@/app/messages/2026/partners";

type Props = {
  partners: Partner[];
};

// 높이 기준으로 크기 통일: 모든 로고를 같은 높이로 맞춤 → 가로로 긴 로고는 넓어질 뿐
// 높이는 동일하므로 "어떤 건 작고 어떤 건 큰" 편차가 사라진다. 여백 많은 로고는 partner.scale로 보정.
// sizes 는 로고별 실제 표시 폭에 맞춰 계산(아래) → 정사각 로고까지 과대 이미지 다운로드 방지.
const LOGO_HEIGHTS_PX = { base: 48, sm: 64, md: 80 } as const; // = LOGO_CLASS 의 h-12/16/20
const LOGO_CLASS = "h-12 w-auto sm:h-16 md:h-20";

export default function PartnersMarquee({ partners }: Props) {
  // 끊김 없는 무한 루프를 위해 리스트를 두 번 렌더 → translateX(-50%) 루프.
  // 각 항목에 좌우 동일 패딩을 줘 한 세트의 폭이 정확히 절반이 되도록 한다.
  // 호버 정지/모션 최소화는 globals.css 의 `.marquee` 규칙이 담당.
  const loop = [...partners, ...partners];

  return (
    <div className="marquee relative w-full [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)]">
      <ul className="animate-marquee-scroll flex w-max items-center">
        {loop.map((p, i) => {
          const dup = i >= partners.length;
          // 표시 폭 = 높이 × (원본 비율 × scale). 각 브레이크포인트 높이에 맞춰 sizes 생성.
          const ratio = (p.width / p.height) * (p.scale ?? 1);
          const px = (h: number) => Math.ceil(h * ratio);
          const sizes = `(min-width: 768px) ${px(LOGO_HEIGHTS_PX.md)}px, (min-width: 640px) ${px(LOGO_HEIGHTS_PX.sm)}px, ${px(LOGO_HEIGHTS_PX.base)}px`;
          return (
            <li
              key={i}
              className={cn(
                "flex shrink-0 items-center px-6 sm:px-8 md:px-10",
                dup && "marquee-dup"
              )}
            >
              <PartnerLogo
                partner={p}
                imageClassName={LOGO_CLASS}
                sizes={sizes}
                wrapperClassName="flex items-center transition-opacity duration-200 hover:opacity-80"
                decorative={dup}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
