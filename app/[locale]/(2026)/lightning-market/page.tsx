import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import lightningMarket from "@/app/messages/2026/lightningMarket";
import { MARKET_FORM_URL } from "@/app/messages/2026/getInvolved";
import VendorArticle from "../_components/LightningMarket/VendorArticle";
import SponsorInquiryCta from "../_components/Sponsors/SponsorInquiryCta";
import { MONO_CLASS, RULE_CLASS } from "../_components/Schedule/styles";
import { pageMetadata } from "../_utils/metadata";

export async function generateMetadata() {
  const t = await getTranslations("LightningMarket2026");
  return pageMetadata({
    pathname: "/lightning-market",
    title: t("pageTitle"),
    description: t("metaDescription"),
  });
}

export default async function LightningMarketPage() {
  const t = await getTranslations("LightningMarket2026");
  const locale = (await getLocale()) as Locale;
  const vendors = lightningMarket[locale];

  // 일시·장소·결제 안내 줄. 확정된 정보만 적고, 보조 글(note)은 있는 칸에만 붙인다.
  const facts = [
    { label: t("whenLabel"), value: t("whenValue") },
    { label: t("whereLabel"), value: t("whereValue") },
    { label: t("payLabel"), value: t("payValue"), note: t("payNote") },
  ];

  return (
    <main className="relative z-10 min-h-screen pt-28 pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 일정 페이지 머리말처럼 모노 메타 + 글로우 제목. 메타는 보조 글씨 하한(13px)을 지킨다. */}
        <header className="text-center">
          <p
            className={cn(
              MONO_CLASS,
              "uppercase tracking-[0.2em] text-[13px] text-white/55 mb-4 md:mb-5",
            )}
          >
            {t("pageMeta")}
          </p>
          <div className="relative inline-block">
            <div className="absolute inset-0 section-title-glow pointer-events-none" />
            <h1 className="relative text-4xl md:text-5xl lg:text-6xl font-bold text-white px-6 py-3">
              {t("pageTitle")}
            </h1>
          </div>
          <p className="mx-auto mt-3 max-w-2xl text-base md:text-lg text-white/60 break-keep">
            {t("pageSubtitle")}
          </p>
        </header>

        {/* 칸은 색 없는 헤어라인으로만 나눈다. 모바일은 세로로 쌓는다.
            divide-* 는 칸 사이 선의 굵기만 정하고, 색은 각 칸의 RULE_CLASS 가 정한다. */}
        <dl
          className={cn(
            "mt-12 md:mt-16 grid sm:grid-cols-3 border-y divide-y sm:divide-y-0 sm:divide-x",
            RULE_CLASS,
          )}
        >
          {facts.map((fact) => (
            <div
              key={fact.label}
              className={cn(
                "py-5 sm:py-6 sm:px-6 sm:first:pl-0 sm:last:pr-0",
                RULE_CLASS,
              )}
            >
              <dt className="text-[13px] md:text-sm text-white/55">
                {fact.label}
              </dt>
              <dd className="mt-1.5 text-lg md:text-xl font-semibold text-white break-keep">
                {fact.value}
              </dd>
              {fact.note && (
                <dd className="mt-1 text-[13px] md:text-sm text-white/60 break-keep">
                  {fact.note}
                </dd>
              )}
            </div>
          ))}
        </dl>

        <section aria-labelledby="market-sellers" className="mt-20 md:mt-28">
          <h2
            id="market-sellers"
            className="text-2xl md:text-3xl font-bold text-white"
          >
            {t("sellersTitle")}
          </h2>
          <div className="mt-8 md:mt-10 flex flex-col gap-20 md:gap-28">
            {vendors.map((vendor, index) => (
              <VendorArticle
                key={vendor.slug}
                vendor={vendor}
                index={index}
                storeLabel={t("storeLink")}
              />
            ))}
          </div>
          <p className="mt-14 md:mt-20 text-[15px] md:text-base text-white/60 break-keep">
            {t("moreSellers")}
          </p>
        </section>

        <SponsorInquiryCta
          href={MARKET_FORM_URL}
          label={t("boothCta")}
          description={t("boothLead")}
        />
      </div>
    </main>
  );
}
