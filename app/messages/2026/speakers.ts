import type { Locale } from "@/i18n/routing";

export type SNS = {
  type: "x" | "website" | "youtube" | "nostr" | "telegram" | "github";
  url: string;
};

export const snsIconUrl: Record<SNS["type"], string> = {
  x: "/sns/x.svg",
  website: "/sns/globe.svg",
  youtube: "/sns/youtube.svg",
  nostr: "/sns/nostr.svg",
  telegram: "/sns/telegram.svg",
  github: "/sns/github.svg",
};

export type Difficulty = "High" | "Medium" | "Low";

export type Speaker = {
  slug: string;
  image: string;
  title: string;
  subtitle: string[];
  bio: string;
  lectureTitle: string;
  topic?: string;
  session?: string;
  stage?: string;
  difficulty: Difficulty;
  links: SNS[];
};

type LocaleContent = Pick<
  Speaker,
  "title" | "subtitle" | "bio" | "lectureTitle" | "topic" | "session" | "stage"
>;

type SpeakerSource = Omit<Speaker, keyof LocaleContent> & {
  i18n: { en: LocaleContent; ko: LocaleContent };
};

const items: SpeakerSource[] = [
  {
    slug: "fabian-jahr",
    image: "/2026/speakers/Fabian_Jahr.webp",
    difficulty: "High",
    links: [
      { type: "x", url: "https://x.com/fjahr" },
      { type: "github", url: "https://github.com/fjahr" },
    ],
    i18n: {
      en: {
        title: "Fabian Jahr",
        subtitle: ["Bitcoin Open Source Developer"],
        bio: "Fabian Jahr works on investigating innovations enabled by Schnorr signatures, CISA, dedicated in-depth code review of important Bitcoin Core initiatives, ASMap development, and alternative code hosting solutions.",
        lectureTitle: "",
      },
      ko: {
        title: "Fabian Jahr",
        subtitle: ["비트코인 오픈소스 개발자"],
        bio: "Fabian Jahr는 슈노르 서명으로 가능해진 혁신(CISA 등)을 연구하고, Bitcoin Core의 중요한 이니셔티브에 대한 심층 코드 리뷰, ASMap 개발, 대안적 코드 호스팅 솔루션을 연구하고 있습니다.",
        lectureTitle: "",
      },
    },
  },
  {
    slug: "daniel-james",
    image: "/2026/speakers/Daniel_James.webp",
    difficulty: "Medium",
    links: [
      { type: "x", url: "https://x.com/walletofsatoshi" },
      { type: "website", url: "https://www.walletofsatoshi.com/" },
    ],
    i18n: {
      en: {
        title: "Daniel James",
        subtitle: ["CEO, Wallet of Satoshi"],
        bio: "From Brisbane, Australia Daniel is on a mission to change the world by making Bitcoin usable as everyday money through one the simplest and most widely used Lightning wallets on the planet.",
        lectureTitle: "",
      },
      ko: {
        title: "Daniel James",
        subtitle: ["CEO, Wallet of Satoshi"],
        bio: "호주 브리즈번 출신의 Daniel은 지구상에서 가장 간단하고 널리 사용되는 라이트닝 지갑 중 하나를 통해 비트코인을 일상 화폐로 사용할 수 있게 함으로써 세상을 바꾸겠다는 사명을 가지고 있습니다.",
        lectureTitle: "",
      },
    },
  },
  {
    slug: "adam-gibson",
    image: "/2026/speakers/Adam_Gibson.webp",
    difficulty: "High",
    links: [],
    i18n: {
      en: {
        title: "Adam Gibson",
        subtitle: ["Individual Contributor"],
        bio: "Adam Gibson (aka Waxwing) is a Bitcoin developer and privacy researcher best known for his work on JoinMarket, one of Bitcoin's most prominent CoinJoin implementations. He is one of the most respected voices in Bitcoin privacy and fungibility.",
        lectureTitle: "",
      },
      ko: {
        title: "Adam Gibson",
        subtitle: ["개인 기여자"],
        bio: "Adam Gibson(Waxwing)은 비트코인 개발자이자 프라이버시 연구자로, 비트코인의 가장 대표적인 CoinJoin 구현체인 JoinMarket으로 잘 알려져 있습니다. 비트코인 프라이버시와 대체가능성 분야에서 가장 존경받는 목소리 중 하나입니다.",
        lectureTitle: "",
      },
    },
  },
  {
    slug: "respect",
    image: "/2026/speakers/respect.webp",
    difficulty: "Low",
    links: [
      {
        type: "youtube",
        url: "https://youtube.com/channel/UC1f_j9wOASvYAvADpwTXT0Q?si=OrewibwreA03-_Ff",
      },
      { type: "x", url: "https://x.com/Respect_Invest" },
    ],
    i18n: {
      en: {
        title: "Respect",
        subtitle: ["Bitcoin YouTuber"],
        bio: "Understanding the essence and volatility of Bitcoin, he runs the YouTube channel 'Respect Investment Plan' from a long-term investment perspective. Together with 180,000 subscribers, he shares various content to help people hold onto Bitcoin with the right mindset.",
        lectureTitle: "",
      },
      ko: {
        title: "리스펙",
        subtitle: ["비트코인 유튜버"],
        bio: "비트코인의 본질과 변동성을 이해하고, 이를 장기투자 관점으로 풀어내는 유튜브 '리스펙 투자플랜' 채널을 운영. 18만 구독자와 함께 다양한 콘텐츠를 통해, 비트코인을 지켜낼 수 있는 마인드를 전하고 있습니다.",
        lectureTitle: "",
      },
    },
  },
  {
    slug: "stephan-livera",
    image: "/2026/speakers/Stephan_Livera.webp",
    difficulty: "Low",
    links: [
      { type: "x", url: "https://x.com/stephanlivera" },
      { type: "website", url: "https://stephanlivera.com" },
    ],
    i18n: {
      en: {
        title: "Stephan Livera",
        subtitle: ["Bitcoin & Economics Podcaster"],
        bio: "Stephan Livera is the host of the Stephan Livera Podcast, a leading Bitcoin show covering the technology and economics behind Bitcoin. He also invests in and advises Bitcoin companies including Oranje and Bringin, and is a frequent speaker at Bitcoin conferences around the world.",
        lectureTitle: "",
      },
      ko: {
        title: "Stephan Livera",
        subtitle: ["비트코인과 경제 전문 팟캐스터"],
        bio: "Stephan Livera는 비트코인의 기술과 경제를 다루는 대표적인 비트코인 쇼인 Stephan Livera Podcast의 진행자입니다. 또한 Oranje, Bringin 등 비트코인 기업에 투자하고 자문하며, 전 세계 비트코인 컨퍼런스에서 자주 연사로 활동하고 있습니다.",
        lectureTitle: "",
      },
    },
  },
  {
    slug: "louis-ko",
    image: "/2026/speakers/poedae.webp",
    difficulty: "Medium",
    links: [
      { type: "x", url: "https://x.com/Coconut_BTC" },
      { type: "website", url: "https://www.bitcoincenterseoul.com" },
    ],
    i18n: {
      en: {
        title: "Louis Ko (PowDae)",
        subtitle: ["CEO, NonceLab · Coconut Wallet · Bitcoin Center Seoul"],
        bio: "He is the Founder and CEO of NonceLab, a Bitcoin company operating Coconut Wallet and Bitcoin Center Seoul. He lectures on Bitcoin at universities and enterprises, and is the lead developer of coconut_lib, an open-source library for mobile wallet development.\n\nCEO, NonceLab Inc.\nAdjunct Professor, Graduate School of AI & SW, Sogang University\nAdjunct Professor, Korea Banking Institute",
        lectureTitle: "",
      },
      ko: {
        title: "고덕윤 (포대)",
        subtitle: ["논스랩 · 코코넛 월렛 · 비트코인 센터 서울 대표"],
        bio: "코코넛월렛과 비트코인 센터 서울을 운영하는 논스랩의 설립자로 대학과 기업에서 비트코인을 가르치는 강사로 활동 중에 있으며, 모바일 월렛 개발을 위한 오픈소스 라이브러리 coconut_lib의 메인 개발자입니다.\n\n논스랩(주) 대표이사\n서강대학교 AI/SW 대학원 겸임교수\n한국금융연수원 겸임교수",
        lectureTitle: "",
      },
    },
  },
];

const speakers = {
  en: items.map(({ i18n, ...common }) => ({ ...common, ...i18n.en })),
  ko: items.map(({ i18n, ...common }) => ({ ...common, ...i18n.ko })),
} satisfies Record<Locale, Speaker[]>;

export default speakers;
