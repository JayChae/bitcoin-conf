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

// bitcoin++ 서울(프라이버시 에디션)은 날짜와 상관없이 항상 맨 앞에 둔다.
// 나머지는 날짜 순.
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
    slug: "dmz-tour",
    image: "/2026/side-events/dmz-tour.webp",
    cardImage: "/2026/side-events/dmz-tour-card.webp",
    links: [{ type: "website", url: "https://luma.com/4lhp10tz" }],
    i18n: {
      en: {
        title: "DMZ Tour",
        host: "Calvin Kim",
        date: "Tue, Nov 3, 2026 · 09:00 – 16:30",
        shortDescription:
          "Get as close to North Korea as you can: descend into a tunnel North Korea secretly dug, look across the border, and sit down for an open Q&A with a North Korean defector.",
        description:
          "We can't go to North Korea itself, so we're getting as close to it as possible.\n\nWe'll head to the DMZ, descend into a tunnel secretly dug by North Korea, look across the border with our own eyes, and sit down with a North Korean defector for an open Q&A.\n\nOpen to Bitcoin Korea Conference VIP ticket holders and speakers, and btc++ Seoul edition attendees.\n\nSchedule: Tuesday, November 3, 2026, 09:00 – 16:30\n\nMeeting point: Myeongdong Station Exit 7, Seoul\n\nWhat to bring (required): Passport",
      },
      ko: {
        title: "DMZ 투어",
        host: "Calvin Kim",
        date: "2026년 11월 3일 (화) 09:00 – 16:30",
        shortDescription:
          "북한과 가장 가까운 곳, DMZ로 떠나는 하루. 북한이 몰래 판 땅굴로 내려가 국경 너머를 바라보고, 탈북민과 자유롭게 질의응답을 나눕니다.",
        description:
          "북한에 직접 가볼 수는 없습니다. 그래서 갈 수 있는 가장 가까운 곳까지 가보려 합니다.\n\nDMZ로 이동해 북한이 몰래 판 땅굴 안으로 내려가고, 국경 너머를 직접 바라본 뒤, 탈북민과 함께 자유로운 질의응답 시간을 갖습니다.\n\nBitcoin Korea Conference VIP 티켓 보유자와 연사, btc++ Seoul edition 참가자가 신청할 수 있습니다.\n\n일정: 2026년 11월 3일 (화) 09:00 – 16:30\n\n집결 장소: 명동역 7번 출구\n\n준비물(필수): 여권",
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
    slug: "run-for-hal",
    image: "/2026/side-events/run-for-hal.webp",
    cardImage: "/2026/side-events/run-for-hal-card.webp",
    links: [
      { type: "website", url: "https://bitcoinrunners.org/events/korea26/" },
    ],
    i18n: {
      en: {
        title: "Run For Hal (5km Social Run)",
        host: "Bitcoin Runners × ALS Network",
        date: "Sat, Nov 7, 2026 · Meet at 09:00",
        shortDescription:
          "A 5km social run/jog honouring Hal Finney and raising funds for ALS research. All paces welcome, no conference ticket required.",
        description:
          "The best way to enjoy Bitcoin Korea 2026: \"Running bitcoin.\"\n\nJoin us for Run For Hal, a 5km social run/jog honouring Hal Finney — the bitcoin pioneer who received the very first bitcoin transaction and faced ALS with remarkable courage. Pace doesn't matter. Seasoned runners and those who just want a light warm-up are equally welcome.\n\nAll you need is a pair of running shoes, comfortable workout clothes, and a bright smile.\n\nWant to turn your run into a fundraiser for ALS/MND research? You can ask for sponsorship or donate directly, and the ALS Network staff will be happy to help. For questions, contact Asher Garfinkel (agarfinkel@alsnetwork.org).\n\nThis is a free side event open to everyone (no conference ticket required). Please RSVP so we can prepare and keep you updated.\n\nRun free, stay sovereign, stack sats!\n\nSchedule: Saturday, November 7, 2026 · Meet at 09:00, start at 09:15\n\nVenue: Seoul (meeting point TBD)\n\nFee: Free",
      },
      ko: {
        title: "Run For Hal (5km 소셜 런)",
        host: "Bitcoin Runners × ALS Network",
        date: "2026년 11월 7일 (토) 09:00 집결",
        shortDescription:
          "할 피니(Hal Finney)를 기리며 ALS 연구 기금을 모으는 5km 소셜 런. 페이스 무관, 컨퍼런스 티켓 없이 누구나 참여할 수 있습니다.",
        description:
          "비트코인 코리아 2026, 제대로 즐기는 방법: 'Running bitcoin'\n\n할 피니(Hal Finney)를 기리는 'Run For Hal' 5km 소셜 런/조깅에 함께해 주세요. 할 피니는 사상 최초의 비트코인 트랜잭션을 받은 비트코인 선구자이자, 루게릭병(ALS)에 놀라운 용기로 맞선 인물입니다. 페이스는 상관없습니다. 숙련된 러너든, 가볍게 몸을 풀고 싶은 분이든 모두 환영합니다.\n\n준비물은 러닝화, 편한 운동복, 그리고 밝은 미소면 충분합니다.\n\n여러분의 달리기를 ALS/MND 연구 기금 모금으로 이어가고 싶으신가요? 여기에서 후원을 요청하거나 직접 기부하실 수 있습니다. ALS Network 스태프가 기꺼이 도와드립니다. 문의는 Asher Garfinkel(agarfinkel@alsnetwork.org)에게 연락해 주세요.\n\n이 행사는 누구나 참여할 수 있는 무료 사이드 이벤트입니다(컨퍼런스 티켓 불필요). 행사 준비와 안내를 위해 꼭 참가 신청(RSVP)을 부탁드립니다.\n\n자유롭게 달리고, 주권을 지키고, 사토시를 모으자!\n\n달리는 속도는 자유롭습니다! 부담없이 참가해주세요!!\n함께 달리고! 함께 행사를 즐겨요!!\n\n일정: 2026년 11월 7일 (토) 오전 09:00 집결, 09:15 출발\n\n장소: 서울 (집결 장소 추후 안내)\n\n비용: 무료",
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
  {
    slug: "bitcoin-classical-music",
    image: "/2026/side-events/bitcoin-classical-music.webp",
    cardImage: "/2026/side-events/bitcoin-classical-music-card.webp",
    links: [],
    i18n: {
      en: {
        title: "Bitcoin & Classical Music",
        host: "Bitcoin Korea Conference",
        date: "Sun, Nov 8, 2026 · 12:30 – 13:00",
        shortDescription:
          "A classical trio performance over lunch — step away from the conference buzz and rest your mind with music. Free for Day-2 ticket holders.",
        description:
          "A Classical Trio with Bitcoin\n\nStep away from the buzz of the conference for a moment and give your mind a rest with some music.\n\nAs a special side event of the Bitcoin Korea Conference, a classical string trio performance will take place.\n\nThrough the beautiful melodies of violin, viola, and cello, experience the harmony and inspiration that classical music brings, alongside the new world bitcoin is building.\n\nSince this is a short performance during lunch, we recommend being seated at the venue by 12:30 if you plan to attend.\n\nEnjoy a delicious lunch and a moment of music as you continue your conference journey.\n\nSchedule: Sunday, November 8, 2026, 12:30 – 13:00\n\nVenue: Myeongdong Community House Masil, 2F\n\nProgram: Classical music trio performance\n\nAdmission: Free for Day-2 ticket holders only",
      },
      ko: {
        title: "Bitcoin & Classical Music",
        host: "Bitcoin Korea Conference",
        date: "2026년 11월 8일 (일) 12:30 – 13:00",
        shortDescription:
          "비트코인과 함께하는 클래식 3중주. 점심시간, 컨퍼런스의 열기에서 잠시 벗어나 음악과 함께 쉬어가는 시간. Day-2 티켓 소지자 무료.",
        description:
          "비트코인과 함께하는 클래식 3중주\n\n컨퍼런스의 열기에서 잠시 벗어나, 음악과 함께 마음을 쉬어가는 시간을 가져보세요.\n\nBitcoin Korea Conference의 특별한 사이드 이벤트로 클래식 현악 3중주 공연이 진행됩니다.\n\n바이올린, 비올라, 첼로가 만들어내는 아름다운 선율을 통해 비트코인이 만들어가는 새로운 세계와 클래식 음악이 선사하는 조화와 영감을 함께 경험해보세요.\n\n점심시간에 진행되는 짧은 공연인 만큼, 공연을 관람하실 분들은 12:30까지 행사장에 미리 자리해 주시기를 권장드립니다.\n\n맛있는 점심과 함께 잠시 음악을 즐기며 컨퍼런스의 여정을 이어가 보세요.\n\n일시: 2026년 11월 8일 (일) 12:30 – 13:00\n\n장소: 명동 커뮤니티 하우스 마실 2층\n\n프로그램: 클래식 음악 3중주 공연\n\n입장비: Day-2 티켓 소지자에 한하여 무료",
      },
    },
  },
  {
    slug: "fedi-p2p-platform",
    image: "/2026/side-events/fedi-p2p-platform.webp",
    cardImage: "/2026/side-events/fedi-p2p-platform-card.webp",
    links: [],
    i18n: {
      en: {
        title: "Using a New Bitcoin P2P Platform",
        host: "Dea Rezkitha (Fedi)",
        date: "Sun, Nov 8, 2026 · 13:00 – 14:00",
        shortDescription:
          "Fedi introduces its new P2P platform in a private session where the team and users can talk directly.",
        description:
          "An introduction to Fedi's new P2P platform, and a chance for the company and its users to talk directly with one another. This is a private event — if you'd like to join, please reach out to admin@bitomun.com.\n\nSchedule: Sunday, November 8, 2026, 13:00 – 14:00\n\nVenue: Shared with registered attendees only\n\nCapacity: 10 people\n\nFee: Free",
      },
      ko: {
        title: "새로운 비트코인 플랫폼 소개",
        host: "Dea Rezkitha (Fedi)",
        date: "2026년 11월 8일 (일) 13:00 – 14:00",
        shortDescription:
          "Fedi의 새로운 P2P 플랫폼을 소개하고, 기업과 유저가 직접 소통하는 프라이빗 세션.",
        description:
          "Fedi 기업의 새로운 플랫폼인 P2P 플랫폼을 소개하고 기업과 유저간의 소통이 이루어지는 자리입니다. 해당 이벤트는 프라이빗으로 진행하여 신청을 원할경우 admin@bitomun.com으로 연락 주세요.\n\n일정: 2026년 11월 8일 (일) 오후 01:00 ~ 02:00\n\n장소: 신청자에 한하여 공개\n\n정원: 10명\n\n비용: 무료",
      },
    },
  },
  {
    slug: "diy-signing-device-workshop",
    image: "/2026/side-events/diy-signing-device-workshop.webp",
    cardImage: "/2026/side-events/diy-signing-device-workshop-card.webp",
    links: [
      {
        type: "website",
        url: "https://bitcoincenterseoul.com/ko/programs/bitcoin-developer-hands-on-workshop",
      },
    ],
    i18n: {
      en: {
        title: "Build Your Own Bitcoin Signing Device: DIY Hands-on Workshop",
        host: "Bitcoin Center Seoul × DIYbitcoin (@diybitcoin)",
        date: "Tue, Nov 10, 2026 · 19:00 – 21:00",
        theme: "Don't Trust, Verify — The World of DIY Bitcoin",
        shortDescription:
          "Compare open-source signing devices, then flash firmware onto a board yourself using your own laptop.",
        description:
          "Explore the different approaches open-source signing devices take to balance security and usability. After the walkthrough, participants install firmware themselves using their own laptops.\n\nProgram\n\n• Intro to the DIY bitcoin ecosystem: Look at DIY projects across wallets, nodes, miners, and signing devices, and see how the principle of \"Don't trust, verify\" connects to open-source code.\n\n• Comparing open-source signing devices: Compare Specter-DIY, SeedSigner, Krux, and Jade by board, firmware, storage approach, and how they use QR codes.\n\n• Firmware installation lab: In teams, install and boot Kern and KISS Signer on a board. If boards run out, install Satochip on a blank smartcard and set up a wallet in Sparrow.\n\n• Optional advanced lab: Send and receive on signet (testnet), and try silent payments with KISS Signer and kiss-bdk.\n\nOn-site prizes: Active participants in the lab will receive an ESP32-P4 board (5 in total).\n\nWho it's for\n\n• Those who want to learn how wallets work by getting hands-on with DIY signing devices\n• Those curious about the board and firmware differences between open-source signing devices\n• Those who want to contribute to DIY projects through guides, translations, or bug reports\n\nAbout the host: DIYbitcoin promotes DIY bitcoin projects and helps developers secure funding. It shares learning resources in its Telegram community and handles promotion for the Krux team.\n\nSchedule: Tuesday, November 10, 2026, 19:00 – 21:00 (KST)\n\nVenue: Bitcoin Center Seoul (2F, 30 Sinchon-ro 2an-gil, Mapo-gu, Seoul · 3 min walk from Hongik Univ. Station Exit 6)\n\nFee: 15,000 sats\n\nWhat to bring (required): Laptop, power bank, USB-C cable",
      },
      ko: {
        title: "직접 만드는 비트코인 서명 장치, DIY 실습 워크숍",
        host: "비트코인센터 서울 × DIYbitcoin (@diybitcoin)",
        date: "2026년 11월 10일 (화) 19:00 – 21:00",
        theme: "신뢰하지 말고 검증하라, DIY 비트코인의 세계",
        shortDescription:
          "오픈소스 서명 장치들을 비교해 보고, 자기 노트북으로 보드에 펌웨어를 직접 설치해 보는 실습 워크숍.",
        description:
          "여러 오픈소스 서명 장치가 보안과 사용성을 위해 각각 어떤 방식을 택했는지 알아봅니다. 설명을 들은 뒤, 참가자가 자기 노트북으로 펌웨어를 직접 설치해 봅니다.\n\n프로그램\n\n• DIY 비트코인 생태계 소개: 지갑, 노드, 채굴기, 서명 장치까지 DIY 프로젝트를 살펴보고, \"신뢰하지 말고 검증하라\"는 원칙이 공개된 코드와 어떻게 이어지는지 알아봅니다.\n\n• 오픈소스 서명 장치 비교: Specter-DIY, SeedSigner, Krux, Jade를 보드, 펌웨어, 저장 방식, QR 활용 방식 기준으로 비교합니다.\n\n• 펌웨어 설치 실습: 팀별로 보드에 Kern과 KISS Signer를 설치하고 부팅합니다. 보드가 떨어지면 빈 스마트카드에 Satochip을 설치하고 Sparrow에서 지갑을 설정합니다.\n\n• 선택 심화 실습: 시그넷(테스트넷)에서 송금과 수신을 해 보고, KISS Signer와 kiss-bdk로 사일런트 페이먼트를 체험합니다.\n\n현장 경품: 실습에 적극적으로 참여한 분께 ESP32-P4 보드를 드립니다(총 5개).\n\n추천 대상\n\n• DIY 서명 장치를 직접 다뤄 보며 지갑의 작동 원리를 알고 싶은 분\n• 오픈소스 서명 장치들의 보드와 펌웨어 차이가 궁금한 분\n• 가이드 작성, 번역, 버그 제보로 DIY 프로젝트에 기여하고 싶은 분\n\n진행자 소개: DIYbitcoin은 DIY 비트코인 프로젝트를 알리고 개발자의 후원금 확보를 돕습니다. 텔레그램 커뮤니티에서 학습 자료를 공유하고, Krux 팀의 홍보를 맡고 있습니다.\n\n일시: 2026년 11월 10일 (화) 19:00 – 21:00 (KST)\n\n장소: 비트코인센터 서울 (서울 마포구 신촌로2안길 30, 2층 · 홍대입구역 6번 출구 도보 3분)\n\n참가비: 15,000 sats\n\n준비물(필수): 노트북, 보조배터리, USB-C 케이블",
      },
    },
  },
];

const sideEvents = {
  en: items.map(({ i18n, ...common }) => ({ ...common, ...i18n.en })),
  ko: items.map(({ i18n, ...common }) => ({ ...common, ...i18n.ko })),
} satisfies Record<Locale, SideEvent[]>;

export default sideEvents;
