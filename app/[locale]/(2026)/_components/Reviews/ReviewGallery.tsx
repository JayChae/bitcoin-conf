"use client";

import { useCallback, useState } from "react";
import { REVIEW_SHOTS } from "@/app/messages/2026/reviews";
import type { ReviewLabels } from "./labels";
import ReviewGrid from "./ReviewGrid";
import ReviewLightbox from "./ReviewLightbox";
import ReviewWall from "./ReviewWall";

type Props = {
  // wall: 홈 세로 무한 마퀴 / grid: /recap 정적 매스너리
  variant: "wall" | "grid";
  labels: ReviewLabels;
};

// 라이트박스 상태만 여기서 쥐고 레이아웃은 둘로 갈라 둔다. 벽은 뷰포트 측정(matchMedia)이
// 필요하고 그리드는 순수 CSS 라, 한 컴포넌트에 섞으면 /recap 이 쓰지도 않는 미디어쿼리
// 구독과 리렌더를 떠안는다.
export default function ReviewGallery({ variant, labels }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(
    () =>
      setOpen((i) =>
        i == null ? i : (i - 1 + REVIEW_SHOTS.length) % REVIEW_SHOTS.length
      ),
    []
  );
  const next = useCallback(
    () => setOpen((i) => (i == null ? i : (i + 1) % REVIEW_SHOTS.length)),
    []
  );

  return (
    <>
      {variant === "wall" ? (
        // 라이트박스가 덮고 있는 동안엔 보이지도 않는 벽을 계속 합성할 이유가 없다.
        <ReviewWall labels={labels} onOpen={setOpen} paused={open != null} />
      ) : (
        <ReviewGrid labels={labels} onOpen={setOpen} />
      )}

      {open != null && (
        <ReviewLightbox
          shots={REVIEW_SHOTS}
          index={open}
          onClose={close}
          onPrev={prev}
          onNext={next}
          altPrefix={labels.shotAlt}
          closeLabel={labels.closeLightbox}
          prevLabel={labels.prevReview}
          nextLabel={labels.nextReview}
        />
      )}
    </>
  );
}
