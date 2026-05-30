export type SpeakerLabels = {
  topic: string;
  session: string;
  stage: string;
  bio: string;
  cta: string;
  comingSoon: string;
  difficulty: string;
  viewAll: string;
  prev: string;
  next: string;
  carousel: string;
  slide: string;
};

// "Speakers2026" 네임스페이스의 t 함수로 SpeakerCard 라벨을 구성
export function getSpeakerLabels(
  t: (key: string) => string
): SpeakerLabels {
  return {
    topic: t("topicLabel"),
    session: t("sessionLabel"),
    stage: t("stageLabel"),
    bio: t("bioLabel"),
    cta: t("viewDetails"),
    comingSoon: t("comingSoon"),
    difficulty: t("difficultyLabel"),
    viewAll: t("viewAll"),
    prev: t("prev"),
    next: t("next"),
    carousel: t("carousel"),
    slide: t("slide"),
  };
}
