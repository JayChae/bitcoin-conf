import type { VenueId } from "./venues";

export type Track =
  | "keynote"
  | "panel"
  | "workshop"
  | "networking"
  | "break";

export type SessionLocaleContent = {
  title: string;
  description?: string;
};

export type Session = {
  id: string;
  startTime: string;
  endTime?: string;
  track: Track;
  venue: VenueId;
  speakerSlugs: string[];
  i18n: { en: SessionLocaleContent; ko: SessionLocaleContent };
};

export type DayId = "day1" | "day2";

export type ScheduleDay = {
  id: DayId;
  date: string;
  venues: VenueId[];
  sessions: Session[];
};

const days: ScheduleDay[] = [
  {
    id: "day1",
    date: "2026-11-07",
    venues: ["coex"],
    sessions: [],
  },
  {
    id: "day2",
    date: "2026-11-08",
    venues: ["kfb", "masil"],
    sessions: [],
  },
];

export default days;
