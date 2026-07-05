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
];

const press = {
  en: items.map(({ i18n, ...common }) => ({ ...common, ...i18n.en })),
  ko: items.map(({ i18n, ...common }) => ({ ...common, ...i18n.ko })),
} satisfies Record<Locale, PressArticle[]>;

export default press;
