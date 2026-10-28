import type { Locale } from "@/i18n/routing";

export type PressArticle = {
  id: string;
  url: string;
  outlet: string;
  date: string;
  headline: string;
  excerpt?: string;
  quote?: string;
  quoteAttribution?: string;
};

type LocaleContent = Pick<
  PressArticle,
  "outlet" | "date" | "headline" | "excerpt" | "quote" | "quoteAttribution"
>;

type PressSource = Omit<PressArticle, keyof LocaleContent> & {
  i18n: { en: LocaleContent; ko: LocaleContent };
};

const items: PressSource[] = [
  {
    id: "wowtv-2026-1028",
    url: "https://n.news.naver.com/article/215/0001270809",
    i18n: {
      en: {
        outlet: "Korea Economic TV",
        date: "Oct 28, 2026",
        headline: "'The Monetary Revolution Was Foretold When Bitcoin Was $600'",
        quote:
          "Government anti-money-laundering rules can slow it down, but they can't stop bitcoin itself.",
        quoteAttribution: "Stephan Livera · Bitcoin & Economics Podcaster",
      },
      ko: {
        outlet: "한국경제TV",
        date: "2026. 10. 28.",
        headline: "\"비트코인 600달러때 화폐 혁명은 예고됐다\"",
        quote:
          "정부 자금세탁방지 규제가 속도를 늦출 수는 있지만 비트코인 자체를 막을 수는 없다.",
        quoteAttribution: "Stephan Livera · 비트코인과 경제 전문 팟캐스터",
      },
    },
  },
  {
    id: "wowtv-2026",
    url: "https://n.news.naver.com/article/215/0001270061",
    i18n: {
      en: {
        outlet: "Korea Economic TV",
        date: "Oct 22, 2026",
        headline:
          "'Replacing Credit Cards in Five Years' — A Future Where AI Pays with Bitcoin",
        quote:
          "A Brazilian tourist can open an app from home and finish paying at a shop in Seoul in just one second.",
        quoteAttribution: "Daniel James · CEO, Wallet of Satoshi",
      },
      ko: {
        outlet: "한국경제TV",
        date: "2026. 10. 22.",
        headline: "\"5년뒤 신용카드 대체\"…AI가 비트코인 긁는 미래",
        quote:
          "브라질 관광객이 자국 앱을 켜고 서울의 상점에서 단 1초만에 결제를 끝낼 수 있다.",
        quoteAttribution: "Daniel James · Wallet of Satoshi CEO",
      },
    },
  },
  {
    id: "egn-2025",
    url: "http://www.egn.kr/news/articleView.html?idxno=208390",
    i18n: {
      en: {
        outlet: "Joeun News",
        date: "Dec 11, 2025",
        headline:
          "2nd Bitcoin Mini Conference in the Spotlight — a 'Bitcoin Only' Event with Over 98% Korean Attendance",
        quote:
          "I'm pleased we achieved our goal of correcting the misconceptions people commonly hold about bitcoin.",
        quoteAttribution: "Specter · Organizer",
      },
      ko: {
        outlet: "인터넷조은뉴스",
        date: "2025. 12. 11.",
        headline:
          "제2회 비트코인 미니 컨퍼런스, '국내인이 98% 이상 참가한 비트코인 온니(Bitcoin Only)' 주목!",
        quote:
          "대중들이 잘못 오해하고 있는 비트코인 지식들을 바로잡고자 하는 목표를 이룬 것 같아 만족한다.",
        quoteAttribution: "스펙터 · 주최자",
      },
    },
  },
  {
    id: "aving-2025",
    url: "https://kr.aving.net/news/articleView.html?idxno=1806972",
    i18n: {
      en: {
        outlet: "AVING News",
        date: "Dec 10, 2025",
        headline:
          "2025 Bitcoin Mini Conference Wraps Up — 'A True Meeting Ground for the Bitcoin Ecosystem!'",
        excerpt:
          "Main Day talks, a hands-on Workshop Day, and Asia's largest Lightning Market pop-up — two days across Magok NSP Hall, SpaceB Yeonnam, and Hongdae.",
      },
      ko: {
        outlet: "에이빙(AVING)",
        date: "2025. 12. 10.",
        headline:
          "2025 비트코인 미니 컨퍼런스 성료… '진정한 비트코인 생태계 교류의 현장!'",
        excerpt:
          "메인 데이 강연과 워크숍 데이, 아시아 최대 규모 라이트닝 마켓 팝업까지 — 마곡 NSP홀, 스페이스비 연남, 홍대 일대에서 이틀간 펼쳐진 현장을 전했다.",
      },
    },
  },
  {
    id: "freezine-2024",
    url: "https://www.freezinenews.com/news/articleView.html?idxno=9682",
    i18n: {
      en: {
        outlet: "Freezine News",
        date: "Jan 1, 2025",
        headline: "'2024 Bitcoin Mini Conference' Held to a Full House",
        excerpt:
          "Eight speakers and around 200 attendees gathered in Gangnam, Seoul to unpack what bitcoin really is — wrapping up with hands-on Lightning payments.",
      },
      ko: {
        outlet: "프리진뉴스",
        date: "2025. 1. 1.",
        headline: "'2024년 비트코인 미니 컨퍼런스' 성황리에 개최",
        excerpt:
          "서울 강남에서 연사 8인과 약 200명의 참가자가 모여 비트코인의 본질적 의미를 논의하고, 행사 후 라이트닝 결제 체험까지 이어진 현장을 전했다.",
      },
    },
  },
];

const press = {
  en: items.map(({ i18n, ...common }) => ({ ...common, ...i18n.en })),
  ko: items.map(({ i18n, ...common }) => ({ ...common, ...i18n.ko })),
} satisfies Record<Locale, PressArticle[]>;

export default press;
