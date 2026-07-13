import Image from "next/image";
import type { CSSProperties } from "react";
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
  /** 래퍼 인라인 스타일 — 로고별 CSS 변수(예: 크기 보정 --ls) 주입용 */
  wrapperStyle?: CSSProperties;
  /**
   * 지정하면 next/image fill 모드: 이 클래스(고정 높이 필수)의 박스 안에 로고를
   * object-contain 으로 렌더. 로고 고유 크기가 레이아웃에 영향을 주지 않아
   * 고정 비율 타일(그리드) 안에서 안전하다. 미지정 시 width/height 기반(마퀴).
   */
  fillBoxClassName?: string;
  /** 마퀴 무한 루프용 복제본 — 스크린리더/탭 순서에서 제외 */
  decorative?: boolean;
};

export default function PartnerLogo({
  partner,
  imageClassName,
  sizes,
  wrapperClassName,
  wrapperStyle,
  fillBoxClassName,
  decorative,
}: Props) {
  const image = (
    <Image
      src={partner.image}
      alt={decorative ? "" : partner.alt}
      aria-hidden={decorative || undefined}
      sizes={sizes}
      {...(fillBoxClassName
        ? { fill: true }
        : { width: partner.width, height: partner.height })}
      className={imageClassName}
    />
  );

  const img = fillBoxClassName ? (
    <span className={cn("relative block", fillBoxClassName)}>{image}</span>
  ) : (
    image
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
        style={wrapperStyle}
      >
        {img}
      </a>
    );
  }

  return (
    <div className={wrapperClassName} style={wrapperStyle}>
      {img}
    </div>
  );
}
