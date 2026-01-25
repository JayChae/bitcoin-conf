export type AttendeeItem = {
  title: string;
  subtitle: string;
};

const koItems: AttendeeItem[] = [
  {
    title: "200+",
    subtitle: "2024년 참가자",
  },
  {
    title: "국내 유일",
    subtitle: "비트코인 커뮤니티 주도 컨퍼런스",
  },
  {
    title: "400+",
    subtitle: "2025년 예상 참가자",
  },
] as const;

const enItems: AttendeeItem[] = [
  {
    title: "200+",
    subtitle: "Attendees in 2024",
  },
  {
    title: "1st",
    subtitle: "Community led conference in Korea",
  },
  {
    title: "400+",
    subtitle: "Expected attendees in 2025",
  },
] as const;

const attendees = {
  ko: koItems,
  en: enItems,
};

export default attendees;
