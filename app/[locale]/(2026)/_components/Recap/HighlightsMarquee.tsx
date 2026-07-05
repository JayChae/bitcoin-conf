import Image from "next/image";
import { cn } from "@/lib/utils";
import { HIGHLIGHT_IMAGES } from "@/app/messages/2026/recap";

type Props = {
  altPrefix: string;
};

// 원본이 모두 960×720(4:3)이라 높이만 맞추면 폭이 균일하다.
// 표시 폭 = 높이 × 4/3 → sizes 는 브레이크포인트별 실제 폭에 맞춘다.
const PHOTO_CLASS =
  "h-44 w-auto sm:h-52 md:h-64 rounded-xl border border-white/10 object-cover";
const SIZES =
  "(min-width: 768px) 342px, (min-width: 640px) 278px, 235px";

// 무한 루프 마퀴: 리스트를 두 번 렌더하고 translateX(-50%) 반복.
// 호버 정지·prefers-reduced-motion 대응은 globals.css 의 `.marquee` 규칙이 담당.
export default function HighlightsMarquee({ altPrefix }: Props) {
  const loop = [...HIGHLIGHT_IMAGES, ...HIGHLIGHT_IMAGES];

  return (
    <div className="marquee relative w-full [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)]">
      <ul className="animate-marquee-scroll flex w-max items-center">
        {loop.map((src, i) => {
          const dup = i >= HIGHLIGHT_IMAGES.length;
          return (
            <li
              key={i}
              aria-hidden={dup || undefined}
              className={cn("shrink-0 px-2 md:px-2.5", dup && "marquee-dup")}
            >
              <Image
                src={src}
                alt={dup ? "" : `${altPrefix} ${i + 1}`}
                width={960}
                height={720}
                sizes={SIZES}
                className={PHOTO_CLASS}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
