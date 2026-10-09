import type { Locale } from "@/i18n/routing";
import type { VenueId } from "./venues";

export type DayId = "day1" | "day2";

export type RoomId = "coex" | "kfb" | "masil-2f" | "masil-1f";

export type SessionFormat =
  | "opening"
  | "keynote"
  | "talk"
  | "panel"
  | "fireside"
  | "debate"
  | "workshop"
  | "sideEvent"
  | "break"
  | "lunch";

type Localized = Record<Locale, string>;

// speakers.ts 에 프로필이 없는 연사는 이름과 소속을 직접 적는다.
export type GuestSpeaker = {
  name: Localized;
  affiliation?: Localized;
  // public/ 기준 경로. 없으면 이름 첫 글자를 대신 보여준다.
  image?: string;
};

export type Session = {
  // KST 24시간제 "HH:MM". 화면은 시작 시각 순으로 정렬하므로 배열 순서는 상관없다.
  // 두 연사의 순서를 바꿀 때는 두 세션의 start/end 만 맞바꾼다.
  start: string;
  // 없으면 시작 시각만 표기한다.
  end?: string;
  // 없으면 그날 모든 공간에 걸친 행(휴식·점심·애프터 파티).
  room?: RoomId;
  format: SessionFormat;
  // 문자열은 speakers.ts 의 slug.
  speakers?: (string | GuestSpeaker)[];
  // 생략하면 연사가 slug 한 명인 발표는 그 연사의 lectureTitle 을 쓴다.
  // 토픽이 바뀌면 speakers.ts 한 곳만 고치면 된다.
  title?: Localized;
  // sideEvents.ts 의 slug. 제목과 링크를 거기서 가져온다.
  sideEvent?: string;
};

export type ScheduleDay = {
  // 표시 순서. 모바일에서 쌓이는 순서이자 데스크톱의 열 순서다.
  rooms: RoomId[];
  sessions: Session[];
};

export const ROOM_VENUE: Record<RoomId, VenueId> = {
  coex: "coex",
  kfb: "kfb",
  "masil-2f": "masil",
  "masil-1f": "masil",
};

export const SCHEDULE_PATH: Record<DayId, string> = {
  day1: "/schedule",
  day2: "/schedule/day2",
};

const days: Record<DayId, ScheduleDay> = {
  day1: {
    rooms: ["coex"],
    sessions: [
      {
        start: "13:00",
        end: "13:10",
        room: "coex",
        format: "opening",
        speakers: ["spector"],
      },
      {
        start: "13:10",
        end: "13:40",
        room: "coex",
        format: "keynote",
        speakers: ["stephan-livera"],
      },
      {
        start: "13:40",
        end: "14:10",
        room: "coex",
        format: "keynote",
        speakers: ["kang-jaenam"],
      },
      {
        start: "14:10",
        end: "14:40",
        room: "coex",
        format: "keynote",
        speakers: ["adam-gibson"],
      },
      { start: "14:40", end: "15:10", format: "break" },
      {
        start: "15:10",
        end: "15:40",
        room: "coex",
        format: "panel",
        speakers: [
          "respect",
          {
            name: { en: "Calvin", ko: "Calvin" },
            affiliation: {
              en: "Open Source Project, UTREEXO",
              ko: "오픈소스 프로젝트, UTREEXO",
            },
            image: "/avatars/calvin.png",
          },
          "spector",
        ],
      },
      {
        start: "15:40",
        end: "16:10",
        room: "coex",
        format: "keynote",
        speakers: ["daniel-james"],
      },
      {
        start: "16:10",
        end: "16:40",
        room: "coex",
        format: "keynote",
        speakers: ["alex-li"],
      },
      { start: "16:40", end: "17:10", format: "break" },
      {
        start: "17:10",
        end: "17:40",
        room: "coex",
        format: "fireside",
        speakers: ["carl-dong", "stephan-livera"],
      },
      {
        start: "17:40",
        end: "18:00",
        room: "coex",
        format: "keynote",
        speakers: ["hope"],
      },
      { start: "18:30", format: "sideEvent", sideEvent: "after-party" },
    ],
  },
  day2: {
    rooms: ["kfb", "masil-2f", "masil-1f"],
    sessions: [
      { start: "12:00", end: "13:00", format: "lunch" },

      // 은행회관
      {
        start: "13:00",
        end: "13:30",
        room: "kfb",
        format: "talk",
        speakers: ["teruko"],
      },
      {
        start: "13:30",
        end: "14:00",
        room: "kfb",
        format: "talk",
        speakers: ["sergej-kotliar"],
      },
      {
        start: "14:00",
        end: "14:30",
        room: "kfb",
        format: "debate",
        speakers: ["respect", "billy-jo"],
      },
      {
        start: "14:30",
        end: "15:00",
        room: "kfb",
        format: "talk",
        speakers: ["jimmy-kostro"],
      },
      {
        start: "15:00",
        end: "15:30",
        room: "kfb",
        format: "talk",
        speakers: ["marek-feder"],
      },
      {
        start: "15:30",
        end: "16:00",
        room: "kfb",
        format: "talk",
        speakers: ["nedalba"],
      },
      {
        start: "16:00",
        end: "16:30",
        room: "kfb",
        format: "talk",
        speakers: ["dea-rezkitha"],
      },
      {
        start: "16:30",
        end: "17:00",
        room: "kfb",
        format: "talk",
        speakers: ["misha-komarov"],
      },
      {
        start: "17:00",
        end: "17:30",
        room: "kfb",
        format: "talk",
        speakers: ["keypleb"],
      },
      {
        start: "17:30",
        end: "18:00",
        room: "kfb",
        format: "talk",
        speakers: ["piriya-sambandaraksa"],
      },

      // 마실 2층
      {
        start: "12:30",
        end: "13:00",
        room: "masil-2f",
        format: "sideEvent",
        sideEvent: "bitcoin-classical-music",
      },
      {
        start: "13:00",
        end: "13:30",
        room: "masil-2f",
        format: "talk",
        speakers: ["btcbaker"],
      },
      {
        start: "13:30",
        end: "14:00",
        room: "masil-2f",
        format: "talk",
        speakers: ["akasha"],
      },
      {
        start: "14:00",
        end: "14:30",
        room: "masil-2f",
        format: "talk",
        speakers: ["rob"],
      },
      {
        start: "14:30",
        end: "15:00",
        room: "masil-2f",
        format: "talk",
        speakers: ["sea-of-corea"],
      },
      {
        start: "15:00",
        end: "15:30",
        room: "masil-2f",
        format: "talk",
        speakers: ["louis-ko"],
      },
      {
        start: "15:30",
        end: "16:00",
        room: "masil-2f",
        format: "talk",
        speakers: ["matthew-vuk"],
      },
      {
        start: "16:00",
        end: "16:30",
        room: "masil-2f",
        format: "talk",
        speakers: ["jm"],
      },
      {
        start: "16:30",
        end: "17:00",
        room: "masil-2f",
        format: "talk",
        speakers: ["dan-gould"],
      },
      {
        start: "17:00",
        end: "17:30",
        room: "masil-2f",
        format: "talk",
        speakers: ["piccolo"],
      },
      {
        start: "17:30",
        end: "18:00",
        room: "masil-2f",
        format: "talk",
        speakers: ["luis-schwab"],
      },

      // 마실 1층
      {
        start: "09:00",
        end: "09:30",
        room: "masil-1f",
        format: "talk",
        speakers: ["fabian-jahr"],
      },
      {
        start: "09:30",
        end: "10:00",
        room: "masil-1f",
        format: "talk",
        speakers: ["anmol-sharma"],
      },
      {
        start: "10:00",
        end: "10:30",
        room: "masil-1f",
        format: "talk",
        speakers: ["paperpsych"],
      },
      {
        start: "10:30",
        end: "11:00",
        room: "masil-1f",
        format: "talk",
        speakers: ["stark"],
      },
      {
        start: "11:00",
        end: "11:30",
        room: "masil-1f",
        format: "talk",
        speakers: ["veronika-dorson"],
      },
      {
        start: "11:30",
        end: "12:00",
        room: "masil-1f",
        format: "talk",
        speakers: [
          {
            name: { en: "Gio", ko: "Gio" },
            affiliation: { en: "MDK", ko: "MDK" },
          },
        ],
        title: {
          en: "The Future of Bitcoin Mining is Open",
          ko: "비트코인 채굴의 미래는 '오픈'이다",
        },
      },
      {
        start: "13:00",
        end: "14:30",
        room: "masil-1f",
        format: "workshop",
        speakers: ["rama-gan"],
      },
      {
        start: "14:30",
        end: "15:00",
        room: "masil-1f",
        format: "talk",
        speakers: ["duncan-dean"],
      },
      {
        start: "15:00",
        end: "15:30",
        room: "masil-1f",
        format: "talk",
        speakers: ["pacman"],
      },
      {
        start: "15:30",
        end: "16:00",
        room: "masil-1f",
        format: "talk",
        speakers: ["robin"],
      },
      {
        start: "16:00",
        end: "16:30",
        room: "masil-1f",
        format: "talk",
        speakers: ["davidson"],
      },
    ],
  },
};

export default days;
