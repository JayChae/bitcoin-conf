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
        bio: "Kang Jae-nam is a licensed tax accountant and the representative of MADE, a tax and accounting firm specializing in crypto assets. She currently provides in-depth tax and accounting management for businesses that accept Bitcoin as payment, P2P (peer-to-peer) traders, and individuals dealing with crypto assets. Drawing on years of practical experience, she addresses more realistic and reasonable approaches to the crypto asset taxation set to take effect in Korea from 2027.",
        lectureTitle: "",
      },
      ko: {
        title: "강재남",
        subtitle: ["MADE 세무회계 공동 대표"],
        bio: "가상자산 관련 전문 세무회계 MADE의 대표 세무사로 비트코인으로 결제를 받는 사업체와 P2P거래(개인 대 개인 거래) 그리고 개인들의 가상자산 세금에 대해 심층 높은 관리를 현재 하고 있다. 특히 2027년부터 실행될 가상자산 과세에 대하여 다년간의 실무 경험을 바탕으로 보다 현실적이고 합리적인 방법을 다룬다.",
        lectureTitle: "",
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
        title: "keypleb",
        subtitle: ["Founder, Code Orange"],
        bio: "keypleb is the founder of Code Orange, a Bitcoin education initiative focused on cultivating the next generation of Bitcoiners, developers, and community leaders across Asia. With a practical, builder-centric approach, Code Orange runs monthly Bitcoin workshops, study cohorts, and developer fellowships that help people build self-custody, payments, and privacy tools themselves.\n\nBefore founding Code Orange, keypleb co-founded Bitcoin House Bali and actively contributed to growing Indonesia's local Bitcoin community through hands-on meetups and grassroots education. Operating pseudonymously in the true cypherpunk spirit, keypleb focuses on privacy and censorship resistance, and through the fellowship program works to open paths for Bitcoiners to learn, build, and contribute to Bitcoin Open Source Software.",
        lectureTitle: "",
      },
      ko: {
        title: "keypleb",
        subtitle: ["Code Orange 창립자"],
        bio: "키플렙(keypleb)은 코드 오렌지(Code Orange)의 창립자다. 코드 오렌지는 아시아 전역에서 차세대 비트코이너, 개발자, 커뮤니티 리더를 길러내는 데 초점을 둔 비트코인 교육 이니셔티브다. 코드 오렌지는 실용적이고 빌더 중심적인 접근을 바탕으로, 사람들이 자기수탁(self-custody)·결제·프라이버시 도구를 직접 만들 수 있도록 돕는 월간 비트코인 워크숍, 스터디 코호트, 개발자 펠로우십을 운영한다.\n\n코드 오렌지를 설립하기 전, 키플렙은 비트코인 하우스 발리(Bitcoin House Bali)의 공동 설립에 참여했으며, 직접 발로 뛰는 밋업과 풀뿌리 교육을 통해 인도네시아 현지 비트코인 커뮤니티를 키우는 데 적극적으로 기여했다. 진정한 사이퍼펑크 정신에 따라 가명으로 활동하는 키플렙은 프라이버시와 검열 저항에 집중하고 있으며, 펠로우십 프로그램을 통해 비트코이너들이 비트코인 오픈소스 소프트웨어(Bitcoin Open Source Software)를 배우고, 만들고, 기여할 수 있는 길을 열어주는 데 힘쓰고 있다.",
        lectureTitle: "",
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
        lectureTitle: "",
      },
      ko: {
        title: "Jimmy Kostro",
        subtitle: ["Bitcoin Learning Center 창립자"],
        bio: "지미 코스트로(Jimmy Kostro)는 미 해병대 출신의 미국인 기업가이자 열정적인 비트코인 옹호자로, 태국 치앙마이를 거점으로 활동하고 있다. 그는 물류 회사 두 곳을 공동 창업해 미국 24개 시장에 걸친 수백만 달러 규모의 사업으로 키워냈다. 2017년부터 한결같은 비트코이너로 활동해 온 코스트로는 아시아에서 가장 활발한 비트코인 허브를 구축하는 데 전념해 왔으며, 특히 동남아시아의 권위주의 체제 아래 살아가는 사람들에게 비트코인이 재정적 자유와 주권을 실현하는 강력한 도구임을 알리는 대표적인 목소리로 활동하고 있다.\n\n그는 코스트로 재단(The Kostro Foundation)의 이사장을 맡고 있다. 이 재단은 미국 세법상 501(c)(3) 비영리 단체로, 태국의 소외 계층 커뮤니티에 교육과 비트코인 이해 교육 프로그램을 제공하고 있다. 세계 곳곳의 대회에 출전해 온 열정적인 울트라마라톤 러너이기도 한 코스트로는, 트레일 위에서의 인내와 비트코인의 장기적 회복력 사이에서 강렬한 공통점을 즐겨 끌어낸다. 비트코인 MENA, 비트코인 베이거스, BTC 프라하, 비트코인 아시아 등 주요 행사의 주목받는 연사로서, 그는 무대마다 자유에 초점을 맞춘 설득력 있는 관점을 펼쳐 보인다.",
        lectureTitle: "",
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
        title: "네딸바",
        subtitle: ["Bitcoin YouTuber"],
        bio: "네딸바 is a Bitcoin YouTuber and translator. He translated 'The Blocksize War' and 'The Bitcoin Standard' into Korean, helping bring foundational Bitcoin literature to Korean readers.",
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
    difficulty: "Medium",
    links: [
      { type: "website", url: "https://v1.penlock.io/en/" },
      { type: "nostr", url: "https://nosta.me/nostr@penlock.io" },
    ],
    i18n: {
      en: {
        title: "Rama Gan",
        subtitle: ["Creator of Penlock"],
        bio: "Rama is a software engineer and Bitcoiner who has devoted himself to making the future of self-custody simpler and more robust. The tool he created, Penlock, is a printable encryption wheel that lets anyone split a seed phrase into a 2-of-3 multi-phrase backup using nothing but paper and pen — no electronics required. Because only two of the three pieces are needed to recover assets, the setup stays secure even if one is lost or stolen, and a breach of any single location never exposes the whole. Most importantly, even if the original mnemonic (seed phrase) is lost entirely, the full seed phrase can be reconstructed from any two of the three pieces using the Penlock wheel. This lets users design remote recovery and inheritance plans on their own, without relying on any company or third party. No power, no battery, and no internet connection is required — Rama has focused on 'low-tech' solutions that anyone can hold in their hands and use directly, rather than flashy technology. His work is an attempt to realize Bitcoin's ideal of 'being your own bank' without compromising on privacy, security, or sovereignty.",
        lectureTitle: "",
      },
      ko: {
        title: "Rama Gan",
        subtitle: ["Penlock 개발자"],
        bio: "라마(Rama)는 자가 수탁(self-custody)의 미래를 더 단순하고 견고하게 만드는 일에 몰두해 온 소프트웨어 엔지니어이자 비트코이너입니다. 그가 만든 펜록(Penlock)은 인쇄해서 사용할 수 있는 암호화 휠로, 전자기기 없이 종이와 펜만으로 시드 문구를 2-of-3 멀티프레이즈 백업으로 직접 나눌 수 있게 해주는 도구입니다. 세 조각 중 두 개만 있으면 자산을 복구할 수 있기 때문에, 하나를 분실하거나 도난당해도 안전하며 어느 한 곳이 뚫려도 전체가 노출되지 않습니다. 무엇보다 원본 니모닉(시드 문구)을 통째로 잃어버려도, 세 조각 중 두 개만 남아 있으면 펜록 휠로 다시 시드 문구 전체를 복원해낼 수 있다는 점이 핵심입니다. 덕분에 사용자는 특정 기업이나 제3자에 의존하지 않고 원격지 복구와 상속 계획까지 스스로 설계할 수 있습니다. 전원도, 배터리도, 인터넷 연결도 필요 없으며, 라마는 화려한 기술보다 누구나 손에 쥐고 직접 써볼 수 있는 '로우테크' 해법에 주목해 왔습니다. 그의 작업은 '스스로 자신의 은행이 되라'는 비트코인의 이상을 프라이버시·보안·주권 어느 하나도 타협하지 않으면서 실현하려는 시도입니다.",
        lectureTitle: "",
      },
    },
  },
  {
    slug: "matthew-vuk",
    image: "/2026/speakers/Matthew_Vuk.webp",
    difficulty: "High",
    links: [
      { type: "website", url: "https://second.tech/" },
      { type: "x", url: "https://x.com/matthewvuk2" },
    ],
    i18n: {
      en: {
        title: "Matthew Vuk",
        subtitle: ["Protocol Researcher, Second"],
        bio: "Based in Waterloo, Canada, Matthew Vuk works as a researcher at Second, the company developing Ark, a Bitcoin Layer 2 payment protocol. Ark is a Layer 2 protocol that aims to enable off-chain Bitcoin transactions at very low cost, without complex pre-setup such as opening channels. It works directly on top of today's Bitcoin without consensus rule changes or new op_codes, offering easy onboarding, low and predictable fees, instant settlement, Lightning Network compatibility, and control over one's own funds. The protocol revolves around an 'Ark server': users connect to this server to transact directly with one another, and can also transact with the broader Lightning Network through the server's Lightning gateway. At the heart of Ark is a new scaling model called the 'virtual UTXO (VTXO)' — a series of pre-signed off-chain transactions that a user can broadcast on-chain to reclaim their funds at any time in an emergency.",
        lectureTitle: "",
      },
      ko: {
        title: "Matthew Vuk",
        subtitle: ["Protocol Researcher, Second"],
        bio: "Matthew Vuk은 캐나다 워털루를 기반으로, 비트코인 2계층 결제 프로토콜 Ark를 개발하는 회사 Second에서 리서처로 일하고 있습니다. Ark는 채널 개설 같은 복잡한 사전 설정 없이 매우 낮은 비용으로 오프체인 비트코인 거래를 가능하게 하는 것을 목표로 하는 레이어 2 프로토콜입니다. Ark는 합의 규칙 변경이나 새로운 op_code 없이 오늘날의 비트코인 위에서 바로 작동하며, 간편한 온보딩, 낮고 예측 가능한 수수료, 즉각적인 결제, 라이트닝 네트워크 호환, 그리고 자기 자금에 대한 통제권을 제공합니다. 이 프로토콜은 'Ark 서버'를 중심으로 동작하는데, 사용자는 이 서버에 연결해 서로 직접 거래하고, 서버의 라이트닝 게이트웨이를 통해 더 넓은 라이트닝 네트워크와도 거래할 수 있습니다. Ark의 핵심은 '가상 UTXO(VTXO)'라는 새로운 확장 모델로, VTXO는 사용자가 비상시 언제든 온체인으로 자금을 회수하기 위해 브로드캐스트할 수 있는 일련의 사전 서명된 오프체인 거래입니다.",
        lectureTitle: "",
      },
    },
  },
  {
    slug: "robin",
    image: "/2026/speakers/Robin.webp",
    difficulty: "Medium",
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
        lectureTitle: "",
      },
      ko: {
        title: "Robin",
        subtitle: ["BiP 설립자"],
        bio: "Robin은 한국에 5년 넘게 거주해 온 유럽 출신 개발자이자, 부산 기반 비트코인 커뮤니티 'Bitcoin in Pusan'의 설립자다. 그는 'Bitcoin in Pusan'을 시작하기 전까지 ecash 분야의 오픈소스 개발자로서 비트코인 생태계 프로젝트에 참여해 왔으며, 비트코인 기술을 실제 사용자의 삶에 연결하는 데 오랜 관심을 기울여 왔다. 'Bitcoin in Pusan'은 지역에 비트코인 커뮤니티가 전무하던 상황에서 그가 직접 만든 모임으로, 출범 1년 만에 정기 모임과 강의, 워크숍, 각종 행사는 물론 자체 물리적 공간까지 갖춘 커뮤니티로 성장했다. 이번 컨퍼런스에서 Robin은 지난 1년간 'Bitcoin in Pusan'을 일구며 얻은 경험과 교훈을 공유하고, 누구나 자신만의 비트코인 네트워크를 구축할 수 있다는 점을 이야기할 예정이다.",
        lectureTitle: "",
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
    slug: "pororo",
    image: "/2026/speakers/pororo.webp",
    difficulty: "Medium",
    links: [
      { type: "website", url: "https://team.oksu.su/" },
      { type: "github", url: "https://github.com/asheswook" },
    ],
    i18n: {
      en: {
        title: "Pororo",
        subtitle: ["Developer, Corn Wallet"],
        bio: "Starting from Corn Gang, Korea's first Lightning node community, Pororo is building Corn Wallet, an easy and convenient Lightning wallet. Believing that Bitcoin should be simple, Pororo is also active as an educator and lecturer.",
        lectureTitle: "",
      },
      ko: {
        title: "Pororo",
        subtitle: ["Developer, Corn Wallet"],
        bio: "한국 최초의 라이트닝 노드 커뮤니티인 Corn Gang에서부터 출발하여, 쉽고 편리한 라이트닝 월렛 Corn Wallet을 개발하고 있습니다. 비트코인은 쉬워야 한다고 믿는 마음가짐 아래에 교육자와 강의자로서도 활동하고 있습니다.",
        lectureTitle: "",
      },
    },
  },
];

const sortedItems = [...items].sort((a, b) =>
  a.i18n.en.title.localeCompare(b.i18n.en.title, "en", { sensitivity: "base" })
);

const speakers = {
  en: sortedItems.map(({ i18n, ...common }) => ({ ...common, ...i18n.en })),
  ko: sortedItems.map(({ i18n, ...common }) => ({ ...common, ...i18n.ko })),
} satisfies Record<Locale, Speaker[]>;

export default speakers;
