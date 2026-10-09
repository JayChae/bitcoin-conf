import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  // 프레임(포커스 링 등)과 사진(호버 확대 등)에 덧붙일 클래스
  className?: string;
  imageClassName?: string;
};

// 상품 사진 프레임 — 랜딩 골목과 마켓 페이지가 함께 쓴다.
// 사진은 4:5 로 미리 잘라 두므로 object-cover 가 더 자르지 않는다.
// 비율을 바꾸려면 이 프레임과 원본 사진(public/2026/lightning-market)을 같이 고친다.
export default function ProductPhoto({
  src,
  alt,
  sizes,
  priority,
  className,
  imageClassName,
}: Props) {
  return (
    <div
      className={cn(
        "relative aspect-[4/5] overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        quality={82}
        priority={priority}
        className={cn("object-cover", imageClassName)}
      />
    </div>
  );
}
