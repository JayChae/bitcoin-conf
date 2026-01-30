export type Schedule = {
  title: string;
  date: string;
  time: string;
  description: string;
  content: string;
  locationDescription?: string;
  locations: string[];
  image?: string;
  alt?: string;
};

const koSchedules: Schedule[] = [
  {
    title: "첫째 날",
    date: "2025.11.29",
    time: "11:45-18:00 (KST)",
    description: "",
    content:
      "비트코인의 이해도가 높고 인사이트가 있는 사람들로 엄선하여 모두 함께 강연 형식으로 컨퍼런스를 즐기실 수 있습니다. 행사가 마무리 된 이후에는 참석자끼리의 교류를 활성화 하기 위해 모든 참여자분들께 소고기 회식을 제공합니다.",
    locations: ["서울 강서구 마곡중앙1로 20 지하 1층 NSP 홀"],
    image: "/schedules/mainDay.webp",
    alt: "mainDay",
  },
  {
    title: "둘째 날",
    date: "2025.11.30",
    time: "11:45-18:00 (KST)",
    description: "",
    content:
      "만나기 어렵던 진짜 전문가들과 함께 심층 높은 지식을 강의 형식으로 빠르게 배워갈 수 있습니다. 별도의 라이트닝 마켓 공간에서는 다양한 비트코인 관련 물건들을 만나보고 비트코인으로 구매하실 수 있습니다.",
    locationDescription: "2개 동시 진행 - 홍대역 도보 5분",
    locations: [
      "서울 서대문구 연희로2길 76 (홍대 한빛)",
      "서울 마포구 동교로 30길 21 (SPACE BE)",
    ],
    image: "/schedules/uniDay.webp",
    alt: "uniDay",
  },
] as const;

const enSchedules: Schedule[] = [
  {
    title: "First Day",
    date: "November 29, 2025",
    time: "11:45-18:00 (KST)",
    description: "Curated talks to deliver maximum signal-to-noise ratio.",
    content:
      "A single stage with insightful talks prepared by industry leading experts. K-BBQ dinner provided afterwards to all attendees to strengthen relationships between community members.",
    locations: ["NSP Hall, B1, 20 Magok-jungang 1-ro, Gangseo-gu, Seoul"],
    image: "/schedules/mainDay.webp",
    alt: "mainDay",
  },
  {
    title: "Second Day",
    date: "November 30, 2025",
    time: "11:45-18:00 (KST)",
    description:
      "Hands on workshops with a Lightning Market in the heart of Seoul",
    content:
      "Workshops with a maximum size of 30 people to provide the attendees with quality educational sessions. Booths in the form of a Lightning market in the streets of Seoul to allow access for everyone in Seoul to visit and become a part of the community.",
    locationDescription: "2 simultaneous events",
    locations: [
      "76 Yeonhui-ro 2-gil, Seodaemun-gu, Seoul (Hongdae Hanbit)",
      "21 Donggyo-ro 30-gil, Mapo-gu, Seoul (SPACE BE)",
    ],
    image: "/schedules/uniDay.webp",
    alt: "uniDay",
  },
] as const;

const schedules = {
  ko: koSchedules,
  en: enSchedules,
};

export default schedules;
