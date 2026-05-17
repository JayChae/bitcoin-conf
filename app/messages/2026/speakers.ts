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
      { type: "website", url: "https://hrf.org/latest/cisa-research-paper/" },
    ],
    i18n: {
      en: {
        title: "Fabian Jahr",
        subtitle: ["Bitcoin Open Source Developer"],
        bio: "Fabian Jahr is a Berlin-based Bitcoin Core (the standard reference software for the Bitcoin network) developer. His work spans a wide range of efforts to improve the stability and scalability of the Bitcoin protocol — from research on Schnorr signature–based technologies, to in-depth review of critical pull requests, to development of ASMap (a technology that improves the geographic and network decentralization of nodes). In recognition of his research, he was recently selected as a CISA (Cross-Input Signature Aggregation, a Bitcoin signature aggregation technique that can significantly improve transaction efficiency) Research Fellow at the Human Rights Foundation (HRF), and published a 38-page industry report analyzing the impact CISA could have on the Bitcoin ecosystem. At this conference, he will draw on this experience to discuss recent developments in Bitcoin Core, and what the next generation of protocol upgrades — including CISA and Schnorr signatures — means for Bitcoin.",
        lectureTitle: "",
      },
      ko: {
        title: "Fabian Jahr",
        subtitle: ["비트코인 오픈소스 개발자"],
        bio: "파비안 야르(Fabian Jahr)는 베를린에 기반을 두고 활동하는 비트코인 코어(Bitcoin Core, 비트코인 네트워크의 표준 레퍼런스 소프트웨어) 개발자다. 그는 슈노어(Schnorr) 서명 기반 기술 연구부터 핵심 PR(Pull Request)에 대한 심층 리뷰, ASMap(노드 네트워크 분산도 향상 기술) 개발에 이르기까지, 비트코인 프로토콜의 안정성과 확장성을 끌어올리는 작업을 폭넓게 이어 오고 있다. 이러한 연구 역량을 인정받아 최근에는 인권재단(HRF)의 CISA(Cross-Input Signature Aggregation, 트랜잭션 효율을 크게 향상시킬 수 있는 비트코인 서명 집계 기술) 연구 펠로우로 선정되어, CISA가 비트코인 생태계에 미칠 영향을 분석한 38페이지 분량의 산업 보고서를 발표하기도 했다. 이번 컨퍼런스에서는 이러한 경험을 바탕으로 비트코인 코어의 최근 개발 동향, 그리고 CISA와 슈노어 서명을 비롯한 차세대 프로토콜 업그레이드가 갖는 의미에 대해 이야기할 예정이다.",
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
      { type: "website", url: "https://www.livingroomofsatoshi.com" },
    ],
    i18n: {
      en: {
        title: "Daniel James",
        subtitle: ["CEO, Wallet of Satoshi"],
        bio: "Daniel James is the founder and CEO of Wallet of Satoshi, a wallet built on the Bitcoin Lightning Network (a Bitcoin Layer 2 technology for fast, low-cost payments). Since its launch in 2019, Wallet of Satoshi has processed more than 19 million transactions and established itself as the most widely used Lightning wallet in the world. Before Wallet of Satoshi, he founded and ran Living Room of Satoshi in 2014, which allowed users to pay utility and household bills with Bitcoin — making him one of the entrepreneurs with the longest hands-on track record in the Lightning payments space. At this conference, he will speak on strategies for mainstreaming the Lightning Network and expanding Bitcoin payment infrastructure.",
        lectureTitle: "",
      },
      ko: {
        title: "Daniel James",
        subtitle: ["CEO, Wallet of Satoshi"],
        bio: "Daniel James는 비트코인 라이트닝 네트워크(고속·저비용 결제를 위한 비트코인 2계층 기술) 기반 지갑 Wallet of Satoshi의 창업자이자 CEO다. Wallet of Satoshi는 2019년 출시 이후 1,900만 건 이상의 송금을 처리하며 세계에서 가장 널리 쓰이는 라이트닝 지갑으로 자리 잡았다. 그는 Wallet of Satoshi 이전에도 2014년부터 비트코인으로 공과금·청구서를 결제할 수 있게 한 Living Room of Satoshi를 창업·운영해 온, 라이트닝 결제 분야에서 가장 오랜 실전 경험을 가진 기업가 중 한 명이다. 이번 컨퍼런스에서는 라이트닝 네트워크의 대중화와 비트코인 결제 인프라 확장 전략에 대해 발표할 예정이다.",
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
        bio: "Respect is a YouTuber who runs the channel 'Respect Investment Plan.' From the perspective of a working professional pursuing financial independence and freedom of time, he focuses on understanding the essence and volatility of Bitcoin and interpreting it through a long-term lens — delivering the big-picture market flow and asset allocation strategies through in-depth interviews with a wide range of experts. What sets him apart is his ability to translate the complexity of Bitcoin into everyday language, and he has built lasting influence in Korea's Bitcoin content ecosystem on that strength. At this conference, he will speak on the structural value of Bitcoin and strategies for navigating market cycles.",
        lectureTitle: "",
      },
      ko: {
        title: "리스펙",
        subtitle: ["비트코인 유튜버"],
        bio: "리스펙(Respect)은 유튜브 채널 '리스펙 투자플랜'을 운영하는 유튜버이다. 직장인의 시선에서 경제적 자립과 시간의 자유를 추구하며 비트코인의 본질과 변동성을 이해하고, 이를 장기적 관점으로 풀어내며 다양한 전문가들과의 심층 인터뷰를 통해 시장의 큰 흐름과 자산 배분 전략을 전달해 왔다. 그의 특별함은 어려운 비트코인을 일반인들의 언어로 풀어내는 능력으로 한국 비트코인 콘텐츠 생태계에서 꾸준한 영향력을 쌓아 오고 있다. 이번 컨퍼런스에서는 비트코인의 구조적 가치와 사이클 대응 전략에 대해 이야기할 예정이다.",
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
        bio: "Stephan Livera is the host of the Stephan Livera Podcast (SLP), a show that dives deep into the economics and technology of Bitcoin. A longtime student and advocate of the Austrian school (an economic tradition emphasizing free markets and sound money), he is listed on the Mises Institute's official profile page and has consistently worked to interpret Bitcoin through an Austrian-economics lens. SLP has surpassed 6 million cumulative downloads and holds an average rating of 4.9 across more than 700 reviews worldwide — placing it in the top 0.5% of global podcasts and establishing it as one of the flagship podcasts in the Bitcoin space. On the strength of that influence, he is a regular speaker at major Bitcoin conferences around the world. At this conference, drawing on the rich body of interviews he has accumulated over the years, he will share insights on the economic and technical currents in Bitcoin and the latest developments in global markets.",
        lectureTitle: "",
      },
      ko: {
        title: "Stephan Livera",
        subtitle: ["비트코인과 경제 전문 팟캐스터"],
        bio: "스테판 리베라(Stephan Livera)는 비트코인 경제와 기술을 깊이 있게 다루는 'Stephan Livera Podcast(SLP)'의 진행자다. 그는 오스트리안 학파(자유시장과 건전화폐를 강조하는 경제학파)의 오랜 학습자이자 옹호자로, 미제스 연구소(Mises Institute)에도 정식 프로필이 등재되어 있으며, 비트코인을 오스트리안 경제학의 관점에서 해석하는 작업을 꾸준히 이어 오고 있다. 그가 진행하는 SLP는 누적 다운로드 600만 회를 넘어섰고, 전 세계 700여 개의 평점에서 평균 4.9점을 받으며 글로벌 팟캐스트 상위 0.5%, 비트코인 분야의 대표 팟캐스트 중 하나로 자리 잡았다. 이러한 영향력을 바탕으로 그는 전 세계 주요 비트코인 컨퍼런스에 단골 연사로 무대에 오르고 있다. 이번 컨퍼런스에서도 그동안 쌓아 온 풍부한 인터뷰 경험을 바탕으로, 비트코인의 경제적·기술적 흐름과 글로벌 시장의 최신 동향에 대한 통찰을 전할 예정이다.",
        lectureTitle: "",
      },
    },
  },
  {
    slug: "duncan-dean",
    image: "/2026/speakers/Duncan_Dean.webp",
    difficulty: "High",
    links: [],
    i18n: {
      en: {
        title: "Duncan Dean",
        subtitle: ["Engineer, Second"],
        bio: "Duncan Dean is a Bitcoin Lightning Network developer, currently contributing to Bark, Second's implementation of the Ark protocol. Ark is a next-generation Bitcoin Layer 2 solution designed to address Lightning's channel management complexity and liquidity challenges, enabling users to make instant, low-cost off-chain payments without operating their own channels.",
        lectureTitle: "",
      },
      ko: {
        title: "Duncan Dean",
        subtitle: ["Engineer, Second"],
        bio: "비트코인 라이트닝 네트워크 개발자로 활동하고 있으며, 현재는 Second사의 Ark 프로토콜 구현체인 Bark 개발에 참여하고 있습니다. Ark는 라이트닝의 채널 관리 복잡성과 유동성 문제를 해결하기 위해 등장한 차세대 비트코인 Layer 2 솔루션으로, 사용자가 별도의 채널 운영 없이도 즉각적이고 저렴한 오프체인 결제를 이용할 수 있도록 합니다.",
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
