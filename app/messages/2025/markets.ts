export type Product = {
  name: string;
  image?: string;
};

export type Market = {
  name: string;
  description: string;
  logo?: string;
  website?: string;
  onlineStore?: string;
  products?: Product[];
  contact?: string;
  specialEvent?: string;
};

export type Markets = {
  en: Market[];
  ko: Market[];
};

const markets: Markets = {
  en: [
    {
      name: "Saturday Block",
      logo: "/markets/saturdayblock/logo.jpg",
      description:
        "A Bitcoin experience platform based on goods, education, and meetups to help you easily and properly meet Bitcoin.",
      onlineStore: "https://store.btcmap.kr/stores/saturdayblock/",
      products: [
        { name: "calender", image: "/markets/saturdayblock/calender.jpg" },
        {
          name: "paperweight",
          image: "/markets/saturdayblock/paperweight.jpg",
        },
        {
          name: "sticker",
          image: "/markets/saturdayblock/sticker.jpg",
        },
        {
          name: "bookmark",
          image: "/markets/saturdayblock/bookmark.jpg",
        },
      ],
      contact: "contact@saturdayblock.com",
      specialEvent: "",
    },
    {
      name: "TINSB",
      logo: "/markets/tinsb/logo.jpg",
      description:
        "Providing high-quality Bitcoin hardware security products including titanium mnemonic plates, seed signer kits, and accessories for secure Bitcoin storage and management.",
      onlineStore:
        "https://smartstore.naver.com/tinsb?nl-ts-pid=jdLYJsqo15VsscpFjDdsssssslK-199434&tr=slsmn",
      products: [
        {
          name: "Titanium Mnemonic Plate",
          image: "/markets/tinsb/1.jpg",
        },
        {
          name: "Titanium Mnemonic Hexaba Mini (12/24 words)",
          image: "/markets/tinsb/2.jpg",
        },
        {
          name: "SeedSigner Case DIY Kit",
          image: "/markets/tinsb/3.jpg",
        },
        {
          name: "SeedSigner Red Dot Joystick",
          image: "/markets/tinsb/4.jpg",
        },
      ],
      contact: "@TINSB",
      specialEvent: "",
    },
    {
      name: "Promenade",
      logo: "/markets/promenade/logo.png",
      description:
        "🏰 Haengjusanseong Fortress pet-friendly Bitcoin café, ⚡️ organizing a merchants' association to build a decentralized financial infrastructure, and ⛏️ building a sovereign Bitcoin citadel for an off-grid mining business.",
      website: "https://promenadecastle.com",
      products: [
        { name: "Choco-₿it", image: "/markets/promenade/chocobit.jpeg" },
        { name: "Cookie-₿it", image: "/markets/promenade/cookiebit.jpeg" },
        { name: "Ice Americano", image: "/markets/promenade/americano.jpg" },
        {
          name: "Omega Candle Financier",
          image: "/markets/promenade/longcandle.jpeg",
        },
      ],
      contact: "@PromenadeCastle",
      specialEvent:
        "Customers spending over 10,000 satoshis get a Gacha Ticket.",
    },
    {
      name: "Bitkit",
      logo: "/markets/bitkit/logo.png",
      description:
        "Operating self-custody online stores in Korea and Japan. We provide products for those who truly want to 'own' Bitcoin, such as seed signers, mnemonic safes, hard cases, and more.",
      onlineStore: "https://m.smartstore.naver.com/bitkit",
      products: [
        { name: "seedSigner", image: "/markets/bitkit/seed.png" },
        { name: "Hard cases", image: "/markets/bitkit/case.png" },
        { name: "Power Supply Unit", image: "/markets/bitkit/power.png" },
        {
          name: "Mnemonic Metal Plate",
          image: "/markets/bitkit/metal.png",
        },
      ],
      contact: "@bitkitBTC",
      specialEvent: "",
    },
    {
      name: "Bitcoin Center Seoul",
      logo: "/markets/center/logo.jpg",
      description:
        "Specializing in the professional translation and publication of Bitcoin books, making a significant contribution to elevating the intellectual level of domestic Bitcoiners. Fill your mind with nourishment too.",
      website: "https://bitcoincenterseoul.com",
      onlineStore: "https://m.smartstore.naver.com/noncelab",
      products: [
        { name: "21 Lessons", image: "/markets/center/lessons.jpg" },
        {
          name: "The Bullish Case for Bitcoin",
          image: "/markets/center/bullish.jpg",
        },
        {
          name: "The Block Size War",
          image: "/markets/center/blocksize.jpg",
        },
        {
          name: "Bitcoin Handbook",
          image: "/markets/center/handbook.jpg",
        },
      ],
      contact: "@Coconut_BTC",
      specialEvent: "",
    },
    {
      name: "Zeronimo",
      logo: "/markets/zeronimo/logo.jpg",
      description:
        "We are creating a free future on the Bitcoin network. The first step is a full node that anyone can run without complexity.",
      onlineStore: "",
      products: [
        { name: "Full Node Node", image: "/markets/zeronimo/p1.jpg" },
        {
          name: "Full Node Node",
          image: "/markets/zeronimo/p2.jpg",
        },
        {
          name: "Standard Version",
          image: "/markets/zeronimo/original.jpg  ",
        },
        {
          name: "Extended Version",
          image: "/markets/zeronimo/advanced.jpg",
        },
      ],
      contact: "",
      specialEvent: "",
    },
    {
      name: "Bread Shop Lady",
      logo: "/markets/breadLady/logo.png",
      description:
        "Currently operating a payment store and selling 5 products at the event. Warm up this cold winter with ssanghwatang and fill your hungry stomach!",
      onlineStore: "https://smartstore.naver.com/1000nuri",
      products: [
        {
          name: "Bibimbap bread",
          image: "/markets/breadLady/bread.jpg",
        },
        {
          name: "Jeonju-style Bibimm Noodle",
          image: "/markets/breadLady/noodle.jpg",
        },
        { name: "Ssanghwa tea", image: "/markets/breadLady/tea.jpg" },
        {
          name: "Korean wheat pie",
          image: "/markets/breadLady/pie.jpg",
        },
      ],
      contact: "@yunyoungjnag",
      specialEvent: "Free gift for purchases over 20,000 sats",
    },
    {
      name: "One Bite Bitcoin",
      logo: "/markets/onebite/logo.jpg",
      description:
        "For those who want to start studying Bitcoin, a small size of Bitcoin study channel.",
      onlineStore: "https://onebitebitcoin.com",
      products: [
        {
          name: "Lemon and Grapefruit Juice",
          image: "/markets/onebite/juice.jpg",
        },
      ],
      contact: "https://www.youtube.com/@onebitebitcoin",
      specialEvent: "",
    },
  ],
  ko: [
    {
      name: "Saturday Block",
      logo: "/markets/saturdayblock/logo.jpg",
      website: "https://www.saturdayblock.com",
      description:
        "비트코인을 쉽고 제대로 만나도록 돕는 굿즈·교육·밋업 기반의 비트코인 경험 플랫폼입니다.",
      onlineStore: "https://store.btcmap.kr/stores/saturdayblock/",
      products: [
        { name: "달력", image: "/markets/saturdayblock/calender.jpg" },
        { name: "문진", image: "/markets/saturdayblock/paperweight.jpg" },
        { name: "스티커", image: "/markets/saturdayblock/sticker.jpg" },
        { name: "북마크", image: "/markets/saturdayblock/bookmark.jpg" },
      ],
      contact: "contact@saturdayblock.com",
      specialEvent: "",
    },
    {
      name: "TINSB",
      logo: "/markets/tinsb/logo.jpg",
      description:
        "티타늄 니모닉 플레이트, 시드사이너 키트 및 액세서리 등 안전한 비트코인 보관 및 관리를 위한 고품질 비트코인 하드웨어 보안 제품을 제공합니다.",
      onlineStore:
        "https://smartstore.naver.com/tinsb?nl-ts-pid=jdLYJsqo15VsscpFjDdsssssslK-199434&tr=slsmn",
      products: [
        {
          name: "티타늄 니모닉 플레이트",
          image: "/markets/tinsb/1.jpg",
        },
        {
          name: "티타늄 니모닉 헥사바 미니(12단어 / 24단어)",
          image: "/markets/tinsb/2.jpg",
        },
        {
          name: "시드사이너 Case DIY 키트",
          image: "/markets/tinsb/3.jpg",
        },
        {
          name: "시드사이너 레드닷 조이스틱",
          image: "/markets/tinsb/4.jpg",
        },
      ],
      contact: "@TINSB",
      specialEvent: "",
    },
    {
      name: "프로메나드",
      logo: "/markets/promenade/logo.png",
      description:
        "🏰 행주산성 펫프렌들리 비트코인 카페, ⚡️ 결제 매장 상인회를 조직하여 금융 탈중앙화 인프라를 형성하고 있으며 ⛏️ 오프그리드 채굴 사업 개발로 소버린 비트코인 시타델을 건설 중입니다.",
      website: "https://promenadecastle.com",
      products: [
        {
          name: "오메가캔들 휘낭시에",
          image: "/markets/promenade/longcandle.jpeg",
        },
        {
          name: "쿠키빗(Cookie-₿it)",
          image: "/markets/promenade/cookiebit.jpeg",
        },
        {
          name: "초코빗(Choco-₿it)",
          image: "/markets/promenade/chocobit.jpeg",
        },
        {
          name: "아이스 아메리카노",
          image: "/markets/promenade/americano.jpg",
        },
      ],
      contact: "@PromenadeCastle",
      specialEvent: "10,000사토시 이상 구매시 돌림판 가챠 이벤트 참여가능",
    },
    {
      name: "비트키트",
      logo: "/markets/bitkit/logo.png",
      description:
        "한국과 일본에서 비수탁형 온라인 스토어를 운영하고 있습니다. 시드 사이너, 니모닉 금고, 하드 케이스 등 진정으로 비트코인을 '소유'하고자 하는 분들을 위한 제품을 제공합니다.",
      onlineStore: "https://m.smartstore.naver.com/bitkit",
      products: [
        { name: "시드사이너", image: "/markets/bitkit/seed.png" },
        { name: "하드 케이스", image: "/markets/bitkit/case.png" },
        { name: "니모닉 철판", image: "/markets/bitkit/metal.png" },
        { name: "전원 공급기", image: "/markets/bitkit/power.png" },
      ],
      contact: "@bitkitBTC",
      specialEvent: "",
    },
    {
      name: "비트코인 센터 서울",
      logo: "/markets/center/logo.jpg",
      description:
        "비트코인 서적의 전문 번역 및 출간을 전문으로 하여 국내 비트코이너들의 지적 수준 향상에 크게 기여하고 있습니다. 마음의 양식도 채워보세요",
      website: "https://bitcoincenterseoul.com",
      onlineStore: "https://m.smartstore.naver.com/noncelab",
      products: [
        { name: "21가지 교훈", image: "/markets/center/lessons.jpg" },
        {
          name: "비트코인 낙관론",
          image: "/markets/center/bullish.jpg",
        },
        {
          name: "블록사이즈워",
          image: "/markets/center/blocksize.jpg",
        },
        {
          name: "비트코인 핸드북",
          image: "/markets/center/handbook.jpg",
        },
      ],
      contact: "@Coconut_BTC",
      specialEvent: "",
    },
    {
      name: "Zeronimo",
      logo: "/markets/zeronimo/logo.jpg",
      description:
        "우리는 비트코인 네트워크 위에서 자유로운 미래를 만듭니다.그 첫걸음은, 복잡함 없이 누구나 돌릴 수 있는 풀노드입니다.",
      onlineStore: "",
      products: [
        { name: "플노드 노딘", image: "/markets/zeronimo/p1.jpg" },
        { name: "플노드 노딘", image: "/markets/zeronimo/p2.jpg" },
        { name: "기본 버전", image: "/markets/zeronimo/original.jpg" },
        { name: "확장 버전", image: "/markets/zeronimo/advanced.jpg" },
      ],
      contact: "",
      specialEvent: "",
    },
    {
      name: "빵집 아줌마",
      logo: "/markets/breadLady/logo.png",
      description:
        "현재 페이먼트 스토어를 운영하며 행사에서 5개 상품을 판매합니다. 쌍화탕으로 추운 겨울을 따뜻하게, 배고픈 배를 채워보세요!",
      onlineStore: "https://smartstore.naver.com/1000nuri",
      products: [
        { name: "비빔빵", image: "/markets/breadLady/bread.jpg" },
        { name: "전주 비빔면", image: "/markets/breadLady/noodle.jpg" },
        { name: "쌍화탕", image: "/markets/breadLady/tea.jpg" },
        { name: "우리밀 파이", image: "/markets/breadLady/pie.jpg" },
      ],
      contact: "@yunyoungjnag",
      specialEvent: "20,000 sats 이상 구매 시 사은품 증정",
    },
    {
      name: "한입 비트코인",
      logo: "/markets/onebite/logo.jpg",
      description:
        "비트코인 공부를 시작하고 싶은 분들을 위한 딱 한입 크기의 비트코인 공부 채널.",
      onlineStore: "",
      products: [
        {
          name: "한입이의 레몬과 두입이의 자몽",
          image: "/markets/onebite/juice.jpg",
        },
      ],
      contact: "https://www.youtube.com/@onebitebitcoin",
      specialEvent: "",
    },
  ],
};

export default markets;
