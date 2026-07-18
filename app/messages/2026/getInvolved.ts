import type { Locale } from "@/i18n/routing";

// 참여 신청 허브("함께하기")의 카드 데이터.
// 아이콘/accent 색은 컴포넌트가 key로 매핑한다(아이콘 컴포넌트를 데이터에 두지 않음).
export type InvolveKey = "sideEvent" | "market" | "sponsor" | "partner";

export type InvolveCard = {
  key: InvolveKey;
  formUrl: string;
  title: string;
  description: string;
};

type LocaleContent = Pick<InvolveCard, "title" | "description">;

type InvolveSource = Omit<InvolveCard, keyof LocaleContent> & {
  i18n: { en: LocaleContent; ko: LocaleContent };
};

// 외부 Fillout 신청 폼들. 스폰서 URL은 SponsorInquiryCta.tsx의 INQUIRY_URL과
// 같은 값이지만, 이 허브가 자체적으로 참조할 수 있도록 여기 그대로 보관한다.
const items: InvolveSource[] = [
  {
    key: "sideEvent",
    formUrl: "https://bitcoinkoreaconference.fillout.com/t/9mmq56EMUHus",
    i18n: {
      en: {
        title: "Side Events",
        description: "Host your own side event during conference week.",
      },
      ko: {
        title: "사이드 이벤트",
        description: "컨퍼런스 주간에 나만의 사이드 이벤트를 열어보세요.",
      },
    },
  },
  {
    key: "market",
    formUrl: "https://bitcoinkoreaconference.fillout.com/t/2q34AFDv8Sus",
    i18n: {
      en: {
        title: "Lightning Market",
        description: "Apply for a booth to showcase your product at the market.",
      },
      ko: {
        title: "라이트닝 마켓",
        description: "마켓에서 제품·서비스를 선보일 부스를 신청하세요.",
      },
    },
  },
  {
    key: "sponsor",
    formUrl: "https://bitcoinkoreaconference.fillout.com/t/nZ2nj5TqeQus",
    i18n: {
      en: {
        title: "Sponsors",
        description: "Partner with us to build the 2026 Bitcoin Korea Conference.",
      },
      ko: {
        title: "스폰서",
        description: "2026 비트코인 코리아 컨퍼런스를 함께 만들 후원사를 찾습니다.",
      },
    },
  },
  {
    key: "partner",
    formUrl: "https://bitcoinkoreaconference.fillout.com/t/51j6HKUwX2us",
    i18n: {
      en: {
        title: "Community & Media Partners",
        description: "Join as a community or media partner and spread the word.",
      },
      ko: {
        title: "커뮤니티 & 미디어 파트너",
        description: "커뮤니티·미디어 파트너로 함께 소식을 전하세요.",
      },
    },
  },
];

const getInvolved = {
  en: items.map(({ i18n, ...common }) => ({ ...common, ...i18n.en })),
  ko: items.map(({ i18n, ...common }) => ({ ...common, ...i18n.ko })),
} satisfies Record<Locale, InvolveCard[]>;

export default getInvolved;
