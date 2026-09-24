import type { Locale } from "@/i18n/routing";
import type { SNS } from "./speakers";

export type SideEvent = {
  slug: string;
  image: string | null;
  // 랜딩 카드용 이미지(정방형). 없으면 image로 폴백한다.
  cardImage?: string;
  date: string;
  links: SNS[];
  title: string;
  host: string;
  shortDescription: string;
  description: string;
  theme?: string;
};

type LocaleContent = Pick<
  SideEvent,
  "title" | "host" | "shortDescription" | "description" | "theme" | "date"
>;

type SideEventSource = Omit<SideEvent, keyof LocaleContent> & {
  i18n: { en: LocaleContent; ko: LocaleContent };
};

const items: SideEventSource[] = [
  {
    slug: "bitcoin-plus-plus-seoul",
    image: "/2026/side-events/bitcoin-plus-plus-seoul.webp",
    cardImage: "/2026/side-events/bitcoin-plus-plus-seoul-card.webp",
    links: [{ type: "website", url: "https://btcpp.dev/seoul" }],
    i18n: {
      en: {
        title: "bitcoin++ Seoul — Privacy Edition",
        host: "bitcoin++ × Bitcoin Korea Conference",
        date: "Nov 5 – 6, 2026",
        theme: "Privacy Edition",
        shortDescription:
          "A developer-focused bitcoin conference series, with the Seoul edition diving deep into privacy and P2P exchange on and off chain.",
        description:
          "bitcoin++ is a developer-focused bitcoin conference series that centers on long-form lectures and workshops, designed for an audience that wants to dig deeper into the cutting edge of bitcoin technology.\n\nEach event picks a specific theme (an \"edition\") to explore one corner of bitcoin in depth. This Seoul edition is the Privacy Edition — a subject of particular interest to the Korean community.\n\nSchedule: November 5 – 6, 2026\n\nTheme: \"Privacy Edition.\" Focused on the \"dark side\" of bitcoin transactions, the edition dives deep into the frontier of privacy and peer-to-peer exchange — both on-chain and off-chain.\n\nThis is the first bitcoin++ event ever held in Korea, co-organized with the ₿itcoin Korea Conference team.",
      },
      ko: {
        title: "bitcoin++ 서울 — 프라이버시 에디션",
        host: "bitcoin++ × Bitcoin Korea Conference",
        date: "2026년 11월 5일 ~ 6일",
        theme: "Privacy Edition",
        shortDescription:
          "개발자 중심의 비트코인 컨퍼런스 시리즈. 서울 에디션은 온체인·오프체인 프라이버시와 P2P 교환의 최전선을 깊이 탐구합니다.",
        description:
          "bitcoin++는 개발자 중심의 비트코인 컨퍼런스 시리즈로, 긴 형식의 강연(long-form lectures)과 워크숍에 중점을 두고, 비트코인 기술의 최첨단(cutting edge)을 더 깊이 파고들기 원하는 청중을 대상으로 합니다.\n\n매 행사마다 특정 주제(에디션)를 정해 비트코인의 한 분야를 집중 탐구하는 것이 특징이며 이번 서울 에디션은 한국인들이 관심이 많은 프라이버시 입니다.\n\n일정: 2026년 11월 5~6일\n\n주제: \"Privacy Edition\" 비트코인 거래의 \"어두운 면(dark side)\"에 집중. 온체인과 오프체인 모두에서 프라이버시와 P2P 교환의 최전선을 깊이 탐구합니다.\n\n이번 행사는 한국에서 열리는 첫 bitcoin++ 행사이며 ₿itcoin Korea Conference 주최측과 함께 기획하여 진행됩니다.",
      },
    },
  },
  {
    slug: "vip-dinner-party",
    image: "/2026/side-events/vip-dinner-party.webp",
    links: [],
    i18n: {
      en: {
        title: "VIP Dinner Party",
        host: "Bitcoin Korea Conference",
        date: "Fri, Nov 6, 2026",
        shortDescription:
          "An intimate dinner gathering for VIP ticket holders, speakers, and partners on the eve of the conference.",
        description:
          "On the eve of the conference, we've set aside a place for those closest to us.\n\nThe VIP Dinner Party is a private dinner for VIP ticket holders, speakers, and partners of the Bitcoin Korea Conference. Over a carefully prepared premium hanwoo course, it's an evening to share thoughts and stories with one another — not on stage, but around a relaxed dinner table.\n\nDepth over formality, conversation over business cards. Start the conversations you won't have time for at the conference right here.",
      },
      ko: {
        title: "VIP 디너 파티",
        host: "Bitcoin Korea Conference",
        date: "2026년 11월 6일 (금)",
        shortDescription:
          "컨퍼런스 전야, VIP 티켓 소지자·연사·파트너를 위한 프라이빗 디너 자리.",
        description:
          "컨퍼런스의 막이 오르기 전날 밤, 가장 가까운 분들을 위한 자리를 마련했습니다.\n\nVIP 디너 파티는 비트코인 코리아 컨퍼런스의 VIP 티켓 소지자, 연사, 그리고 파트너분을 위한 프라이빗 디너입니다. 정성껏 준비한 프리미엄 한우 코스와 함께, 무대 위가 아닌 편안한 식탁에서 서로의 생각과 이야기를 나누는 저녁입니다.\n\n격식보다 깊이를, 명함보다 대화를. 컨퍼런스에서 다 나누지 못할 이야기를 이곳에서 먼저 시작하세요.",
      },
    },
  },
  {
    slug: "meditation-for-bitcoiners",
    image: "/2026/side-events/meditation-for-bitcoiners.webp",
    cardImage: "/2026/side-events/meditation-for-bitcoiners-card.webp",
    links: [
      {
        type: "website",
        url: "https://m.booking.naver.com/booking/12/bizes/152204/items/8087427?entry=pll&isProgramBizItem=false&lang=ko&startDateTime=2026-11-07T00%3A00%3A00%2B09%3A00&theme=place",
      },
    ],
    i18n: {
      en: {
        title: "Meditation for Bitcoiners",
        host: "Master Cheon Sia",
        date: "Sat, Nov 7, 2026 · 10:00 – 11:00",
        shortDescription:
          "Release inner tension and learn a calm, long-term mindset along with simple meditation techniques for living with bitcoin.",
        description:
          "Peace of mind and self-control are essential for any smart bitcoin investor. This session helps bitcoiners release their inner tension, learn a mindset for comfortable long-term holding along with a few simple meditation techniques, and share thoughts on what it means to live alongside bitcoin.\n\nSchedule: Saturday, November 7, 2026, 10:00 – 11:00\n\nVenue: Zen Therapy Natural Healing Center\n\nCapacity: 30 people\n\nFee: KRW 10,000",
      },
      ko: {
        title: "비트코이너들을 위한 명상",
        host: "마스터 천시아",
        date: "2026년 11월 7일 (토) 10:00 – 11:00",
        shortDescription:
          "비트코이너들의 내적 긴장을 풀고, 편안한 장기투자를 위한 마인드셋과 간단한 명상법을 배워보는 시간.",
        description:
          "마음의 평화와 컨트롤은 스마트한 비트코인 투자자를 위해서는 필수 조건입니다. 이 시간은 비트코이너들의 내적 긴장을 풀고 편안한 장기투자를 위한 마인드셋과 간단한 명상방법들을 배워보며, 비트코인과 함께 살아가는 마인드셋에 대해 이야기를 나눠봅니다.\n\n일정: 2026년 11월 7일 (토) 오전 10:00 ~ 11:00\n\n장소: 젠테라피 네츄럴 힐링센터\n\n정원: 30명\n\n비용: 10,000원",
      },
    },
  },
  {
    slug: "after-party",
    image: "/2026/side-events/after-party.webp",
    cardImage: "/2026/side-events/after-party-card.webp",
    links: [],
    i18n: {
      en: {
        title: "After Party",
        host: "Bitcoin Korea Conference",
        date: "Sat, Nov 7, 2026",
        shortDescription:
          "Wind down Day 1 with the conference crowd at the official after party. Open to all networking-party ticket holders.",
        description:
          "The official after party kicks off after Day 1 of the conference, bringing speakers, attendees, and the wider Korean bitcoin community together over drinks. Open to all networking-party ticket holders. Venue and full lineup will be announced closer to the date.",
      },
      ko: {
        title: "애프터 파티",
        host: "Bitcoin Korea Conference",
        date: "2026년 11월 7일 (토)",
        shortDescription:
          "컨퍼런스 1일차 일정 종료 후, 연사와 참가자들이 한자리에 모이는 공식 애프터 파티.",
        description:
          "컨퍼런스 1일차가 끝난 토요일 저녁, 연사·참가자·한국 비트코인 커뮤니티가 한자리에 모이는 공식 애프터 파티가 열립니다. 네트워킹 파티 티켓 소지자라면 누구나 참여하실 수 있으며, 장소와 세부 라인업은 추후 안내 예정입니다.",
      },
    },
  },
];

const sideEvents = {
  en: items.map(({ i18n, ...common }) => ({ ...common, ...i18n.en })),
  ko: items.map(({ i18n, ...common }) => ({ ...common, ...i18n.ko })),
} satisfies Record<Locale, SideEvent[]>;

export default sideEvents;
