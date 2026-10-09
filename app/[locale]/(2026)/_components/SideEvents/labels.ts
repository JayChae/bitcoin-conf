export type SideEventLabels = {
  host: string;
  cta: string;
  imageComingSoon: string;
  viewAll: string;
  prev: string;
  next: string;
  carousel: string;
  slide: string;
};

// "SideEvents2026" 네임스페이스의 t 함수로 SideEventCard·캐러셀 라벨을 구성
export function getSideEventLabels(
  t: (key: string) => string
): SideEventLabels {
  return {
    host: t("hostLabel"),
    cta: t("viewDetails"),
    imageComingSoon: t("imageComingSoon"),
    viewAll: t("viewAll"),
    prev: t("prev"),
    next: t("next"),
    carousel: t("carousel"),
    slide: t("slide"),
  };
}
