import { REVIEW_SHOTS } from "@/app/messages/2026/reviews";
import type { ReviewLabels } from "./labels";
import ReviewCard from "./ReviewCard";

type Props = {
  labels: ReviewLabels;
  onOpen: (index: number) => void;
};

// 실제 렌더 폭에 맞춘 sizes — 항상 2 열(lg 3 열).
const GRID_SIZES = "(min-width: 1280px) 405px, (min-width: 1024px) 31vw, 48vw";

// CSS multi-column 매스너리 — 가변 높이 스크린샷에 적합. 컬럼 우선 흐름이지만
// 순서 없는 후기 갤러리라 무방하다. (Grid masonry 는 아직 브라우저 플래그 뒤)
export default function ReviewGrid({ labels, onOpen }: Props) {
  return (
    <div className="columns-2 gap-4 lg:columns-3">
      {REVIEW_SHOTS.map((shot, i) => (
        <ReviewCard
          key={shot.src}
          shot={shot}
          index={i}
          onOpen={onOpen}
          openLabel={labels.openReview}
          altPrefix={labels.shotAlt}
          sizes={GRID_SIZES}
          className="mb-4 break-inside-avoid"
        />
      ))}
    </div>
  );
}
