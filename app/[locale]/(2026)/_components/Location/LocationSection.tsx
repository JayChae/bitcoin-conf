import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import Section from "../Section";
import VenueCard from "./VenueCard";
import { venues, type VenueId } from "@/app/messages/2026/venues";

function mapUrl(id: VenueId, locale: Locale) {
  const v = venues[id];
  return locale === "ko" ? v.naverMapUrl : v.googleMapUrl;
}

export default async function LocationSection() {
  const t = await getTranslations("Location2026");
  const locale = (await getLocale()) as Locale;

  const fadeMask =
    "linear-gradient(to bottom, transparent 0%, black 7%, black 93%, transparent 100%)";

  return (
    <Section id="location" title={t("sectionTitle")}>
      <div className="relative isolate max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -inset-x-4 md:-inset-x-12 -z-10
                     backdrop-blur-md bg-[#0a0814]/80"
          style={{ maskImage: fadeMask, WebkitMaskImage: fadeMask }}
        />

        <VenueCard
          dayNumber="01"
          dayBadgeText={t("day1Badge")}
          fullDate={t("day1FullDate")}
          viewMapText={t("viewMap")}
          venues={[
            {
              name: t("venueCoexName"),
              address: t("venueCoexAddress"),
              mapUrl: mapUrl("coex", locale),
            },
          ]}
        />

        <div aria-hidden className="mb-8 md:mb-12 flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#8C50C8]/70 to-[#8C50C8]/70" />
          <div className="flex items-center gap-2 font-[family-name:var(--font-ubuntu-mono)] uppercase tracking-[0.3em] text-[10px] md:text-xs text-white/65 font-semibold">
            <span className="size-1.5 rounded-full bg-[#8C50C8]" />
            <span>NEXT</span>
            <span className="size-1.5 rounded-full bg-[#E947F5]" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-[#E947F5]/70 via-[#E947F5]/70 to-transparent" />
        </div>

        <VenueCard
          dayNumber="02"
          dayBadgeText={t("day2Badge")}
          fullDate={t("day2FullDate")}
          viewMapText={t("viewMap")}
          venues={[
            {
              name: t("venueKfbName"),
              address: t("venueKfbAddress"),
              mapUrl: mapUrl("kfb", locale),
            },
            {
              name: t("venueMasilName"),
              address: t("venueMasilAddress"),
              mapUrl: mapUrl("masil", locale),
            },
          ]}
        />
      </div>
    </Section>
  );
}
