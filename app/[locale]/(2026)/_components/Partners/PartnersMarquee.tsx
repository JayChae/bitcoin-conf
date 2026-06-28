import { cn } from "@/lib/utils";
import PartnerLogo from "./PartnerLogo";
import type { Partner } from "@/app/messages/2026/partners";

type Props = {
  partners: Partner[];
};

// 로고 표시 크기 + 그에 맞춘 sizes (과대 이미지 다운로드 방지)
const LOGO_CLASS =
  "h-9 w-auto max-w-[130px] object-contain sm:h-11 sm:max-w-[160px] md:h-14 md:max-w-[190px]";
const LOGO_SIZES = "(min-width: 768px) 190px, (min-width: 640px) 160px, 130px";

export default function PartnersMarquee({ partners }: Props) {
  // 끊김 없는 무한 루프를 위해 리스트를 두 번 렌더 → translateX(-50%) 루프.
  // 각 항목에 좌우 동일 패딩을 줘 한 세트의 폭이 정확히 절반이 되도록 한다.
  // 호버 정지/모션 최소화는 globals.css 의 `.partners-marquee` 규칙이 담당.
  const loop = [...partners, ...partners];

  return (
    <div className="partners-marquee relative w-full [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)]">
      <ul className="animate-partners-scroll flex w-max items-center">
        {loop.map((p, i) => {
          const dup = i >= partners.length;
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
                sizes={LOGO_SIZES}
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
