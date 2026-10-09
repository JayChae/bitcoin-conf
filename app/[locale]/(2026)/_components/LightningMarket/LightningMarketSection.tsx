import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import lightningMarket from "@/app/messages/2026/lightningMarket";
import SectionTitle from "../SectionTitle";
import ViewAllLink from "../ViewAllLink";
import MarketRail from "./MarketRail";
import VendorLane from "./VendorLane";

// 랜딩 "마켓 골목": 셀러별로 묶인 상품 사진이 화면 끝까지 이어지는 가로 레일.
// 위의 셀러 목차가 참여 셀러를 한눈에 보여주고, 누르면 그 셀러로 건너뛴다.
export default async function LightningMarketSection() {
  const t = await getTranslations("LightningMarket2026");
  const locale = (await getLocale()) as Locale;
  const vendors = lightningMarket[locale];

  if (vendors.length === 0) return null;

  return (
    <section id="lightning-market" className="scroll-mt-24 mt-40 md:mt-44">
      <div className="max-w-7xl mx-auto px-4">
        <SectionTitle title={t("sectionTitle")} className="mb-4" />
        <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto text-center mb-10 md:mb-12 break-keep">
          {t("lead")}
        </p>
      </div>

      <MarketRail
        vendors={vendors.map(({ slug, name }) => ({ slug, name }))}
        labels={{
          index: t("indexLabel"),
          rail: t("railLabel"),
          more: t("moreSellersShort"),
        }}
      >
        {vendors.map((vendor) => (
          <VendorLane key={vendor.slug} vendor={vendor} />
        ))}
      </MarketRail>

      <div className="max-w-7xl mx-auto px-4">
        <ViewAllLink href="/lightning-market" label={t("viewAll")} />
      </div>
    </section>
  );
}
