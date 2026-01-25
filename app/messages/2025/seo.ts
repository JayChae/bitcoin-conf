export const seoMessages = {
  en: {
    title: "Bitcoin Mini Conference 2025 - Seoul",
    description:
      "Bitcoin Mini Conference 2025 in Seoul led by Community, South Korea. Two days of Bitcoin education, workshop, lightning market, and community building on November 29-30.",
    keywords:
      "Bitcoin, Conference, Seoul, Korea, Cryptocurrency, Blockchain, Education, Community, 2025",
    ogTitle: "Bitcoin Mini Conference 2025 - Seoul",
    ogDescription:
      "Bitcoin Mini Conference 2025 in Seoul, South Korea. Two days of Bitcoin education, workshop, lightning market, and community building on November 29-30.",
    twitterTitle: "Bitcoin Mini Conference 2025 - Seoul",
    twitterDescription:
      "Bitcoin Mini Conference 2025 in Seoul, South Korea. Two days of Bitcoin education, workshop, lightning market, and community building on November 29-30.",
    siteName: "Bitcoin Mini Conference",
    author: "Bitcoin Mini Conference Team",
    creator: "Bitcoin Mini Conference Team",
    publisher: "Bitcoin Mini Conference",
    category: "Technology",
    classification: "Bitcoin Conference",
    subject: "Bitcoin, Blockchain, Cryptocurrency",
    audience: "Bitcoin enthusiasts, developers",
    robots: "index, follow",
    googlebot: "index, follow",
    revisitAfter: "7 days",
    language: "en",
    geo: {
      region: "KR-11",
      placename: "Seoul, South Korea",
    },
  },
  ko: {
    title: "비트코인 미니 컨퍼런스 2025 - 서울",
    description:
      "국내 유일 커뮤니티 주도 비트코인 컨퍼런스, 2025년 11월 29-30일 서울에서 해외 및 국내 주요 업계 관계자들의 강연, 워크숍, 비트코인 마켓, 네트워킹 활동에 참여하세요.",
    keywords:
      "비트코인, 컨퍼런스, 서울, 한국, 암호화폐, 블록체인, 교육, 커뮤니티, 2025",
    ogTitle: "비트코인 미니 컨퍼런스 2025 - 서울",
    ogDescription:
      "국내 유일 커뮤니티 주도 비트코인 컨퍼런스, 2025년 11월 29-30일 서울에서 해외 및 국내 주요 업계 관계자들의 강연, 워크숍, 비트코인 마켓, 네트워킹 활동에 참여하세요.",
    twitterTitle: "비트코인 미니 컨퍼런스 2025 - 서울",
    twitterDescription:
      "국내 유일 커뮤니티 주도 비트코인 컨퍼런스, 2025년 11월 29-30일 서울에서 해외 및 국내 주요 업계 관계자들의 강연, 워크숍, 비트코인 마켓, 네트워킹 활동에 참여하세요.",
    siteName: "비트코인 미니 컨퍼런스",
    author: "비트코인 미니 컨퍼런스 팀",
    creator: "비트코인 미니 컨퍼런스 팀",
    publisher: "비트코인 미니 컨퍼런스",
    category: "기술",
    classification: "비트코인 컨퍼런스",
    subject: "비트코인, 블록체인, 암호화폐",
    audience: "비트코이너",
    robots: "index, follow",
    googlebot: "index, follow",
    revisitAfter: "7 days",
    language: "ko",
    geo: {
      region: "KR-11",
      placename: "서울, 대한민국",
    },
  },
} as const;

export type SeoLanguage = keyof typeof seoMessages;
