import { getTranslations } from "next-intl/server";
import partners from "@/app/messages/2026/partners";
import PartnersMarquee from "./PartnersMarquee";

// 스폰서 섹션 하위 블록 — 섹션 제목/전체보기/상단 여백은 상위(SponsorsSection)가 담당.
export default async function TrackRecordBand() {
  if (partners.length === 0) return null;

  const t = await getTranslations("Partners2026");

  return (
    <div>
      <h3 className="mb-6 md:mb-8 text-center text-xl md:text-2xl font-semibold text-white/80">
        {t("sectionTitle")}
      </h3>

      {/* 반투명 밴드(bg-white/10). 로고는 카드 없이 밴드 위에 직접,
          높이 기준으로 크기 통일(PartnersMarquee). 로고는 원본 색 그대로. */}
      <div className="w-full bg-white/10 py-8 md:py-10">
        <PartnersMarquee partners={partners} />
      </div>
    </div>
  );
}
