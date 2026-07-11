import { memo } from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Shot } from "@/app/messages/2026/reviews";

type Props = {
  shot: Shot;
  index: number;
  onOpen: (index: number) => void;
  openLabel: string;
  altPrefix: string;
  // 카드 폭은 레이아웃마다 다르다(wall 1~3열 / grid 2~3열) → 호출부가 넘긴다.
  sizes: string;
  // 마퀴 중복본: 스크린리더에서 숨기고 탭 순서에서 제외한다.
  decorative?: boolean;
  className?: string;
};

function ReviewCard({
  shot,
  index,
  onOpen,
  openLabel,
  altPrefix,
  sizes,
  decorative,
  className,
}: Props) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-hidden={decorative || undefined}
      tabIndex={decorative ? -1 : undefined}
      aria-label={`${openLabel}: ${altPrefix} ${index + 1}`}
      className={cn(
        "group relative block w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0d0a1c] transition-colors duration-300 hover:border-glow-pink/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-glow-purple/50",
        className
      )}
    >
      <Image
        src={shot.src}
        width={shot.width}
        height={shot.height}
        alt={decorative ? "" : `${altPrefix} ${index + 1}`}
        sizes={sizes}
        quality={82}
        className="h-auto w-full"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 right-3 grid size-8 place-items-center rounded-full border border-white/15 bg-black/60 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100"
      >
        <Maximize2 className="size-3.5 text-white" />
      </span>
    </button>
  );
}

// 라이트박스를 한 장 넘길 때마다 벽 전체(최대 34장)가 다시 그려지지 않도록 메모한다.
// 모든 prop 이 안정적인 참조(모듈 상수 · setState)라 실제로 걸린다.
export default memo(ReviewCard);
