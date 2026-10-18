import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import partners from "@/app/messages/2026/partners";
import pastSponsors from "@/app/messages/2026/pastSponsors";
import { hasMediaPartners } from "@/app/messages/2026/mediaPartners";
import SponsorTiers from "../_components/Sponsors/SponsorTiers";
import SponsorInquiryCta from "../_components/Sponsors/SponsorInquiryCta";
import MediaPartnerTiers from "../_components/MediaPartners/MediaPartnerTiers";
import PartnersGrid from "../_components/Partners/PartnersGrid";
import { pageMetadata } from "../_utils/metadata";

// 제목 + 부제 + 본문 한 벌. 미디어 파트너·트랙 레코드·역대 후원사가 같은 모양이라 공유.
function SubSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-24 md:mt-32">
      <h2 className="mb-3 text-center text-2xl font-bold text-white md:text-3xl">
        {title}
      </h2>
      <p className="mx-auto mb-10 max-w-2xl break-keep text-center text-sm text-white/60 md:text-base">
        {subtitle}
      </p>
      {children}
    </section>
  );
}

export async function generateMetadata() {
  const t = await getTranslations("Sponsors2026");
  return pageMetadata({
    pathname: "/sponsors",
    title: t("pageTitle"),
    description: t("pageSubtitle"),
  });
}

export default async function SponsorsPage() {
  const t = await getTranslations("Sponsors2026");
  const tPartners = await getTranslations("Partners2026");
  const tMedia = await getTranslations("MediaPartners2026");

  return (
    <main className="relative z-10 min-h-screen px-4 pt-28 pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl">
            {t("pageTitle")}
          </h1>
          <p className="mx-auto max-w-2xl text-base text-white/60 md:text-lg">
            {t("pageSubtitle")}
          </p>
        </div>

        <SponsorTiers />
        <SponsorInquiryCta
          label={t("inquiryCta")}
          description={t("inquiryLead")}
        />

        {/* 미디어 파트너 — 후원사와 다른 개념이라 후원 문의 아래 별도 섹션. */}
        {hasMediaPartners && (
          <SubSection
            title={tMedia("title")}
            subtitle={tMedia("lead")}
          >
            <MediaPartnerTiers />
          </SubSection>
        )}

        {/* 트랙 레코드 — 구 /partners 페이지를 흡수했다. */}
        <SubSection
          title={tPartners("pageTitle")}
          subtitle={tPartners("pageSubtitle")}
        >
          <PartnersGrid partners={partners} />
        </SubSection>

        {/* 역대 후원사 — 연도 구분 없이 한 목록, 페이지 최하단. */}
        <SubSection title={t("pastTitle")} subtitle={t("pastSubtitle")}>
          <PartnersGrid partners={pastSponsors} />
        </SubSection>
      </div>
    </main>
  );
}
