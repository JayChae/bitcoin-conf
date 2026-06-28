import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Partner } from "@/app/messages/2026/partners";

type Props = {
  partner: Partner;
  /** 로고 이미지 자체에 적용할 크기 클래스 (마퀴/그리드가 다름) */
  imageClassName: string;
  /** next/image sizes — 실제 표시 크기에 맞춰 과대 이미지 다운로드 방지 */
  sizes: string;
  /** 래퍼(<a>/<div>) 공통 클래스 */
  wrapperClassName?: string;
  /** 마퀴 무한 루프용 복제본 — 스크린리더/탭 순서에서 제외 */
  decorative?: boolean;
};

export default function PartnerLogo({
  partner,
  imageClassName,
  sizes,
  wrapperClassName,
  decorative,
}: Props) {
  const img = (
    <Image
      src={partner.image}
      alt={decorative ? "" : partner.alt}
      aria-hidden={decorative || undefined}
      width={partner.width}
      height={partner.height}
      sizes={sizes}
      className={cn(imageClassName, partner.invert && "[filter:invert(1)]")}
    />
  );

  if (partner.url) {
    return (
      <a
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={decorative ? undefined : partner.alt}
        aria-hidden={decorative || undefined}
        tabIndex={decorative ? -1 : undefined}
        className={cn("cursor-pointer", wrapperClassName)}
      >
        {img}
      </a>
    );
  }

  return <div className={wrapperClassName}>{img}</div>;
}
