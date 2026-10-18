import { getTranslations } from "next-intl/server";
import TrackRecordBand from "./TrackRecordBand";
import ViewAllLink from "../ViewAllLink";

// 스폰서·미디어 파트너 섹션 뒤의 마무리 블록 — 팀 트랙 레코드 + 후원사 전체 보기.
// 자체 소제목(TrackRecordBand)만 있고 큰 섹션 제목은 없으므로 Section 래퍼 대신 여백만 준다.
export default async function TrackRecordSection() {
  const t = await getTranslations("Sponsors2026");

  return (
    <div className="mt-24 md:mt-32">
      <TrackRecordBand />
      <ViewAllLink href="/sponsors" label={t("viewAll")} />
    </div>
  );
}
