import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import type { DayId } from "@/app/messages/2026/schedules";
import { venueMapUrl } from "@/app/messages/2026/venues";
import VenueCard from "../Location/VenueCard";

type Props = {
  dayId: DayId;
  locale: Locale;
};

export default async function SchedulePanelLocation({ dayId, locale }: Props) {
  const t = await getTranslations("Location2026");

  const card =
    dayId === "day1" ? (
      <VenueCard
        dayNumber="01"
        dayBadgeText={t("day1Badge")}
        fullDate={t("day1FullDate")}
        viewMapText={t("viewMap")}
        venues={[
          {
            name: t("venueCoexName"),
            address: t("venueCoexAddress"),
            mapUrl: venueMapUrl("coex", locale),
          },
        ]}
      />
    ) : (
      <VenueCard
        dayNumber="02"
        dayBadgeText={t("day2Badge")}
        fullDate={t("day2FullDate")}
        viewMapText={t("viewMap")}
        venues={[
          {
            name: t("venueKfbName"),
            address: t("venueKfbAddress"),
            mapUrl: venueMapUrl("kfb", locale),
          },
          {
            name: t("venueMasilName"),
            address: t("venueMasilAddress"),
            mapUrl: venueMapUrl("masil", locale),
          },
        ]}
      />
    );

  return (
    <div>
      {card}
      <div
        aria-hidden
        className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent my-8 md:my-12"
      />
    </div>
  );
}
