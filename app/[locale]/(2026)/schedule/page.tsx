import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import days from "@/app/messages/2026/schedules";
import ScheduleHero from "../_components/Schedule/ScheduleHero";
import ScheduleTimeline from "../_components/Schedule/ScheduleTimeline";
import SchedulePanelLocation from "../_components/Schedule/SchedulePanelLocation";
import DayTabs, {
  type DayTabItem,
} from "../_components/Schedule/DayTabs";

export async function generateMetadata() {
  const t = await getTranslations("Schedule2026");
  return {
    title: t("pageTitle"),
    description: t("pageMetaDescription"),
  };
}

export default async function SchedulePage() {
  const t = await getTranslations("Schedule2026");
  const locale = (await getLocale()) as Locale;

  const items: DayTabItem[] = [
    {
      id: "day1",
      tabLabel: t("day1Label"),
      panel: (
        <>
          <SchedulePanelLocation dayId="day1" locale={locale} />
          <ScheduleTimeline day={days[0]} locale={locale} />
        </>
      ),
    },
    {
      id: "day2",
      tabLabel: t("day2Label"),
      panel: (
        <>
          <SchedulePanelLocation dayId="day2" locale={locale} />
          <ScheduleTimeline day={days[1]} locale={locale} />
        </>
      ),
    },
  ];

  return (
    <main className="relative z-10 min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <ScheduleHero title={t("pageTitle")} meta={t("pageMeta")} />
        <DayTabs days={items} />
      </div>
    </main>
  );
}
