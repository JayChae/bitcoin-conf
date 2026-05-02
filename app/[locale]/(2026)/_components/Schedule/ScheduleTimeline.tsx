import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import type { ScheduleDay, Track } from "@/app/messages/2026/schedules";
import type { VenueId } from "@/app/messages/2026/venues";
import speakers from "@/app/messages/2026/speakers";
import SessionCard from "./SessionCard";
import EmptyDay from "./EmptyDay";

type Props = {
  day: ScheduleDay;
  locale: Locale;
};

const trackKey: Record<Track, string> = {
  keynote: "trackKeynote",
  panel: "trackPanel",
  workshop: "trackWorkshop",
  networking: "trackNetworking",
  break: "trackBreak",
};

const venueKey: Record<VenueId, string> = {
  coex: "venueCoex",
  kfb: "venueKfb",
  masil: "venueMasil",
};

export default async function ScheduleTimeline({ day, locale }: Props) {
  const t = await getTranslations("Schedule2026");
  const speakerList = speakers[locale];

  if (day.sessions.length === 0) {
    return (
      <EmptyDay
        eyebrow={t("tbaEyebrow")}
        title={t("comingSoonTitle")}
        subtitle={t("comingSoonSubtitle")}
        ctaLabel={t("viewSpeakers")}
      />
    );
  }

  const showVenueBadge = day.venues.length > 1;

  return (
    <ol className="space-y-0">
      {day.sessions.map((session, idx) => {
        const content = session.i18n[locale];
        const speakerInfos = session.speakerSlugs.map((slug) => {
          const found = speakerList.find((s) => s.slug === slug);
          return { slug, name: found?.title ?? slug };
        });
        return (
          <SessionCard
            key={session.id}
            session={session}
            title={content.title}
            description={content.description}
            trackLabel={t(trackKey[session.track])}
            venueLabel={t(venueKey[session.venue])}
            showVenueBadge={showVenueBadge}
            speakers={speakerInfos}
            isLast={idx === day.sessions.length - 1}
          />
        );
      })}
    </ol>
  );
}
