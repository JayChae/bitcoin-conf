export type ReviewLabels = {
  openReview: string;
  shotAlt: string;
  closeLightbox: string;
  prevReview: string;
  nextReview: string;
  nowPlaying: string;
  playVideo: string;
};

// "Reviews2026" 네임스페이스의 t 함수로 갤러리/라이트박스/플레이리스트 라벨을 구성
export function getReviewLabels(t: (key: string) => string): ReviewLabels {
  return {
    openReview: t("openReview"),
    shotAlt: t("shotAlt"),
    closeLightbox: t("closeLightbox"),
    prevReview: t("prevReview"),
    nextReview: t("nextReview"),
    nowPlaying: t("nowPlaying"),
    playVideo: t("playVideo"),
  };
}
