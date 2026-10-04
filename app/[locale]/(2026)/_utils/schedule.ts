import type { Locale } from "@/i18n/routing";
import days, {
  type DayId,
  type RoomId,
  type SessionFormat,
} from "@/app/messages/2026/schedules";
import sideEvents from "@/app/messages/2026/sideEvents";
import speakers from "@/app/messages/2026/speakers";
import type {
  ScheduleDayView,
  SessionView,
  SpeakerView,
} from "../_components/Schedule/timeline";

type ScheduleText = {
  formats: Record<SessionFormat, string>;
  rooms: Record<RoomId, string>;
  topicTba: string;
};

// 형식마다 화면에서 달라지는 점. 형식을 추가하면 여기서 세 가지를 모두 정해야 한다.
type FormatTraits = {
  // 토픽을 따로 적지 않으면 연사의 lectureTitle 을 제목으로 쓴다(없으면 "주제 추후 공개").
  // false 면 토픽이 없을 때 형식명이 곧 제목이 된다.
  inheritsTitle: boolean;
  // 세션이 아니라 구분 행으로 그린다.
  divider: boolean;
  // 제목 위에 형식 라벨을 붙인다. 가장 흔한 "발표"는 굳이 적지 않는다.
  labeled: boolean;
};

const FORMAT_TRAITS: Record<SessionFormat, FormatTraits> = {
  opening: { inheritsTitle: false, divider: false, labeled: true },
  keynote: { inheritsTitle: true, divider: false, labeled: true },
  talk: { inheritsTitle: true, divider: false, labeled: false },
  panel: { inheritsTitle: false, divider: false, labeled: true },
  fireside: { inheritsTitle: false, divider: false, labeled: true },
  debate: { inheritsTitle: false, divider: false, labeled: true },
  workshop: { inheritsTitle: true, divider: false, labeled: true },
  sideEvent: { inheritsTitle: false, divider: false, labeled: true },
  break: { inheritsTitle: false, divider: true, labeled: true },
  lunch: { inheritsTitle: false, divider: true, labeled: true },
};

const TIME = /^([01]\d|2[0-3]):([0-5]\d)$/;

function toMinutes(time: string, where: string): number {
  const match = TIME.exec(time);
  if (!match) throw new Error(`schedules: ${where} has invalid time "${time}"`);
  return Number(match[1]) * 60 + Number(match[2]);
}

// 일정 데이터를 화면용 모델로 푼다. 데이터 실수(없는 slug, 겹치는 시간 등)는
// 조용히 잘못 그리는 대신 여기서 에러로 드러낸다.
export function getScheduleDayView(
  dayId: DayId,
  locale: Locale,
  text: ScheduleText
): ScheduleDayView {
  const day = days[dayId];
  const speakerList = speakers[locale];
  const sideEventList = sideEvents[locale];

  const findSpeaker = (slug: string, where: string) => {
    const found = speakerList.find((speaker) => speaker.slug === slug);
    if (!found) {
      throw new Error(`schedules: ${where} speaker "${slug}" not in speakers.ts`);
    }
    return found;
  };

  const roomRank = (room: RoomId | null) =>
    room === null ? -1 : day.rooms.indexOf(room);

  const sessions = day.sessions
    .map((session, index): SessionView => {
      const where = [dayId, session.start, session.room]
        .filter(Boolean)
        .join(" ");
      const startMin = toMinutes(session.start, where);
      const endMin = session.end ? toMinutes(session.end, where) : null;

      if (endMin !== null && endMin <= startMin) {
        throw new Error(`schedules: ${where} ends before it starts`);
      }
      if (session.room && !day.rooms.includes(session.room)) {
        throw new Error(`schedules: ${where} room is not in the day's rooms`);
      }
      if (session.room && endMin === null) {
        throw new Error(`schedules: ${where} needs an end time`);
      }

      const sideEvent = session.sideEvent
        ? sideEventList.find((event) => event.slug === session.sideEvent)
        : undefined;
      if (session.sideEvent && !sideEvent) {
        throw new Error(
          `schedules: ${where} side event "${session.sideEvent}" not in sideEvents.ts`
        );
      }

      const entries = session.speakers ?? [];
      const sessionSpeakers = entries.map((entry): SpeakerView => {
        if (typeof entry !== "string") {
          return {
            key: `guest-${entry.name.en}`,
            name: entry.name[locale],
            affiliation: entry.affiliation?.[locale] ?? null,
            image: null,
            href: null,
          };
        }
        const speaker = findSpeaker(entry, where);
        return {
          key: speaker.slug,
          name: speaker.title,
          affiliation: speaker.subtitle.join(" · ") || null,
          image: speaker.image,
          href: `/speakers/${speaker.slug}`,
        };
      });

      const traits = FORMAT_TRAITS[session.format];
      const formatLabel = text.formats[session.format];
      const [only] = entries;
      const lectureTitle =
        traits.inheritsTitle && entries.length === 1 && typeof only === "string"
          ? findSpeaker(only, where).lectureTitle
          : "";
      const ownTitle =
        session.title?.[locale] ?? sideEvent?.title ?? (lectureTitle || null);
      const tba = ownTitle === null && traits.inheritsTitle;

      return {
        // 배열에서의 위치라 항상 고유하다. 정렬은 이 뒤에 한다.
        id: `${dayId}-${index}`,
        start: session.start,
        end: session.end ?? null,
        startMin,
        endMin,
        room: session.room ?? null,
        divider: traits.divider,
        // 제목이 형식명으로 대신 채워졌다면 같은 말을 라벨로 또 적지 않는다.
        formatLabel:
          traits.labeled && (ownTitle !== null || tba) ? formatLabel : null,
        title: ownTitle ?? (tba ? text.topicTba : formatLabel),
        tba,
        speakers: sessionSpeakers,
        href: sideEvent ? `/side-events/${sideEvent.slug}` : null,
      };
    })
    .sort(
      (a, b) => a.startMin - b.startMin || roomRank(a.room) - roomRank(b.room)
    );

  const lastInRoom = new Map<RoomId, SessionView>();
  for (const session of sessions) {
    if (session.room === null) continue;
    const previous = lastInRoom.get(session.room);
    if (
      previous &&
      previous.endMin !== null &&
      previous.endMin > session.startMin
    ) {
      throw new Error(
        `schedules: ${dayId} ${session.room} ${previous.start} overlaps ${session.start}`
      );
    }
    lastInRoom.set(session.room, session);
  }

  return {
    id: dayId,
    rooms: day.rooms.map((id) => ({ id, label: text.rooms[id] })),
    sessions,
  };
}
