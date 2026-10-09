import type { Locale } from "@/i18n/routing";

// 라이트닝 마켓 셀러와 상품.
// 셀러를 추가하려면 items 에 한 항목을 넣고, 상품 사진은 4:5 로 잘라 webp 로
// public/2026/lightning-market/ 에 둔다 — 화면은 4:5 프레임을 꽉 채운다.
export type MarketProduct = {
  image: string;
  name: string;
  description?: string;
};

export type MarketVendor = {
  // 마켓 페이지의 앵커(#slug). 랜딩 골목의 상품 타일이 이 위치로 연결된다.
  slug: string;
  storeUrl?: string;
  name: string;
  // 간판과 쇼룸에 붙는 품목 한 줄.
  category: string;
  description: string;
  products: MarketProduct[];
};

type ProductText = Pick<MarketProduct, "name" | "description">;
type VendorText = Pick<MarketVendor, "name" | "category" | "description">;

type ProductSource = Omit<MarketProduct, keyof ProductText> & {
  i18n: { en: ProductText; ko: ProductText };
};

type VendorSource = Omit<MarketVendor, keyof VendorText | "products"> & {
  products: ProductSource[];
  i18n: { en: VendorText; ko: VendorText };
};

const IMAGE_DIR = "/2026/lightning-market";

// 배열 순서가 곧 진열 순서다(랜딩 골목과 마켓 페이지 공통).
const items: VendorSource[] = [
  {
    slug: "bitkit",
    storeUrl: "https://smartstore.naver.com/bitkit",
    i18n: {
      en: {
        name: "BitKit",
        category: "Self-custody hardware",
        description:
          "We run self-custody online stores in Korea and Japan, offering seed signers, mnemonic vaults, hard cases and more for those who truly want to 'own' their bitcoin.",
      },
      ko: {
        name: "비트키트",
        category: "셀프 커스터디 하드웨어",
        description:
          "한국과 일본에서 비수탁형 온라인 스토어를 운영하고 있습니다. 시드 사이너, 니모닉 금고, 하드 케이스 등 진정으로 비트코인을 '소유'하고자 하는 분들을 위한 제품을 제공합니다.",
      },
    },
    // 같은 이름의 두 기기는 색으로 구분하고, 진열에서도 서로 떨어뜨린다.
    products: [
      {
        image: `${IMAGE_DIR}/bitkit-seedsigner-orange.webp`,
        i18n: {
          en: { name: "SeedSigner (Orange)" },
          ko: { name: "시드 사이너 (오렌지)" },
        },
      },
      {
        image: `${IMAGE_DIR}/bitkit-hard-cases.webp`,
        i18n: {
          en: { name: "Hard cases" },
          ko: { name: "하드 케이스" },
        },
      },
      {
        image: `${IMAGE_DIR}/bitkit-seedsigner-black.webp`,
        i18n: {
          en: { name: "SeedSigner (Black)" },
          ko: { name: "시드 사이너 (블랙)" },
        },
      },
      {
        image: `${IMAGE_DIR}/bitkit-mnemonic-vault.webp`,
        i18n: {
          en: { name: "Mnemonic vault" },
          ko: { name: "니모닉 금고" },
        },
      },
    ],
  },
  {
    slug: "bitscent",
    i18n: {
      en: {
        name: "Bitscent",
        category: "Plaster aroma stones",
        description:
          "Bitscent makes plaster aroma stones. Just as a scent quietly fills a room, we started with the hope that bitcoin would seep naturally into your everyday life.",
      },
      ko: {
        name: "비트센트",
        category: "석고방향제",
        description:
          "석고방향제를 만드는 비트센트입니다. 향기가 공간을 은은하게 채우듯, 비트코인이 여러분의 일상에 자연스럽게 스며들기를 염원하며 시작했습니다.",
      },
    },
    // 시선을 끄는 흉상을 맨 앞에 두고, 흰 흉상과 흰 ₿ 사이에 오렌지 ₿를 끼워 리듬을 만든다.
    products: [
      {
        image: `${IMAGE_DIR}/bitscent-satoshi-bust.webp`,
        i18n: {
          en: {
            name: "Satoshi Nakamoto Bust Aroma Stone",
            description:
              "A plaster aroma stone sculpted as a bust of Satoshi Nakamoto, who opened a new era of money.",
          },
          ko: {
            name: "사토시 나카모토 흉상 석고방향제",
            description:
              "화폐의 새로운 시대를 연 사토시 나카모토를 모티브 삼아 흉상으로 만든 석고방향제입니다.",
          },
        },
      },
      {
        image: `${IMAGE_DIR}/bitscent-bitcoin-orange.webp`,
        i18n: {
          en: {
            name: "Orange Bitcoin Aroma Stone",
            description:
              "A plaster aroma stone made in bitcoin's signature orange. Add a point of color to your own space or your car.",
          },
          ko: {
            name: "오렌지색 비트코인 석고방향제",
            description:
              "비트코인의 상징인 오렌지색을 넣어 제작한 석고방향제입니다. 나만의 공간과 차량에 포인트를 더해보세요.",
          },
        },
      },
      {
        image: `${IMAGE_DIR}/bitscent-bitcoin-white.webp`,
        i18n: {
          en: {
            name: "Bitcoin Aroma Stone",
            description:
              "A plaster aroma stone cast in the shape of the bitcoin symbol. Display it as an object in your space, or use it as a car vent freshener.",
          },
          ko: {
            name: "비트코인 석고방향제",
            description:
              "비트코인 심볼을 본떠 만든 석고방향제입니다. 공간을 꾸미는 오브제는 물론, 차량용 송풍구 방향제로도 자유롭게 활용해 보세요.",
          },
        },
      },
    ],
  },
];

// 셀러 문구와 상품 문구를 같은 로케일로 한꺼번에 펼친다.
function localize(locale: Locale) {
  return ({ i18n, products, ...common }: VendorSource): MarketVendor => ({
    ...common,
    ...i18n[locale],
    products: products.map(({ i18n: text, ...product }) => ({
      ...product,
      ...text[locale],
    })),
  });
}

const lightningMarket = {
  en: items.map(localize("en")),
  ko: items.map(localize("ko")),
} satisfies Record<Locale, MarketVendor[]>;

export default lightningMarket;
