/**
 * TicketCard와 StudentTicketCard가 공유하는 반응형 클래스.
 * 두 카드는 같은 그리드에 나란히 서므로 브레이크포인트가 어긋나면 높이가 튄다 —
 * 한쪽만 고치는 일이 없도록 여기 한 곳에서만 정의한다.
 */
export const CARD = {
  /** 카드 안쪽 여백 */
  pad: "p-6 md:p-10 lg:p-4 xl:p-6",
  /** 티어명 */
  title: "text-2xl md:text-3xl lg:text-xl xl:text-2xl font-bold",
  /** 부가 설명 */
  description: "text-sm lg:text-xs xl:text-sm text-white/60 break-keep",
  /** 가격 숫자 */
  price: "text-3xl md:text-4xl lg:text-[22px] xl:text-3xl font-bold text-white tracking-tight",
  /** 혜택 목록 위 구분선 */
  divider: "border-t border-white/10 mb-6 md:mb-8 lg:mb-5 xl:mb-8",
  /** 혜택 목록 */
  benefits: "grid grid-cols-1 gap-y-3 md:gap-y-3.5 lg:gap-y-2.5 xl:gap-y-3.5",
  /** 혜택 한 줄 */
  benefitText: "text-sm lg:text-[13px] xl:text-sm leading-tight break-keep",
  /** CTA 영역 */
  ctaWrap: "mt-auto pt-8 md:pt-10 lg:pt-6 xl:pt-10",
  /** CTA 버튼 공통 */
  ctaButton:
    "w-full flex items-center justify-center text-sm font-semibold py-3.5 px-6 lg:px-3 xl:px-6 rounded-full",
} as const;
