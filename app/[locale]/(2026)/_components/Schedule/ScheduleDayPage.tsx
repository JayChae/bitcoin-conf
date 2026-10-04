import { getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import {
  ROOM_VENUE,
  SCHEDULE_PATH,
  type DayId,
  type RoomId,
  type SessionFormat,
} from "@/app/messages/2026/schedules";
import { venueMapUrl, type VenueId } from "@/app/messages/2026/venues";
import { pageMetadata } from "../../_utils/metadata";
import { getScheduleDayView } from "../../_utils/schedule";
import VenueCard from "../Location/VenueCard";
import DayNav from "./DayNav";
import ScheduleBoard from "./ScheduleBoard";
import ScheduleHero from "./ScheduleHero";

type Props = {
  dayId: DayId;
  locale: Locale;
};

const formatKey: Record<SessionFormat, string> = {
  opening: "formatOpening",
  keynote: "formatKeynote",
  talk: "formatTalk",
  panel: "formatPanel",
  fireside: "formatFireside",
  debate: "formatDebate",
  workshop: "formatWorkshop",
  sideEvent: "formatSideEvent",
  break: "formatBreak",
  lunch: "formatLunch",
};

const roomKey: Record<RoomId, string> = {
  coex: "roomCoex",
  kfb: "roomKfb",
  "masil-2f": "roomMasil2f",
  "masil-1f": "roomMasil1f",
};

const venueKey: Record<VenueId, { name: string; address: string }> = {
  coex: { name: "venueCoexName", address: "venueCoexAddress" },
  kfb: { name: "venueKfbName", address: "venueKfbAddress" },
  masil: { name: "venueMasilName", address: "venueMasilAddress" },
};

const dayNumber: Record<DayId, "01" | "02"> = { day1: "01", day2: "02" };

function translateKeys<K extends string>(
  keys: Record<K, string>,
  t: (key: string) => string
) {
  const entries = Object.entries<string>(keys).map(([id, key]) => [id, t(key)]);
  return Object.fromEntries(entries) as Record<K, string>;
}

export async function scheduleDayMetadata(dayId: DayId, locale: Locale) {
  const t = await getTranslations({ locale, namespace: "Schedule2026" });
  return pageMetadata({
    locale,
    pathname: SCHEDULE_PATH[dayId],
    title: t(`${dayId}MetaTitle`),
    description: t(`${dayId}MetaDescription`),
  });
}

export default async function ScheduleDayPage({ dayId, locale }: Props) {
  const t = await getTranslations({ locale, namespace: "Schedule2026" });
  const tLocation = await getTranslations({
    locale,
    namespace: "Location2026",
  });

  const view = getScheduleDayView(dayId, locale, {
    formats: translateKeys(formatKey, t),
    rooms: translateKeys(roomKey, t),
    topicTba: t("topicTba"),
  });
  // 그날 쓰는 공간에서 장소를 한 번만 뽑아, 머리말과 아래 장소 카드가 같이 쓴다.
  const venues = [
    ...new Set(view.rooms.map((room) => ROOM_VENUE[room.id])),
  ].map((id) => ({
    id,
    name: tLocation(venueKey[id].name),
    address: tLocation(venueKey[id].address),
    mapUrl: venueMapUrl(id, locale),
  }));
  const adjacent =
    dayId === "day1"
      ? ({ id: "day2", direction: "next" } as const)
      : ({ id: "day1", direction: "prev" } as const);

  return (
    <main className="relative z-10 min-h-screen pt-28 pb-20 px-4">
      <ScheduleHero title={t("pageTitle")} meta={t("pageMeta")} />
      <DayNav
        active={dayId}
        label={t("dayNavLabel")}
        items={[
          { id: "day1", label: t("day1Label") },
          { id: "day2", label: t("day2Label") },
        ]}
      />

      {/* 여러 공간을 나란히 놓는 날만 폭을 넓힌다. 머리말과 표는 같은 왼쪽 기준선을 쓴다. */}
      <div
        className={cn(
          "mx-auto mt-12 md:mt-16",
          view.rooms.length > 1 ? "max-w-6xl" : "max-w-4xl"
        )}
      >
        <header className="mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {t(`${dayId}Date`)}
          </h2>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {venues.map((venue) => (
              <li key={venue.id}>
                <a
                  href={venue.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1 text-[15px] md:text-base text-white/80 hover:text-white underline underline-offset-4 decoration-white/25 hover:decoration-white/60 transition-colors duration-200"
                >
                  {venue.name}
                  <ArrowUpRight
                    aria-hidden
                    className="size-3.5 text-white/50 group-hover:text-white transition-colors duration-200"
                  />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-white/55 break-keep">
            {t("scheduleNote")}
          </p>
        </header>

        <ScheduleBoard
          view={view}
          labels={{
            roomFilter: t("roomFilterLabel"),
            allRooms: t("roomAll"),
          }}
        />

        {/* 연사 상세의 이전/다음 내비와 같은 문법으로 다른 날 일정으로 넘어간다. */}
        <nav aria-label={t("dayNavLabel")} className="mt-8 md:mt-10 flex">
          <AdjacentDayLink
            direction={adjacent.direction}
            href={SCHEDULE_PATH[adjacent.id]}
            label={t(`${adjacent.direction}Day`)}
            title={t(`${adjacent.id}Label`)}
          />
        </nav>
      </div>

      <div className="mx-auto max-w-4xl mt-16 md:mt-24">
        <VenueCard
          dayNumber={dayNumber[dayId]}
          dayBadgeText={tLocation(`${dayId}Badge`)}
          fullDate={tLocation(`${dayId}FullDate`)}
          viewMapText={tLocation("viewMap")}
          venues={venues}
        />
      </div>
    </main>
  );
}

function AdjacentDayLink({
  direction,
  href,
  label,
  title,
}: {
  direction: "prev" | "next";
  href: string;
  label: string;
  title: string;
}) {
  const isPrev = direction === "prev";
  const Arrow = isPrev ? ArrowLeft : ArrowRight;
  const arrow = (
    <Arrow
      aria-hidden
      className={cn(
        "size-5 shrink-0 text-white/70 transition-all duration-300 group-hover:text-white",
        isPrev ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"
      )}
    />
  );

  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 md:gap-4 min-w-0",
        !isPrev && "ml-auto"
      )}
    >
      {isPrev && arrow}
      <div
        className={cn(
          "flex flex-col gap-1 min-w-0",
          isPrev ? "text-left" : "text-right"
        )}
      >
        <span className="text-[13px] md:text-sm text-white/55">{label}</span>
        <span className="text-lg md:text-xl font-bold text-white">{title}</span>
      </div>
      {!isPrev && arrow}
    </Link>
  );
}
