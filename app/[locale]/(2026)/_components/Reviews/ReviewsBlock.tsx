import { getLocale, getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";
import { reviewVideos } from "@/app/messages/2026/reviews";
import ReviewGallery from "./ReviewGallery";
import ReviewVideos from "./ReviewVideos";
import { getReviewLabels } from "./labels";
import { EYEBROW_CLASS } from "../Speakers/InfoField";

type Props = {
  // wall: 홈의 세로 무한 마퀴 / grid: /recap 의 정적 매스너리
  variant: "wall" | "grid";
};

function SubHeading({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* h3: /recap 에는 이 블록을 감싸는 h2 가 없어, span 이면 후기 영역이 문서 개요에서 사라진다 */}
      <h3 className={EYEBROW_CLASS}>{label}</h3>
      <span className="h-px flex-1 bg-white/10" />
    </div>
  );
}

// SNS 갤러리 + 영상 플레이리스트 묶음. 홈 섹션과 /recap 이 갤러리 variant 만 바꿔 공유한다.
export default async function ReviewsBlock({ variant }: Props) {
  const t = await getTranslations("Reviews2026");
  const locale = (await getLocale()) as Locale;
  const videos = reviewVideos[locale];
  const labels = getReviewLabels(t);

  return (
    <>
      <SubHeading label={t("snsHeading")} className="mb-5" />
      <ReviewGallery variant={variant} labels={labels} />

      {/* 영상이 없으면 제목만 덩그러니 남지 않도록 묶어서 감춘다 */}
      {videos.length > 0 && (
        <>
          <SubHeading
            label={t("videoHeading")}
            className="mb-5 mt-14 md:mt-16"
          />
          <ReviewVideos
            videos={videos}
            nowPlayingLabel={labels.nowPlaying}
            playLabel={labels.playVideo}
          />
        </>
      )}
    </>
  );
}
