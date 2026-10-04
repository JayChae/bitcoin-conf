import type { Locale } from "@/i18n/routing";

export type SNS = {
  type:
    | "x"
    | "website"
    | "youtube"
    | "nostr"
    | "telegram"
    | "github"
    | "linkedin";
  url: string;
};

export const snsIconUrl: Record<SNS["type"], string> = {
  x: "/sns/x.svg",
  website: "/sns/globe.svg",
  youtube: "/sns/youtube.svg",
  nostr: "/sns/nostr.svg",
  telegram: "/sns/telegram.svg",
  github: "/sns/github.svg",
  linkedin: "/sns/linkedin.svg",
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
        lectureTitle: "CISA & Friends",
      },
      ko: {
        title: "Fabian Jahr",
        subtitle: ["비트코인 오픈소스 개발자"],
        bio: "파비안 야르(Fabian Jahr)는 베를린에 기반을 두고 활동하는 비트코인 코어(Bitcoin Core, 비트코인 네트워크의 표준 레퍼런스 소프트웨어) 개발자다. 그는 슈노어(Schnorr) 서명 기반 기술 연구부터 핵심 PR(Pull Request)에 대한 심층 리뷰, ASMap(노드 네트워크 분산도 향상 기술) 개발에 이르기까지, 비트코인 프로토콜의 안정성과 확장성을 끌어올리는 작업을 폭넓게 이어 오고 있다. 이러한 연구 역량을 인정받아 최근에는 인권재단(HRF)의 CISA(Cross-Input Signature Aggregation, 트랜잭션 효율을 크게 향상시킬 수 있는 비트코인 서명 집계 기술) 연구 펠로우로 선정되어, CISA가 비트코인 생태계에 미칠 영향을 분석한 38페이지 분량의 산업 보고서를 발표하기도 했다. 이번 컨퍼런스에서는 이러한 경험을 바탕으로 비트코인 코어의 최근 개발 동향, 그리고 CISA와 슈노어 서명을 비롯한 차세대 프로토콜 업그레이드가 갖는 의미에 대해 이야기할 예정이다.",
        lectureTitle: "CISA & Friends",
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
        lectureTitle: "Life on Bitcoin, No Borders",
        session: "Keynote",
      },
      ko: {
        title: "Daniel James",
        subtitle: ["CEO, Wallet of Satoshi"],
        bio: "Daniel James는 비트코인 라이트닝 네트워크(고속·저비용 결제를 위한 비트코인 2계층 기술) 기반 지갑 Wallet of Satoshi의 창업자이자 CEO다. Wallet of Satoshi는 2019년 출시 이후 1,900만 건 이상의 송금을 처리하며 세계에서 가장 널리 쓰이는 라이트닝 지갑으로 자리 잡았다. 그는 Wallet of Satoshi 이전에도 2014년부터 비트코인으로 공과금·청구서를 결제할 수 있게 한 Living Room of Satoshi를 창업·운영해 온, 라이트닝 결제 분야에서 가장 오랜 실전 경험을 가진 기업가 중 한 명이다. 이번 컨퍼런스에서는 라이트닝 네트워크의 대중화와 비트코인 결제 인프라 확장 전략에 대해 발표할 예정이다.",
        lectureTitle: "국경 없는 비트코인 라이프",
        session: "키노트",
      },
    },
  },
  {
    slug: "dan-gould",
    image: "/2026/speakers/Dan_Gould.webp",
    difficulty: "High",
    links: [],
    i18n: {
      en: {
        title: "Dan Gould",
        subtitle: ["Founder, Payjoin Foundation"],
        bio: "Dan Gould is a Bitcoin privacy developer, lead developer of the Payjoin Dev Kit and founder of the Payjoin Foundation. His work on serverless payjoin (BIP 77) makes privacy-preserving payments practical for everyday wallets and exchanges, and is shipping in integrations with Bull Bitcoin and Cake Wallet.",
        lectureTitle: "",
      },
      ko: {
        title: "Dan Gould",
        subtitle: ["Founder, Payjoin Foundation"],
        bio: "Dan Gould는 비트코인 프라이버시 개발자이자 Payjoin Dev Kit의 리드 개발자, 그리고 Payjoin Foundation의 설립자입니다. 그의 서버리스 페이조인(Serverless Payjoin, BIP 77) 연구는 일상적으로 사용하는 지갑과 거래소에서도 프라이버시를 보호하는 결제를 실용적으로 구현할 수 있도록 했으며, 현재 Bull Bitcoin과 Cake Wallet에 통합되어 서비스되고 있습니다.",
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
        lectureTitle:
          "LN-GAP and trustless offchain bitcoin games ... or 'Make Bitcoin Fun Again'",
      },
      ko: {
        title: "Adam Gibson",
        subtitle: ["개인 기여자"],
        bio: "Adam Gibson(Waxwing)은 비트코인 개발자이자 프라이버시 연구자로, 비트코인의 가장 대표적인 CoinJoin 구현체인 JoinMarket으로 잘 알려져 있습니다. 비트코인 프라이버시와 대체가능성 분야에서 가장 존경받는 목소리 중 하나입니다.",
        lectureTitle:
          "LN-GAP과 신뢰가 필요 없는 오프체인 비트코인 게임 … 혹은 '비트코인을 다시 재미있게'",
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
        lectureTitle: "A Bitcoin Mindset Unshaken by Price",
        session: "Debate",
      },
      ko: {
        title: "리스펙",
        subtitle: ["비트코인 유튜버"],
        bio: "리스펙(Respect)은 유튜브 채널 '리스펙 투자플랜'을 운영하는 유튜버이다. 직장인의 시선에서 경제적 자립과 시간의 자유를 추구하며 비트코인의 본질과 변동성을 이해하고, 이를 장기적 관점으로 풀어내며 다양한 전문가들과의 심층 인터뷰를 통해 시장의 큰 흐름과 자산 배분 전략을 전달해 왔다. 그의 특별함은 어려운 비트코인을 일반인들의 언어로 풀어내는 능력으로 한국 비트코인 콘텐츠 생태계에서 꾸준한 영향력을 쌓아 오고 있다. 이번 컨퍼런스에서는 비트코인의 구조적 가치와 사이클 대응 전략에 대해 이야기할 예정이다.",
        lectureTitle: "가격에 흔들리지 않는 비트코인 마인드셋",
        session: "디베이트",
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
        lectureTitle: "How to Prepare for the Coming Quantum Computing Era",
      },
      ko: {
        title: "Stephan Livera",
        subtitle: ["비트코인과 경제 전문 팟캐스터"],
        bio: "스테판 리베라(Stephan Livera)는 비트코인 경제와 기술을 깊이 있게 다루는 'Stephan Livera Podcast(SLP)'의 진행자다. 그는 오스트리안 학파(자유시장과 건전화폐를 강조하는 경제학파)의 오랜 학습자이자 옹호자로, 미제스 연구소(Mises Institute)에도 정식 프로필이 등재되어 있으며, 비트코인을 오스트리안 경제학의 관점에서 해석하는 작업을 꾸준히 이어 오고 있다. 그가 진행하는 SLP는 누적 다운로드 600만 회를 넘어섰고, 전 세계 700여 개의 평점에서 평균 4.9점을 받으며 글로벌 팟캐스트 상위 0.5%, 비트코인 분야의 대표 팟캐스트 중 하나로 자리 잡았다. 이러한 영향력을 바탕으로 그는 전 세계 주요 비트코인 컨퍼런스에 단골 연사로 무대에 오르고 있다. 이번 컨퍼런스에서도 그동안 쌓아 온 풍부한 인터뷰 경험을 바탕으로, 비트코인의 경제적·기술적 흐름과 글로벌 시장의 최신 동향에 대한 통찰을 전할 예정이다.",
        lectureTitle: "다가오는 양자컴퓨팅 시대, 어떻게 대비할 것인가",
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
    difficulty: "Low",
    links: [
      { type: "x", url: "https://x.com/Coconut_BTC" },
      { type: "website", url: "https://www.bitcoincenterseoul.com" },
    ],
    i18n: {
      en: {
        title: "Louis Ko (PowDae)",
        subtitle: ["CEO, NonceLab · Coconut Wallet · Bitcoin Center Seoul"],
        bio: "He is the Founder and CEO of NonceLab, a Bitcoin company operating Coconut Wallet and Bitcoin Center Seoul. He lectures on Bitcoin at universities and enterprises, and is the lead developer of coconut_lib, an open-source library for mobile wallet development.\n\nCEO, NonceLab Inc.\nAdjunct Professor, Graduate School of AI & SW, Sogang University\nAdjunct Professor, Korea Banking Institute",
        lectureTitle: "Becoming a Bitcoin Builder",
      },
      ko: {
        title: "고덕윤 (포대)",
        subtitle: ["논스랩 · 코코넛 월렛 · 비트코인 센터 서울 대표"],
        bio: "코코넛월렛과 비트코인 센터 서울을 운영하는 논스랩의 설립자로 대학과 기업에서 비트코인을 가르치는 강사로 활동 중에 있으며, 모바일 월렛 개발을 위한 오픈소스 라이브러리 coconut_lib의 메인 개발자입니다.\n\n논스랩(주) 대표이사\n서강대학교 AI/SW 대학원 겸임교수\n한국금융연수원 겸임교수",
        lectureTitle: "비트코인 빌더 되기",
      },
    },
  },
  {
    slug: "kang-jaenam",
    image: "/2026/speakers/Kang_Jaenam.webp",
    difficulty: "Low",
    links: [
      { type: "website", url: "https://blog.naver.com/taxmade_official" },
    ],
    i18n: {
      en: {
        title: "Kang Jae-nam",
        subtitle: ["Co-CEO, MADE Tax & Accounting"],
        bio: "Kang Jae-nam is a licensed tax accountant and the representative of MADE, a tax and accounting firm specializing in crypto assets. She provides in-depth tax management for businesses that accept Bitcoin as payment, P2P (peer-to-peer) traders, and individual investors. Drawing on years of practical experience, she offers realistic and workable approaches to the crypto asset taxation set to take effect in Korea in 2027.\n\nIn this talk she first walks through the 2026 revisions to Korea's crypto asset tax code and how its taxation framework is structured, then introduces the crypto capital gains tax calculator she built herself. She goes on to cover tax-saving strategies that individuals and business owners who steadily stack sats can actually put to use.\n\nTalk outline\n\nCrypto Asset Taxes in 2026\n· The 2026 revisions to crypto asset tax law\n· Understanding the crypto asset taxation framework\n· Using the crypto capital gains tax calculator\n\nTax-Saving Strategies for Stacking Sats\n· What tax saving actually means\n· Key tax-saving methods for individuals and businesses",
        lectureTitle:
          "Crypto Asset Taxes in 2026 / Tax-Saving Strategies for Stacking Sats",
        session: "Keynote",
      },
      ko: {
        title: "강재남",
        subtitle: ["MADE 세무회계 공동 대표"],
        bio: "가상자산 전문 세무회계 MADE의 대표 세무사로, 비트코인으로 결제를 받는 사업체, P2P(개인 간) 거래, 그리고 개인 투자자의 가상자산 세금을 심층적으로 관리하고 있다. 특히 2027년 시행을 앞둔 가상자산 과세에 대해, 다년간의 실무 경험을 바탕으로 보다 현실적이고 합리적인 대응 방법을 제시한다.\n\n이번 발표에서는 2026년 개정된 가상자산 세제와 과세 구조를 먼저 짚어보고, 직접 개발한 가상자산 양도세 계산기 활용법을 소개한다. 이어서 비트코인을 꾸준히 모으는(Stack Sats) 개인과 사업자가 실제로 활용할 수 있는 절세 전략을 다룬다.\n\n발표 주제\n\n2026년 가상자산 세금\n· 2026년 개정된 가상자산 세제\n· 가상자산 과세 구조의 이해\n· 가상자산 양도세 계산기 활용법\n\nStack Sats를 위한 절세 전략\n· 절세란 무엇인가\n· 개인과 사업자가 활용할 수 있는 주요 절세 방법",
        lectureTitle: "2026년 가상자산 세금/Stack Sats를 위한 절세 전략",
        session: "키노트",
      },
    },
  },
  {
    slug: "keypleb",
    image: "/2026/speakers/keypleb.webp",
    difficulty: "Low",
    links: [
      { type: "website", url: "https://codeorange.dev/" },
      { type: "x", url: "https://x.com/codeorangedevs" },
    ],
    i18n: {
      en: {
        title: "Keypleb",
        subtitle: ["Founder, Code Orange"],
        bio: "Keypleb is the founder of Code Orange, a Bitcoin education initiative focused on cultivating the next generation of Bitcoiners, developers, and community leaders across Asia. With a practical, builder-centric approach, Code Orange runs monthly Bitcoin workshops, study cohorts, and developer fellowships that help people build self-custody, payments, and privacy tools themselves.\n\nBefore founding Code Orange, Keypleb co-founded Bitcoin House Bali and actively contributed to growing Indonesia's local Bitcoin community through hands-on meetups and grassroots education. Operating pseudonymously in the true cypherpunk spirit, Keypleb focuses on privacy and censorship resistance, and through the fellowship program works to open paths for Bitcoiners to learn, build, and contribute to Bitcoin Open Source Software.",
        lectureTitle: "Bitcoiner School - from node runner to Bitcoin dev",
      },
      ko: {
        title: "Keypleb",
        subtitle: ["Code Orange 창립자"],
        bio: "키플렙(Keypleb)은 코드 오렌지(Code Orange)의 창립자다. 코드 오렌지는 아시아 전역에서 차세대 비트코이너, 개발자, 커뮤니티 리더를 길러내는 데 초점을 둔 비트코인 교육 이니셔티브다. 코드 오렌지는 실용적이고 빌더 중심적인 접근을 바탕으로, 사람들이 자기수탁(self-custody)·결제·프라이버시 도구를 직접 만들 수 있도록 돕는 월간 비트코인 워크숍, 스터디 코호트, 개발자 펠로우십을 운영한다.\n\n코드 오렌지를 설립하기 전, 키플렙은 비트코인 하우스 발리(Bitcoin House Bali)의 공동 설립에 참여했으며, 직접 발로 뛰는 밋업과 풀뿌리 교육을 통해 인도네시아 현지 비트코인 커뮤니티를 키우는 데 적극적으로 기여했다. 진정한 사이퍼펑크 정신에 따라 가명으로 활동하는 키플렙은 프라이버시와 검열 저항에 집중하고 있으며, 펠로우십 프로그램을 통해 비트코이너들이 비트코인 오픈소스 소프트웨어(Bitcoin Open Source Software)를 배우고, 만들고, 기여할 수 있는 길을 열어주는 데 힘쓰고 있다.",
        lectureTitle: "비트코이너 스쿨 — 노드 러너에서 비트코인 개발자까지",
      },
    },
  },
  {
    slug: "jimmy-kostro",
    image: "/2026/speakers/Jimmy_Kostro.webp",
    difficulty: "Low",
    links: [
      { type: "website", url: "https://www.bitcoinchiangmai.org/" },
      { type: "x", url: "https://x.com/JimmyKostro" },
    ],
    i18n: {
      en: {
        title: "Jimmy Kostro",
        subtitle: ["Founder, Bitcoin Learning Center"],
        bio: "Jimmy Kostro is an American entrepreneur and U.S. Marine Corps veteran, and a passionate Bitcoin advocate based in Chiang Mai, Thailand. He co-founded two logistics companies and grew them into multi-million-dollar businesses spanning 24 markets across the United States. A steadfast Bitcoiner since 2017, Kostro has devoted himself to building one of Asia's most active Bitcoin hubs, and has become a leading voice in showing how Bitcoin can be a powerful tool for financial freedom and sovereignty — especially for people living under authoritarian regimes in Southeast Asia.\n\nHe serves as chairman of The Kostro Foundation, a U.S. 501(c)(3) non-profit that provides education and Bitcoin literacy programs to underserved communities in Thailand. A passionate ultramarathon runner who has competed in races around the world, Kostro loves to draw a powerful parallel between endurance on the trail and Bitcoin's long-term resilience. As a featured speaker at major events including Bitcoin MENA, Bitcoin Vegas, BTC Prague, and Bitcoin Asia, he brings a compelling, freedom-focused perspective to every stage.",
        lectureTitle: "Building Asia's Largest Freedom Brands",
      },
      ko: {
        title: "Jimmy Kostro",
        subtitle: ["Bitcoin Learning Center 창립자"],
        bio: "지미 코스트로(Jimmy Kostro)는 미 해병대 출신의 미국인 기업가이자 열정적인 비트코인 옹호자로, 태국 치앙마이를 거점으로 활동하고 있다. 그는 물류 회사 두 곳을 공동 창업해 미국 24개 시장에 걸친 수백만 달러 규모의 사업으로 키워냈다. 2017년부터 한결같은 비트코이너로 활동해 온 코스트로는 아시아에서 가장 활발한 비트코인 허브를 구축하는 데 전념해 왔으며, 특히 동남아시아의 권위주의 체제 아래 살아가는 사람들에게 비트코인이 재정적 자유와 주권을 실현하는 강력한 도구임을 알리는 대표적인 목소리로 활동하고 있다.\n\n그는 코스트로 재단(The Kostro Foundation)의 이사장을 맡고 있다. 이 재단은 미국 세법상 501(c)(3) 비영리 단체로, 태국의 소외 계층 커뮤니티에 교육과 비트코인 이해 교육 프로그램을 제공하고 있다. 세계 곳곳의 대회에 출전해 온 열정적인 울트라마라톤 러너이기도 한 코스트로는, 트레일 위에서의 인내와 비트코인의 장기적 회복력 사이에서 강렬한 공통점을 즐겨 끌어낸다. 비트코인 MENA, 비트코인 베이거스, BTC 프라하, 비트코인 아시아 등 주요 행사의 주목받는 연사로서, 그는 무대마다 자유에 초점을 맞춘 설득력 있는 관점을 펼쳐 보인다.",
        lectureTitle: "아시아 최대의 프리덤 브랜드를 만들다",
      },
    },
  },
  {
    slug: "nedalba",
    image: "/2026/speakers/Nedalba.webp",
    difficulty: "Low",
    links: [
      {
        type: "youtube",
        url: "https://www.youtube.com/channel/UCT_RhM-i6or1qS1JRm4Bqrw",
      },
      { type: "x", url: "https://x.com/nldd21" },
    ],
    i18n: {
      en: {
        title: "NLDD",
        subtitle: ["Bitcoin YouTuber"],
        bio: "NLDD is a Bitcoin YouTuber and translator. He translated 'The Blocksize War' and 'The Bitcoin Standard' into Korean, helping bring foundational Bitcoin literature to Korean readers.",
        lectureTitle: "",
      },
      ko: {
        title: "네딸바",
        subtitle: ["유튜버"],
        bio: "네딸바는 비트코인 유튜버이자 번역가다. 'The Blocksize War'와 'The Bitcoin Standard(달러는 어떻게 세계를 지배하게 되었는가)'를 우리말로 옮기며, 비트코인의 대표적인 저작들을 한국 독자들에게 소개해 왔다.",
        lectureTitle: "",
      },
    },
  },
  {
    slug: "rama-gan",
    image: "/2026/speakers/Rama_Gan.webp",
    difficulty: "Low",
    links: [
      { type: "website", url: "https://v1.penlock.io/en/" },
      { type: "nostr", url: "https://nosta.me/nostr@penlock.io" },
    ],
    i18n: {
      en: {
        title: "Rama Gan",
        subtitle: ["Creator of Penlock"],
        bio: "Rama is a software engineer and Bitcoiner who has devoted himself to making the future of self-custody simpler and more robust. The tool he created, Penlock, is a printable encryption wheel that lets anyone split a seed phrase into a 2-of-3 multi-phrase backup using nothing but paper and pen — no electronics required. Because only two of the three pieces are needed to recover assets, the setup stays secure even if one is lost or stolen, and a breach of any single location never exposes the whole. Most importantly, even if the original mnemonic (seed phrase) is lost entirely, the full seed phrase can be reconstructed from any two of the three pieces using the Penlock wheel. This lets users design remote recovery and inheritance plans on their own, without relying on any company or third party. No power, no battery, and no internet connection is required — Rama has focused on 'low-tech' solutions that anyone can hold in their hands and use directly, rather than flashy technology. His work is an attempt to realize Bitcoin's ideal of 'being your own bank' without compromising on privacy, security, or sovereignty.",
        lectureTitle: "Trust-Minimized Bitcoin Inheritance — Magic on Paper",
        session: "Workshop",
      },
      ko: {
        title: "Rama Gan",
        subtitle: ["Penlock 개발자"],
        bio: "라마(Rama)는 자가 수탁(self-custody)의 미래를 더 단순하고 견고하게 만드는 일에 몰두해 온 소프트웨어 엔지니어이자 비트코이너입니다. 그가 만든 펜록(Penlock)은 인쇄해서 사용할 수 있는 암호화 휠로, 전자기기 없이 종이와 펜만으로 시드 문구를 2-of-3 멀티프레이즈 백업으로 직접 나눌 수 있게 해주는 도구입니다. 세 조각 중 두 개만 있으면 자산을 복구할 수 있기 때문에, 하나를 분실하거나 도난당해도 안전하며 어느 한 곳이 뚫려도 전체가 노출되지 않습니다. 무엇보다 원본 니모닉(시드 문구)을 통째로 잃어버려도, 세 조각 중 두 개만 남아 있으면 펜록 휠로 다시 시드 문구 전체를 복원해낼 수 있다는 점이 핵심입니다. 덕분에 사용자는 특정 기업이나 제3자에 의존하지 않고 원격지 복구와 상속 계획까지 스스로 설계할 수 있습니다. 전원도, 배터리도, 인터넷 연결도 필요 없으며, 라마는 화려한 기술보다 누구나 손에 쥐고 직접 써볼 수 있는 '로우테크' 해법에 주목해 왔습니다. 그의 작업은 '스스로 자신의 은행이 되라'는 비트코인의 이상을 프라이버시·보안·주권 어느 하나도 타협하지 않으면서 실현하려는 시도입니다.",
        lectureTitle: "신뢰를 최소화한 비트코인 상속 — 종이 위의 마법",
        session: "워크숍",
      },
    },
  },
  {
    slug: "matthew-vuk",
    image: "/2026/speakers/Matthew_Vuk.webp",
    difficulty: "Medium",
    links: [
      { type: "website", url: "https://second.tech/" },
      { type: "x", url: "https://x.com/matthewvuk2" },
    ],
    i18n: {
      en: {
        title: "Matthew Vuk",
        subtitle: ["Protocol Researcher, Second"],
        bio: "Based in Waterloo, Canada, Matthew Vuk works as a researcher at Second, the company developing Ark, a Bitcoin Layer 2 payment protocol. Ark is a Layer 2 protocol that aims to enable off-chain Bitcoin transactions at very low cost, without complex pre-setup such as opening channels. It works directly on top of today's Bitcoin without consensus rule changes or new op_codes, offering easy onboarding, low and predictable fees, instant settlement, Lightning Network compatibility, and control over one's own funds. The protocol revolves around an 'Ark server': users connect to this server to transact directly with one another, and can also transact with the broader Lightning Network through the server's Lightning gateway. At the heart of Ark is a new scaling model called the 'virtual UTXO (VTXO)' — a series of pre-signed off-chain transactions that a user can broadcast on-chain to reclaim their funds at any time in an emergency.",
        lectureTitle: "Ark: Making Bitcoin Everyday Money",
      },
      ko: {
        title: "Matthew Vuk",
        subtitle: ["Protocol Researcher, Second"],
        bio: "Matthew Vuk은 캐나다 워털루를 기반으로, 비트코인 2계층 결제 프로토콜 Ark를 개발하는 회사 Second에서 리서처로 일하고 있습니다. Ark는 채널 개설 같은 복잡한 사전 설정 없이 매우 낮은 비용으로 오프체인 비트코인 거래를 가능하게 하는 것을 목표로 하는 레이어 2 프로토콜입니다. Ark는 합의 규칙 변경이나 새로운 op_code 없이 오늘날의 비트코인 위에서 바로 작동하며, 간편한 온보딩, 낮고 예측 가능한 수수료, 즉각적인 결제, 라이트닝 네트워크 호환, 그리고 자기 자금에 대한 통제권을 제공합니다. 이 프로토콜은 'Ark 서버'를 중심으로 동작하는데, 사용자는 이 서버에 연결해 서로 직접 거래하고, 서버의 라이트닝 게이트웨이를 통해 더 넓은 라이트닝 네트워크와도 거래할 수 있습니다. Ark의 핵심은 '가상 UTXO(VTXO)'라는 새로운 확장 모델로, VTXO는 사용자가 비상시 언제든 온체인으로 자금을 회수하기 위해 브로드캐스트할 수 있는 일련의 사전 서명된 오프체인 거래입니다.",
        lectureTitle: "비트코인을 일상 화폐로 만드는 Ark 이야기",
      },
    },
  },
  {
    slug: "robin",
    image: "/2026/speakers/Robin.webp",
    difficulty: "Low",
    links: [
      {
        type: "website",
        url: "https://www.satlantis.io/p/npub1n49a5d4r3ha3e25nam6rcr075g0eyh9n3cenhaapxuz4zzuqkszspqazdd",
      },
      { type: "x", url: "https://x.com/bitcoinpusan" },
    ],
    i18n: {
      en: {
        title: "Robin",
        subtitle: ["Founder, Bitcoin in Pusan"],
        bio: "Robin is a European-born developer who has lived in Korea for more than five years, and the founder of 'Bitcoin in Pusan,' a Busan-based Bitcoin community. Before starting Bitcoin in Pusan, he worked as an open-source developer in the ecash space, contributing to Bitcoin ecosystem projects, and has long been interested in connecting Bitcoin technology to the lives of real users. He created Bitcoin in Pusan at a time when the region had no Bitcoin community at all; within just one year of its launch, it grew into a community with regular meetups, lectures, workshops, and events — as well as its own physical space. At this conference, Robin will share the experiences and lessons he gained over the past year building Bitcoin in Pusan, and will talk about how anyone can build their own Bitcoin network.",
        lectureTitle: "Bitcoin in Busan",
      },
      ko: {
        title: "Robin",
        subtitle: ["BiP 설립자"],
        bio: "Robin은 한국에 5년 넘게 거주해 온 유럽 출신 개발자이자, 부산 기반 비트코인 커뮤니티 'Bitcoin in Pusan'의 설립자다. 그는 'Bitcoin in Pusan'을 시작하기 전까지 ecash 분야의 오픈소스 개발자로서 비트코인 생태계 프로젝트에 참여해 왔으며, 비트코인 기술을 실제 사용자의 삶에 연결하는 데 오랜 관심을 기울여 왔다. 'Bitcoin in Pusan'은 지역에 비트코인 커뮤니티가 전무하던 상황에서 그가 직접 만든 모임으로, 출범 1년 만에 정기 모임과 강의, 워크숍, 각종 행사는 물론 자체 물리적 공간까지 갖춘 커뮤니티로 성장했다. 이번 컨퍼런스에서 Robin은 지난 1년간 'Bitcoin in Pusan'을 일구며 얻은 경험과 교훈을 공유하고, 누구나 자신만의 비트코인 네트워크를 구축할 수 있다는 점을 이야기할 예정이다.",
        lectureTitle: "부산의 비트코인",
      },
    },
  },
  {
    slug: "spector",
    image: "/2026/speakers/Spector.webp",
    difficulty: "Low",
    links: [],
    i18n: {
      en: {
        title: "Spector",
        subtitle: ["Bitcoin Korea Conference Host"],
        bio: "Spector is a Bitcoiner who has devoted himself to building up Korea's Bitcoin community on a solid foundation. He has consistently held offline meetups to grow the domestic community, and personally runs education programs for newcomers encountering Bitcoin for the first time. By planning and building out the (former) Bitcoin Mini Conference — the largest 'Bitcoin only' event in Korea — he proved firsthand what the power of community can be. He has also taken the stage as a speaker at overseas conferences, bringing diverse cultures from abroad into Korea while serving as a bridge that introduces Korea's Bitcoin industry to the world. Rather than flashy discourse, he has steadily devoted himself to the 'work on the ground' — helping people gather, learn, and take sovereignty over their own assets in person. His path is bringing Bitcoin's ideals to bloom in the language of community, on Korean soil.",
        lectureTitle: "",
      },
      ko: {
        title: "스펙터",
        subtitle: ["Bitcoin Korea Conference 호스트"],
        bio: "스펙터는 한국 비트코인 커뮤니티를 단단하게 키워내는 일에 몰두해 온 비트코이너입니다. 그는 국내 커뮤니티 빌딩을 위해 오프라인 모임을 꾸준히 열어 왔으며, 비트코인을 처음 접하는 일반인을 위한 교육도 직접 진행하고 있습니다. 국내 최대 규모의 '비트코인 온리' 행사인 (구)비트코인 미니 컨퍼런스를 기획하고 일궈내며 커뮤니티의 힘이 무엇인지를 몸소 증명해 보였습니다. 또한 해외 컨퍼런스에 연사로 참가하여 다양한 해외의 문화를 한국으로 들여오는 한편, 한국의 비트코인 산업을 세계에 알리는 가교 역할을 함께 해 왔습니다. 화려한 담론보다 사람들이 직접 모이고, 배우고, 스스로 자기 자산의 주권을 쥐도록 돕는 '현장의 일'에 꾸준히 천착해 온 인물입니다. 그의 행보는 비트코인의 이상을, 한국이라는 토양 위에서 커뮤니티의 언어로 피워내고 있습니다.",
        lectureTitle: "",
      },
    },
  },
  {
    slug: "jm",
    image: "/2026/speakers/JM.webp",
    difficulty: "Medium",
    links: [{ type: "x", url: "https://x.com/zappiwallet" }],
    i18n: {
      en: {
        title: "JM",
        subtitle: ["Co-Founder, Zappi Wallet"],
        bio: "JM built Zappi, an ecash wallet, and works as an open-source project developer — contributing in particular to the decentralized platforms Nostr and ecash.\n\nHe runs Bitcoin in Pusan, where he continues to work on Bitcoin adoption and community building.\n\nHe believes it is possible to deliver an easy-to-use Bitcoin experience and privacy at the same time, and explores that intersection from both the development and the community side.",
        lectureTitle:
          "Vanishing Financial Privacy: The Age of Controlled Money",
      },
      ko: {
        title: "JM",
        subtitle: ["Zappi Wallet 공동 창업자"],
        bio: "이캐시 지갑 째피(Zappi)를 개발했으며 오픈소스 프로젝트 개발자로 활동하며 특히 탈중앙화 플랫폼인 노스터(Nostr)와 이캐시에 많은 기여를 하고 있습니다.\n\nBitcoin in Pusan을 운영하며 비트코인의 어답션과 커뮤니티 형성을 주제로 활동을 이어가고 있습니다.\n\n사용하기 쉬운 비트코인 경험과 프라이버시를 동시에 달성하는 것이 가능하다고 믿으며, 그 접점을 개발과 커뮤니티 양쪽에서 탐구하고 있습니다.",
        lectureTitle: "사라지는 금융 프라이버시, 통제되는 돈의 시대",
      },
    },
  },
  {
    slug: "shaun",
    image: "/2026/speakers/Shaun.webp",
    difficulty: "Low",
    links: [
      { type: "website", url: "https://mybitcoinhouse.com/en" },
      { type: "x", url: "https://x.com/shauntime" },
    ],
    i18n: {
      en: {
        title: "Shaun",
        subtitle: ["Founder, Bitcoin House Malaysia", "Partner, YakiHonne"],
        bio: "Shaun is the founder of Bitcoin House Malaysia, an HRF-supported Bitcoin education hub in Kuala Lumpur, and a partner at YakiHonne, a decentralized social media platform built on Nostr, with integrated Bitcoin wallet features and grant backing from HRF and OpenSats.\n\nHis work focuses on Bitcoin education, merchant onboarding, developer communities, and practical Bitcoin adoption across Southeast Asia. Having worked across Greater China and Southeast Asia, he believes the Global South needs sovereign tools, not just better fintech. Over the years, he has helped connect more than 50 native Bitcoin communities on the ground and more than 500 online Bitcoin communities globally.\n\nBased in Kuala Lumpur and deeply rooted in its Bitcoin community, Shaun works to connect Asian Bitcoin communities with the wider freedom tech movement.",
        lectureTitle: "Bitcoin Communities in Asia",
      },
      ko: {
        title: "Shaun",
        subtitle: ["Bitcoin House Malaysia 창립자", "YakiHonne 파트너"],
        bio: "숀(Shaun)은 쿠알라룸푸르에 자리한 HRF 지원 비트코인 교육 허브 '비트코인 하우스 말레이시아(Bitcoin House Malaysia)'의 창립자이자, 노스터(Nostr) 기반의 탈중앙 소셜 미디어 플랫폼 야키혼네(YakiHonne)의 파트너다. 야키혼네는 비트코인 지갑 기능을 통합하고 있으며 HRF와 오픈사츠(OpenSats)의 그랜트 지원을 받고 있다.\n\n그의 활동은 비트코인 교육, 가맹점 온보딩, 개발자 커뮤니티, 그리고 동남아시아 전역의 실질적인 비트코인 어답션에 초점을 맞추고 있다. 중화권과 동남아시아를 오가며 일해 온 그는, 글로벌 사우스에 필요한 것은 더 나은 핀테크가 아니라 주권을 지킬 수 있는 도구라고 믿는다. 지난 몇 년간 그는 현장에서 50개가 넘는 로컬 비트코인 커뮤니티와 전 세계 500개가 넘는 온라인 비트코인 커뮤니티를 잇는 데 힘을 보태 왔다.\n\n쿠알라룸푸르를 기반으로 현지 비트코인 커뮤니티에 깊이 뿌리내린 숀은, 아시아의 비트코인 커뮤니티를 더 넓은 프리덤 테크(freedom tech) 운동과 연결하는 일에 힘쓰고 있다.",
        lectureTitle: "아시아 비트코인 커뮤니티",
      },
    },
  },
  {
    slug: "rob",
    image: "/2026/speakers/Rob.webp",
    difficulty: "Low",
    links: [
      { type: "nostr", url: "https://primal.net/BoltC" },
      { type: "website", url: "https://opensats.org" },
    ],
    i18n: {
      en: {
        title: "Rob",
        subtitle: ["OpenSats Operations"],
        bio: "Rob (Robos) is Head of Operations at OpenSats. OpenSats is a U.S. public-benefit non-profit that funds Bitcoin and related free and open-source (FOSS) projects, structured so that no part of a donation is taken for overhead — every dollar goes to developers, designers, researchers, and educators. Drawing on a career as a software project manager in many parts of the world, he oversees the day-to-day operations of OpenSats' grant programs. He currently lives in Japan, where he works to grow Bitcoin and Nostr adoption, and also runs 'Bush Bash Japan,' a Japanese Bitcoin community event.",
        lectureTitle: "",
      },
      ko: {
        title: "Rob",
        subtitle: ["OpenSats 운영 총괄"],
        bio: "롭(Robos)은 오픈사츠(OpenSats)의 운영 총괄이다. 오픈사츠는 비트코인 및 관련 자유·오픈소스(FOSS) 프로젝트에 자금을 지원하는 미국의 비영리 공익재단으로, 기부금에서 운영비를 떼지 않고 전액을 개발자·디자이너·연구자·교육자에게 전달하는 구조로 운영된다. 그는 세계 각지에서 소프트웨어 프로젝트 매니저로 일해 온 경력을 바탕으로 오픈사츠의 그랜트 운영 실무를 총괄하고 있으며, 현재 일본에 거주하며 일본 내 비트코인·노스트르 확산에 힘쓰고 있다. 일본의 비트코인 커뮤니티 행사 'Bush Bash Japan'도 운영한다.",
        lectureTitle: "",
      },
    },
  },
  {
    slug: "teruko",
    image: "/2026/speakers/Teruko.webp",
    difficulty: "Low",
    links: [{ type: "x", url: "https://x.com/Teruko21M" }],
    i18n: {
      en: {
        title: "Teruko",
        subtitle: ["LHB Founder"],
        bio: "Teruko Neriki is a Bitcoin advocate focused on financial freedom and adoption across Asia, with a particular emphasis on empowering young women. She spent four years leading Japan initiatives for Fulgur Ventures, during which she launched Tokyo Bitcoin Base and organized BITCOIN JAPAN 2025 and Bitcoin Tokyo 2024.\n\nDedicated to making Bitcoin philosophy accessible, Teruko is the creator of lostinbitcoin.jp and the Japanese translator of The Bitcoin Standard, The Bullish Case for Bitcoin, The Little Bitcoin Book, and Check Your Financial Privilege.\n\nHer early career includes product marketing and business development at Sony. She holds an MBA from Georgetown University.\n\nIn 2017, Japan accounted for nearly 60% of global Bitcoin trading and became the first country to establish a regulatory framework for Bitcoin. Japan was destined to be the Bitcoin capital of the world.\n\nAfter eight years in the trenches—co-hosting meetups, translating books, launching a 1,300 m² hub, and running conferences—Teruko shares an unfiltered operator's post-mortem: what worked, what didn't, and what the experience taught her about the limits of education, infrastructure, and institutional scale. Most importantly, she explains why she eventually walked away from Japan—not because she stopped believing in Bitcoin, but because she realized she was solving the wrong problem in the wrong market.",
        lectureTitle: "Pushing Adoption in Japan: What Worked and What Didn't",
      },
      ko: {
        title: "Teruko",
        subtitle: ["LHB 창립자"],
        bio: "테루코 네리키(Teruko Neriki)는 아시아 전역의 금융 자유와 비트코인 어답션에 집중해 온 비트코인 옹호자로, 특히 젊은 여성들에게 힘을 실어주는 일에 무게를 두고 있다. 그는 4년간 풀구르 벤처스(Fulgur Ventures)의 일본 사업을 이끌며 도쿄 비트코인 베이스(Tokyo Bitcoin Base)를 출범시키고 BITCOIN JAPAN 2025와 Bitcoin Tokyo 2024를 기획·운영했다.\n\n비트코인의 철학을 누구나 이해할 수 있게 만드는 일에 힘써 온 테루코는 lostinbitcoin.jp를 만들었으며, 『달러는 어떻게 세계를 지배하게 되었는가(The Bitcoin Standard)』, 『The Bullish Case for Bitcoin』, 『The Little Bitcoin Book』, 『Check Your Financial Privilege』를 일본어로 옮긴 번역가이기도 하다.\n\n커리어 초기에는 소니(Sony)에서 제품 마케팅과 사업 개발을 담당했다. 조지타운 대학교에서 MBA를 취득했다.\n\n2017년 일본은 전 세계 비트코인 거래량의 60% 가까이를 차지했고, 세계 최초로 비트코인 규제 체계를 마련한 나라가 되었다. 일본은 세계 비트코인의 수도가 될 운명처럼 보였다.\n\n이번 발표에서 테루코는 밋업 공동 주최, 책 번역, 1,300㎡ 규모의 허브 출범, 컨퍼런스 운영까지 8년간 현장에서 부딪혀 온 운영자로서 가감 없는 회고를 들려준다. 무엇이 통했고 무엇이 통하지 않았는지, 그리고 그 경험을 통해 교육·인프라·기관 규모 확장의 한계에 대해 무엇을 배웠는지를 이야기한다. 무엇보다 그가 결국 일본을 떠난 이유를 설명한다. 비트코인에 대한 믿음을 잃어서가 아니라, 잘못된 시장에서 잘못된 문제를 풀고 있었다는 사실을 깨달았기 때문이다.",
        lectureTitle:
          "일본에서 비트코인 어답션을 밀어붙이며: 통한 것과 통하지 않은 것",
      },
    },
  },
  {
    slug: "hope",
    image: "/2026/speakers/Hope.webp",
    difficulty: "Low",
    links: [{ type: "x", url: "https://x.com/KopayHope" }],
    i18n: {
      en: {
        title: "HOPE",
        subtitle: ["Kopay Founder"],
        bio: "Founder of Kopay, a Bitcoin cashback service.\n\nI want to build a world where people can protect those they hold dear and dream of hope for tomorrow.\n\nI found the answer in Bitcoin, and I created Kopay to connect that value to everyday life.\n\nBy making it as easy as possible for anyone to stack Bitcoin, I want to lead its adoption and bring the future of the Bitcoin standard closer.",
        lectureTitle: "",
      },
      ko: {
        title: "HOPE",
        subtitle: ["Kopay 창업자"],
        bio: "비트코인 캐시백 서비스 Kopay 창업자입니다.\n\n소중한 사람을 지키고 내일의 희망을 꿈꾸는 세상을 만들고 싶습니다.\n\n그 해답을 비트코인에서 찾았고, 이 가치를 대중의 삶에 연결하기 위해 코페이를 만들었습니다.\n\n누구나 비트코인을 가장 쉽게 모을 수 있도록 대중화를 이끌며, 비트코인 스탠다드의 미래를 앞당기겠습니다.",
        lectureTitle: "",
      },
    },
  },
  {
    slug: "misha-komarov",
    image: "/2026/speakers/Misha_Komarov.webp",
    difficulty: "High",
    links: [
      { type: "website", url: "https://www.allocinit.xyz" },
      { type: "x", url: "https://x.com/nemothenoone" },
    ],
    i18n: {
      en: {
        title: "Misha Komarov",
        subtitle: ["[[alloc] init] Founder"],
        bio: "Misha Komarov is the Founder and CEO of [[alloc] init], a cryptography research and development company advancing Bitcoin through applied cryptography. She is the lead author of Bitcoin PIPEs v2, a witness encryption-based scheme demonstrating how covenants, non-interactive zero-knowledge proofs, and privacy-preserving applications can be brought to Bitcoin without protocol changes.\n\nPreviously, Misha founded =nil; Foundation, where she led research spanning zero-knowledge proofs and cryptographic infrastructure, and she was an early member of the founding team behind Lido, the leading liquid staking protocol.",
        lectureTitle: "Bringing Privacy to Bitcoin L1 via PIPEs",
      },
      ko: {
        title: "Misha Komarov",
        subtitle: ["[[alloc] init] 창립자"],
        bio: "미샤 코마로프(Misha Komarov)는 응용 암호학으로 비트코인을 발전시키는 암호학 연구·개발 기업 [[alloc] init]의 창립자이자 CEO다. 그는 프로토콜 변경 없이도 비트코인에 커버넌트(covenant)와 비대화형 영지식 증명(NIZK), 프라이버시 보호 애플리케이션을 도입할 수 있음을 보인 위트니스 암호화(witness encryption) 기반 설계 'Bitcoin PIPEs v2'의 주 저자다.\n\n이전에는 =nil; Foundation을 창업해 영지식 증명부터 암호 인프라에 이르는 연구를 이끌었으며, 대표적인 리퀴드 스테이킹 프로토콜 Lido의 창업 초기 멤버로도 참여했다.",
        lectureTitle: "PIPEs로 비트코인 L1에 프라이버시를 더하다",
      },
    },
  },
  {
    slug: "marek-feder",
    image: "/2026/speakers/Marek_Feder.webp",
    difficulty: "Low",
    links: [
      { type: "website", url: "https://www.amityage.com/education-page" },
      {
        type: "linkedin",
        url: "https://www.linkedin.com/in/marek-feder-5b911a15a",
      },
    ],
    i18n: {
      en: {
        title: "Marek Feder",
        subtitle: ["AmityAge, Head of Education"],
        bio: "Bitcoin educator and former central bank insider on a mission to welcome 100 million people into Bitcoin rabbit hole. As Head of Education at AmityAge, he builds curriculums and delivers different academies, such as Bitcoin Educators Academy — a global program training Bitcoin educators. He also helps Bitcoin companies with internal and external communication. At this conference, he'll be speaking on \"How to Handle Bitcoin Objections\" — giving a practical framework for better communication not only in Bitcoin, but in your everyday life.",
        lectureTitle: "How to Handle Bitcoin Objections",
      },
      ko: {
        title: "Marek Feder",
        subtitle: ["AmityAge 교육 총괄"],
        bio: "마렉 페데르(Marek Feder)는 비트코인 교육자이자 전직 중앙은행 내부자로, 1억 명을 비트코인의 세계로 안내하겠다는 목표를 품고 활동하고 있다. AmityAge의 교육 총괄로서 커리큘럼을 설계하고, 전 세계 비트코인 교육자를 양성하는 프로그램인 '비트코인 에듀케이터 아카데미(Bitcoin Educators Academy)'를 비롯한 여러 아카데미를 운영한다. 또한 비트코인 기업들의 대내외 커뮤니케이션을 돕고 있다. 이번 컨퍼런스에서는 '비트코인에 대한 반론에 답하는 법'을 주제로, 비트코인은 물론 일상에서도 통하는 실용적인 커뮤니케이션 프레임워크를 제시할 예정이다.",
        lectureTitle: "비트코인에 대한 반론에 답하는 법",
      },
    },
  },
  {
    slug: "piriya-sambandaraksa",
    image: "/2026/speakers/Piriya_Sambandaraksa.webp",
    difficulty: "Low",
    links: [
      { type: "website", url: "https://www.rightshift.to/" },
      { type: "x", url: "https://x.com/piriya" },
    ],
    i18n: {
      en: {
        title: "Piriya Sambandaraksa",
        subtitle: ["Right Shift, CEO and Co-Founder"],
        bio: "Piriya Sambandaraksa is a prominent Bitcoin educator and the CEO & Co-Founder of Rightshift, an organization dedicated to Bitcoin media, translation, and education. Active in the space since 2014, he has spent over a decade teaching macroeconomic structures, Austrian economics, and technical self-sovereignty. His efforts are focused on creating localized, accessible educational pipelines that drive real-world, bottom-up monetary adoption. In addition to media production, he consults with institutions and individuals on multi-signature security and long-term asset preservation. He continues to advocate for grassroots educational models as the most effective path to lasting economic change.",
        lectureTitle:
          "Orangepilling a country: a bottom up approach to shifting the overton window.",
      },
      ko: {
        title: "Piriya Sambandaraksa",
        subtitle: ["Right Shift 공동 창업자 겸 CEO"],
        bio: "피리야 삼반다락사(Piriya Sambandaraksa)는 태국을 대표하는 비트코인 교육자이자, 비트코인 미디어·번역·교육에 전념하는 조직 라이트시프트(Rightshift)의 공동 창업자 겸 CEO다. 2014년부터 이 분야에서 활동하며 10년 넘게 거시경제 구조와 오스트리안 경제학, 기술적 자기주권을 가르쳐 왔다. 그의 활동은 현지화되고 누구나 접근할 수 있는 교육 파이프라인을 만들어, 현실 세계에서 상향식 화폐 채택을 이끌어내는 데 초점이 맞춰져 있다. 미디어 제작과 더불어 기관과 개인을 대상으로 멀티시그 보안과 장기 자산 보존에 대한 자문도 이어가고 있다. 그는 지속적인 경제적 변화로 가는 가장 효과적인 길로서 풀뿌리 교육 모델을 꾸준히 주창하고 있다.",
        lectureTitle: "한 나라를 오렌지필하다: 오버톤 창을 옮기는 상향식 접근",
      },
    },
  },
  {
    slug: "pacman",
    image: "/2026/speakers/Pacman.webp",
    difficulty: "Low",
    links: [
      { type: "x", url: "https://x.com/DIYbitcoin" },
      { type: "github", url: "https://github.com/selfcustody/krux" },
    ],
    i18n: {
      en: {
        title: "Pacman",
        subtitle: ["Founder, DIYbitcoin"],
        bio: "DIYbitcoin is someone who has been on the ground through the history of Bitcoin wallets. He began his career as the first employee at Samourai Wallet, the emblem of privacy wallets, and later worked at Wasabi Wallet as well — a rare track record of having been inside both pillars of Bitcoin privacy wallets.\n\nSince 2020, through DIYbitcoin, the education brand that became his name, he has been shining a light on the DIY hardware projects of Bitcoin developers who work without a marketing budget — because it seemed a waste for good open-source projects to be buried in obscurity. As an early user of Krux, the open-source hardware signing device, he took on testing and marketing and grew alongside the project, and his DIYbitcoin Telegram community even became the point of contact through which one of Krux's core developers joined the project.\n\nThat you can contribute to the open-source ecosystem without writing code, and that anyone can build their own self-custody device — these are the two things he has proven over years spent in the wallet industry.",
        lectureTitle: "DIY Bitcoin Ecosystem",
      },
      ko: {
        title: "Pacman",
        subtitle: ["Founder, DIYbitcoin"],
        bio: "DIYbitcoin은 비트코인 지갑의 역사를 현장에서 함께 해온 사람이다. 프라이버시 지갑의 상징이었던 사무라이 월렛(Samourai Wallet)의 첫 번째 직원으로 커리어를 시작했고, 이후 와사비 월렛(Wasabi Wallet)에서도 일했다. 비트코인 프라이버시 지갑의 두 축을 모두 내부에서 경험한 흔치 않은 이력이다.\n\n2020년부터는 자신의 이름이 된 교육 브랜드 DIYbitcoin을 통해, 좋은 오픈소스 프로젝트가 알려지지 않은 채 묻히는 것이 아까워서 마케팅 예산 없이 활동하는 비트코인 개발자들의 DIY 하드웨어 프로젝트를 알려왔다. 오픈소스 하드웨어 서명 장치 Krux의 초기 사용자로서 테스트와 마케팅을 담당하며 프로젝트의 성장에 함께했고, 그의 DIYbitcoin 텔레그램 커뮤니티는 Krux의 핵심 개발자가 프로젝트에 합류하는 접점이 되기도 했다.\n\n코드를 쓰지 않아도 오픈소스 생태계에 기여할 수 있다는 것, 그리고 누구나 자가수탁 장치를 직접 만들 수 있다는 것은 그가 지갑 업계에서 보낸 수년의 시간으로 증명해온 두 가지다.",
        lectureTitle: "DIY 비트코인 생태계",
      },
    },
  },
  {
    slug: "alex-li",
    image: "/2026/speakers/Alex_Li.webp",
    difficulty: "Low",
    links: [
      { type: "website", url: "https://hrf.org" },
      { type: "x", url: "https://x.com/AlexLi98" },
    ],
    i18n: {
      en: {
        title: "Alex Li",
        subtitle: ["Human Rights Foundation, Bitcoin Development Lead"],
        bio: "Alex Li is the Bitcoin Development Lead at the Human Rights Foundation. He works on the Bitcoin Development Fund, interfacing with developers to build easier to use and more powerful tools for activists, hosting workshops, and helping with planning financial freedom content at the Oslo Freedom Forum. In his spare time, he enjoys snowboarding, offroading, and exploring the great outdoors.",
        lectureTitle: "CBDCs and Bitcoin",
      },
      ko: {
        title: "Alex Li",
        subtitle: ["Human Rights Foundation 비트코인 개발 총괄"],
        bio: "알렉스 리(Alex Li)는 인권재단(Human Rights Foundation)의 비트코인 개발 총괄이다. 그는 비트코인 개발 기금(Bitcoin Development Fund)을 맡아 개발자들과 소통하며 활동가들이 더 쉽고 강력하게 쓸 수 있는 도구를 만드는 일을 돕고, 워크숍을 열며, 오슬로 프리덤 포럼(Oslo Freedom Forum)의 금융 자유 관련 콘텐츠 기획에도 참여하고 있다. 여가 시간에는 스노보드와 오프로드 주행을 즐기며 대자연을 탐험하는 것을 좋아한다.",
        lectureTitle: "CBDC와 비트코인",
      },
    },
  },
  {
    slug: "carl-dong",
    image: "/2026/speakers/Carl_Dong.webp",
    difficulty: "Medium",
    links: [
      { type: "website", url: "https://obscura.com/" },
      { type: "x", url: "https://x.com/obscuravpn" },
    ],
    i18n: {
      en: {
        title: "Carl Dong",
        subtitle: ["CEO, Obscura VPN"],
        bio: "Carl Dong is the founder and CEO of Obscura, a next-generation VPN service built to defend the open and private internet. Before founding Obscura, he was a Bitcoin Core developer at Chaincode, where he revamped Bitcoin Core's reproducible builds system to make it fully bootstrappable. A lifelong networking and systems engineering nerd, Carl spends his spare time tinkering with his homelab setup.",
        lectureTitle: "",
      },
      ko: {
        title: "Carl Dong",
        subtitle: ["Obscura VPN 대표"],
        bio: "칼 동(Carl Dong)은 열리고 사적인 인터넷을 지키기 위해 만들어진 차세대 VPN 서비스 Obscura의 창립자이자 CEO다. Obscura를 세우기 전에는 체인코드(Chaincode)에서 비트코인 코어 개발자로 일하며, 비트코인 코어의 재현 가능 빌드(reproducible builds) 시스템을 전면 개편해 완전한 부트스트래핑이 가능하도록 만들었다. 오래도록 네트워크와 시스템 엔지니어링에 빠져 살아온 그는 여가 시간에도 홈랩(homelab) 환경을 손보며 시간을 보낸다.",
        lectureTitle: "",
      },
    },
  },
  {
    slug: "piccolo",
    image: "/2026/speakers/Piccolo.webp",
    difficulty: "Low",
    links: [
      { type: "x", url: "https://x.com/bobspace_bkk" },
      { type: "website", url: "https://www.bobspaces.net" },
    ],
    i18n: {
      en: {
        title: "Piccolo",
        subtitle: ["Founder, BOB Space Bangkok"],
        bio: "Piccolo is the Founder and Chief Volunteer at BOB (Build On Bitcoin) Space Bangkok. BOB Space, founded in August 2022, is a physical Bitcoin-only builder space that hosts regular meetups and workshops, in addition to sponsoring 4 previous FOSS Residency cohorts. Outside BOB Space, Piccolo runs a fintech firm he founded in 2016, and had an 18-year career in corporate finance prior to that.",
        lectureTitle: "Energy Transitions and Bitcoin Mining",
      },
      ko: {
        title: "Piccolo",
        subtitle: ["BOB Space Bangkok 창립자"],
        bio: "피콜로(Piccolo)는 방콕의 BOB(Build On Bitcoin) 스페이스 창립자이자 최고 자원봉사자(Chief Volunteer)다. 2022년 8월 문을 연 BOB 스페이스는 비트코인 온리 빌더들을 위한 오프라인 공간으로, 정기 밋업과 워크숍을 열고 지금까지 FOSS 레지던시 네 개 기수를 후원해 왔다. BOB 스페이스 밖에서는 2016년 직접 창업한 핀테크 기업을 운영하고 있으며, 그전에는 18년간 기업 금융 분야에서 일했다.",
        lectureTitle: "에너지 전환과 비트코인 채굴",
      },
    },
  },
  {
    slug: "sergej-kotliar",
    image: "/2026/speakers/Sergej_Kotliar.webp",
    difficulty: "Low",
    links: [
      { type: "x", url: "https://x.com/ziggamon" },
      { type: "website", url: "https://www.bitrefill.com" },
    ],
    i18n: {
      en: {
        title: "Sergej Kotliar",
        subtitle: ["CEO, Bitrefill"],
        bio: "Sergej Kotliar is the founder and CEO of Bitrefill, a platform that helps people use Bitcoin for everyday purchases. Since 2014, Bitrefill has served more than one million customers across more than 180 countries. Sergej has helped pioneer commercial Lightning payments and Lightning-native services. He speaks about Bitcoin payments, merchant adoption, and building a circular Bitcoin economy.",
        lectureTitle: "",
      },
      ko: {
        title: "Sergej Kotliar",
        subtitle: ["Bitrefill 대표"],
        bio: "세르게이 코틀리아르(Sergej Kotliar)는 사람들이 일상적인 소비에 비트코인을 쓸 수 있도록 돕는 플랫폼 비트리필(Bitrefill)의 창립자이자 CEO다. 2014년 이후 비트리필은 180개국이 넘는 나라에서 100만 명 이상의 고객을 맞이해 왔다. 그는 상용 라이트닝 결제와 라이트닝 네이티브 서비스의 길을 앞장서 열어 온 인물로, 비트코인 결제와 상점의 도입, 그리고 순환하는 비트코인 경제를 만드는 일에 대해 이야기한다.",
        lectureTitle: "",
      },
    },
  },
  {
    slug: "billy-jo",
    image: "/2026/speakers/Billy_Jo.webp",
    difficulty: "Low",
    links: [
      { type: "x", url: "https://x.com/bjunjo" },
      { type: "website", url: "https://bjunjo.com" },
    ],
    i18n: {
      en: {
        title: "Billy Jo",
        subtitle: ["Bitcoin Treasury Company Investor and Essayist"],
        bio: "Billy Jo is a tech investor and writer. He writes about Bitcoin and other big ideas at bjunjo.com and on Substack (빌리조의 생각). Previously, he worked in business development in Silicon Valley. After more than a decade in the United States, he returned to Korea, where he mainly writes for Korean investors about US tech and Bitcoin treasury companies.",
        lectureTitle:
          "Keys, Companies, and Coldcard: Rethinking Bitcoin Custody",
        session: "Debate",
      },
      ko: {
        title: "빌리조",
        subtitle: ["비트코인 트레저리 기업 투자자이자 에세이스트"],
        bio: "빌리조는 기술 투자자이자 작가입니다. 그는 개인 뉴스레터(빌리조의 생각)에서 비트코인과 기타 혁신적인 아이디어에 대한 글을 쓰고 있습니다. 이전에는 실리콘 밸리에서 사업 개발 담당자로 근무했습니다. 10년 이상 미국에서 생활한 후 한국으로 돌아와 주로 개인 투자자들을 위해 미국 기술 기업과 비트코인 트레저리 회사에 대한 글을 쓰고 있습니다.",
        lectureTitle: "키, 기업, 그리고 콜드카드: 비트코인 커스터디 다시 보기",
        session: "디베이트",
      },
    },
  },
  {
    slug: "dea-rezkitha",
    image: "/2026/speakers/Dea_Rezkitha.webp",
    difficulty: "Low",
    links: [
      { type: "website", url: "https://www.fedi.xyz/" },
      { type: "x", url: "https://x.com/dearezkitha" },
    ],
    i18n: {
      en: {
        title: "Dea Rezkitha",
        subtitle: ["Fedi Master SEA"],
        bio: "Dea Rezkitha is the Community Master of South East Asia for Fedi. Dea is the co-founder of the Indonesia Bitcoin Conference and the Indonesia Bitcoin Community. Prior to joining Fedi, she was also a Marketing Associate for South East Asia at Paxful and helped create content for the Indonesian local exchange's Bitcoin Education Academy. Dea has appeared on many podcasts, shows, and conferences to educate people about Bitcoin. In the past, Dea has experience in managing communication for global teams in Africa, Asia, and Latin America.",
        lectureTitle:
          "Whose Keys? The Third Option Between Self-Custody and the Exchange",
      },
      ko: {
        title: "Dea Rezkitha",
        subtitle: ["Fedi Master SEA"],
        bio: "데아 레즈키타(Dea Rezkitha)는 페디(Fedi)의 동남아시아 커뮤니티 마스터다. 인도네시아 비트코인 컨퍼런스(Indonesia Bitcoin Conference)와 인도네시아 비트코인 커뮤니티(Indonesia Bitcoin Community)의 공동 창립자이기도 하다. 페디에 합류하기 전에는 팍스풀(Paxful)에서 동남아시아 마케팅 어소시에이트로 일했으며, 인도네시아 현지 거래소가 운영하는 비트코인 교육 아카데미(Bitcoin Education Academy)의 콘텐츠 제작에도 참여했다. 여러 팟캐스트와 방송, 컨퍼런스에 출연하며 사람들에게 비트코인을 알려 왔고, 과거에는 아프리카·아시아·라틴아메리카의 글로벌 팀을 대상으로 커뮤니케이션을 관리한 경험도 있다.",
        lectureTitle: "키를 가진 사람. 거래소와 셀프커스터디 사이, 제 3의 선택지",
      },
    },
  },
  {
    slug: "akasha",
    image: "/2026/speakers/Akasha.webp",
    difficulty: "Low",
    links: [{ type: "website", url: "https://www.akashapay.co.kr" }],
    i18n: {
      en: {
        title: "Akasha",
        subtitle: ["CEO"],
        bio: "CEO of Akasha\nBitcoin investor\nFounder of Zen Therapy Natural Healing Center\nEarth traveler & wellness expert",
        lectureTitle:
          "Nomad Travel Culture Platforms and the Potential of the Bitcoin Ecosystem",
      },
      ko: {
        title: "Akasha",
        subtitle: ["CEO"],
        bio: "아카샤 CEO\n비트코인 투자자\n젠테라피 네츄럴 힐링센터 대표\n지구여행자 & 웰니스 전문가",
        lectureTitle: "노마드 여행 문화 플랫폼과 비트코인 생태계의 가능성",
      },
    },
  },
  {
    slug: "sea-of-corea",
    image: "/2026/speakers/Sea_of_Corea.webp",
    difficulty: "Medium",
    links: [
      { type: "website", url: "https://promenadecastle.com" },
      { type: "x", url: "https://x.com/PromenadeCastle" },
    ],
    i18n: {
      en: {
        title: "Sea of Corea",
        subtitle: ["Founder, BTCorea Grassroots Hash Force"],
        bio: "About 'Sea of Corea Decentralized Mining Cooperative'\n\nWe are dedicated to decentralizing the Republic of Korea and rebuilding it as a Bitcoin network state. Through the Proof of Work of grassroots Bitcoin mining, we aggregate local hashrate and strengthen the decentralized network. By practicing self-custody, running nodes, and mining, we empower individuals to achieve true on-chain Bitcoin sovereignty and independence.",
        lectureTitle:
          "Decentralize the Bitcoin - From a Bitaxe to the Sea of Hash",
      },
      ko: {
        title: "Sea of Corea",
        subtitle: ["BTCorea Grassroots Hash Force 창립자"],
        bio: "'Sea of Corea 탈중앙화 채굴 협동조합' 소개\n\n우리는 대한민국을 탈중앙화하고, 비트코인 네트워크 국가(Network State)로 재건하는 데 힘쓰고 있습니다. 풀뿌리 비트코인 채굴의 작업증명(Proof of Work)을 통해 지역의 해시레이트를 모으고, 탈중앙화된 네트워크를 강화합니다. 자기수탁(self-custody), 노드 운영, 채굴을 직접 실천하며, 개인이 진정한 온체인 비트코인 주권과 독립을 이룰 수 있도록 돕습니다.",
        lectureTitle:
          "비트코인을 탈중앙화하라 - 비트액스(Bitaxe)에서 해시의 바다로",
      },
    },
  },
  {
    slug: "anmol-sharma",
    image: "/2026/speakers/Anmol_Sharma.webp",
    difficulty: "High",
    links: [
      { type: "website", url: "https://bitshala.org/" },
      { type: "x", url: "https://x.com/theanmolsharma_" },
    ],
    i18n: {
      en: {
        title: "Anmol Sharma",
        subtitle: ["Head of Engineering, Bitshala", "Lead Developer, Shroud"],
        bio: "I am Head of Engineering at Bitshala, where we're training the next generation of Bitcoin open source developers in India. I'm also the lead developer of Shroud, a bitcoin wallet that puts silent payments in your pocket. I firmly believe that Bitcoin should be open, understandable, and in the hands of the people who use it.",
        lectureTitle:
          "A Pathshala for Bitcoin: Growing Builders in India (and What They've Built)",
      },
      ko: {
        title: "Anmol Sharma",
        subtitle: ["Bitshala 엔지니어링 총괄", "Shroud 리드 개발자"],
        bio: "저는 비트샬라(Bitshala)의 엔지니어링 총괄로, 인도에서 차세대 비트코인 오픈소스 개발자를 양성하고 있습니다. 또한 사일런트 페이먼트(Silent Payments)를 주머니 속에서 쓸 수 있게 해 주는 비트코인 지갑 슈라우드(Shroud)의 리드 개발자이기도 합니다. 저는 비트코인이 개방적이고, 이해하기 쉬우며, 그것을 사용하는 사람들의 손에 있어야 한다고 굳게 믿습니다.",
        lectureTitle:
          "비트코인 파트샬라(Pathshala, 학교): 인도에서 빌더를 키우는 일 (그리고 그들이 만든 것들)",
      },
    },
  },
  {
    slug: "paperpsych",
    image: "/2026/speakers/Paperpsych.webp",
    difficulty: "High",
    links: [
      { type: "x", url: "https://x.com/_paperpsych" },
      { type: "website", url: "https://bitshala.org/" },
    ],
    i18n: {
      en: {
        title: "Paperpsych",
        subtitle: [
          "Curator, Bitshala Bitspace",
          "Design and Events Lead, Bitshala",
        ],
        bio: "Paperpsych (Paper) works on community, education, and design at Bitshala, a Bitcoin education initiative in India that trains people to work on Bitcoin open source.\n\nPaper is the curator and community manager of Bitshala Bitspace, India's first Bitcoin-only hackerspace, which opened in Bengaluru in 2024. Since early 2023, he has been helping build India's Bitcoin ecosystem from the ground up, and he is one of the main organizers of the BOSS Summit and the BitPlebs Summit in India.\n\nPaper also conceptualized and is building HODL (Hands-On Design Lab), a cohort-based education initiative that brings designers into Bitcoin FOSS. He builds the rooms, programs, and pathways that turn curiosity into contributions.",
        lectureTitle: "Bitshala: Building India's Bitcoin Developer Ecosystem",
      },
      ko: {
        title: "Paperpsych",
        subtitle: ["Bitshala Bitspace 큐레이터", "Bitshala 디자인·이벤트 리드"],
        bio: "페이퍼사이크(Paperpsych, 줄여서 Paper)는 사람들이 비트코인 오픈소스에서 일할 수 있도록 교육하는 인도의 비트코인 교육 이니셔티브 비트샬라(Bitshala)에서 커뮤니티, 교육, 디자인을 맡고 있다.\n\n그는 2024년 벵갈루루에 문을 연 인도 최초의 비트코인 온리(Bitcoin-only) 해커스페이스, 비트샬라 비트스페이스(Bitshala Bitspace)의 큐레이터이자 커뮤니티 매니저다. 2023년 초부터 인도의 비트코인 생태계를 밑바닥부터 일구는 데 힘을 보태 왔으며, 인도에서 열리는 BOSS 서밋(BOSS Summit)과 비트플렙스 서밋(BitPlebs Summit)의 주요 기획자 중 한 명이다.\n\n또한 디자이너를 비트코인 FOSS(자유·오픈소스 소프트웨어)로 이끄는 코호트 기반 교육 이니셔티브 HODL(Hands-On Design Lab)을 구상해 직접 만들어 가고 있다. 그는 호기심이 실제 기여로 이어지도록 공간과 프로그램, 그리고 그 길을 만든다.",
        lectureTitle: "Bitshala: 인도의 비트코인 개발자 생태계를 만들다",
      },
    },
  },
  {
    slug: "stark",
    image: "/2026/speakers/Stark.webp",
    difficulty: "High",
    links: [
      { type: "website", url: "https://openswap.live" },
      { type: "x", url: "https://x.com/stark21m" },
    ],
    i18n: {
      en: {
        title: "Stark",
        subtitle: ["Protocol Engineer, Openswap"],
        bio: "I have been in the Bitcoin space since 2021, starting as a participant in the open source development program Summer of Bitcoin. I have contributed to multiple open source projects since. A couple of years ago I started diving into the privacy and fungibility area of Bitcoin which led me to Coinswap (now Openswap, https://github.com/citadel-foss/openswap). Since then I have been contributing to this project which is supported by Spiral and OpenSats. Now I lead protocol development for the project.",
        lectureTitle: "Private and Decentralized Atomic Swaps on Bitcoin",
      },
      ko: {
        title: "Stark",
        subtitle: ["Openswap 프로토콜 엔지니어"],
        bio: "저는 2021년 오픈소스 개발 프로그램 서머 오브 비트코인(Summer of Bitcoin)에 참가하면서 비트코인 업계에 발을 들였고, 이후 여러 오픈소스 프로젝트에 기여해 왔습니다. 몇 년 전부터 비트코인의 프라이버시와 대체 가능성(fungibility) 분야를 깊이 파고들기 시작했고, 그 과정에서 코인스왑(Coinswap, 현 오픈스왑 Openswap, https://github.com/citadel-foss/openswap)을 만나게 되었습니다. 그때부터 스파이럴(Spiral)과 오픈샛츠(OpenSats)의 후원을 받는 이 프로젝트에 기여해 왔으며, 현재는 프로젝트의 프로토콜 개발을 이끌고 있습니다.",
        lectureTitle: "비트코인 위의 프라이빗하고 탈중앙화된 아토믹 스왑",
      },
    },
  },
  {
    slug: "veronika-dorson",
    image: "/2026/speakers/Veronika_Dorson.webp",
    difficulty: "High",
    links: [
      { type: "website", url: "https://dorsonveronika.framer.website/" },
      { type: "x", url: "https://x.com/veronika_dorson" },
    ],
    i18n: {
      en: {
        title: "Veronika Dorson",
        subtitle: ["Open Source Designer, Zeus"],
        bio: "Veronika Dorson is a UX/UI and product designer, now focused on Bitcoin. She has contributed design work to Cashu, OpenPleb, Bitshala, and is currently working on Zeus.\n\nVeronika is also the co-founder of HODL (Hands-On Design Lab), a cohort-based education initiative that brings designers into Bitcoin. Having shipped real open source design work in Bitcoin, she teaches designers from experience instead of theory.",
        lectureTitle: "Does Bitcoin Need Designers? Well, No.",
      },
      ko: {
        title: "Veronika Dorson",
        subtitle: ["Zeus 오픈소스 디자이너"],
        bio: "베로니카 도르손(Veronika Dorson)은 현재 비트코인에 집중하고 있는 UX/UI·프로덕트 디자이너다. 캐슈(Cashu), 오픈플렙(OpenPleb), 비트샬라(Bitshala)에 디자인 작업으로 기여했으며, 지금은 제우스(Zeus)에서 일하고 있다.\n\n또한 디자이너를 비트코인으로 이끄는 코호트 기반 교육 이니셔티브 HODL(Hands-On Design Lab)의 공동 창립자이기도 하다. 비트코인 오픈소스에서 실제 디자인 작업을 출시해 온 경험을 바탕으로, 이론이 아닌 경험으로 디자이너들을 가르친다.",
        lectureTitle: "비트코인에 디자이너가 필요할까요? 글쎄요, 아니요.",
      },
    },
  },
  {
    slug: "davidson",
    image: "/2026/speakers/Davidson.webp",
    difficulty: "High",
    links: [{ type: "website", url: "https://blog.dlsouza.lol" }],
    i18n: {
      en: {
        title: "Davidson",
        subtitle: ["Vinteum Grantee"],
        bio: "Bitcoin OSS dev working on Utreexo and Floresta for four years.",
        lectureTitle: "Speeding up Bitcoin IBD",
      },
      ko: {
        title: "Davidson",
        subtitle: ["Vinteum 그랜티"],
        bio: "4년째 유트렉소(Utreexo)와 플로레스타(Floresta)를 개발하고 있는 비트코인 오픈소스 개발자.",
        lectureTitle: "비트코인 IBD(초기 블록 다운로드) 가속하기",
      },
    },
  },
];

// 랜딩 캐러셀은 앞 6명만 노출한다. 국내 관객이 바로 알아보는 연사를 이 순서로 앞세우고,
// 나머지는 기존대로 알파벳순을 유지한다.
const featuredOrder = [
  "louis-ko",
  "kang-jaenam",
  "daniel-james",
  "respect",
  "robin",
  "stephan-livera",
];

const featuredRank = (slug: string) => {
  const index = featuredOrder.indexOf(slug);
  return index === -1 ? featuredOrder.length : index;
};

const sortedItems = [...items].sort(
  (a, b) =>
    featuredRank(a.slug) - featuredRank(b.slug) ||
    a.i18n.en.title.localeCompare(b.i18n.en.title, "en", {
      sensitivity: "base",
    })
);

const speakers = {
  en: sortedItems.map(({ i18n, ...common }) => ({ ...common, ...i18n.en })),
  ko: sortedItems.map(({ i18n, ...common }) => ({ ...common, ...i18n.ko })),
} satisfies Record<Locale, Speaker[]>;

export default speakers;
