export type Sponsor = {
  name: string;
  url: string;
  image: string;
  alt: string;
  customImageClass?: string; // 특정 스폰서만 다른 크기 적용 가능
};

const sponsors: {
  gold: Sponsor[];
  silver: Sponsor[];
  bronze: Sponsor[];
  individual: Sponsor[];
} = {
  gold: [
    {
      name: "Human Rights Foundation",
      url: "https://hrf.org",
      image: "/sponsors/hrf.png",
      alt: "Human Rights Foundation",
    },
  ],
  silver: [
    {
      name: "Wallet of Satoshi",
      url: "https://walletofsatoshi.com",
      image: "/sponsors/ws.png",
      alt: "Wallet of Satoshi",
      customImageClass:
        "max-w-[210px] sm:max-w-[270px] md:max-w-[360px] lg:max-w-[450px] xl:max-w-[525px] max-h-[150px] sm:max-h-[180px] md:max-h-[240px] lg:max-h-[300px] xl:max-h-[360px]", // 기본보다 1.5배 크게
    },
    {
      name: "Frostsnap",
      url: "https://frostsnap.com",
      image: "/sponsors/frostsnap.png",
      alt: "frostsnap",
    },
  ],
  bronze: [
    {
      name: "NonceLab",
      url: "https://noncelab.com",
      image: "/sponsors/nonce.png",
      alt: "NonceLab",
    },
    {
      name: "Blockstream",
      url: "https://blockstream.com",
      image: "/sponsors/blockstream.png",
      alt: "Blockstream",
    },
    {
      name: "Satoshi.fit",
      image: "/sponsors/satoshi.png",
      alt: "Satoshi.fit",
      url: "https://www.satoshi.fit",
      customImageClass:
        "max-w-[110px] sm:max-w-[140px] md:max-w-[180px] lg:max-w-[220px] xl:max-w-[260px] max-h-[100px] sm:max-h-[120px] md:max-h-[150px] lg:max-h-[180px] xl:max-h-[200px]",
    },
    {
      name: "Umbrel",
      url: "https://umbrel.com",
      image: "/sponsors/umbrel.jpg",
      alt: "Umbrel",
      customImageClass:
        "max-w-[60px] sm:max-w-[75px] md:max-w-[95px] lg:max-w-[115px] xl:max-w-[135px] max-h-[55px] sm:max-h-[65px] md:max-h-[80px] lg:max-h-[95px] xl:max-h-[110px]",
    },
    {
      name: "Saturday Block",
      url: "https://www.saturdayblock.com",
      image: "/sponsors/saturdayblock.png",
      alt: "Saturday Block",
      customImageClass:
        "max-w-[85px] sm:max-w-[105px] md:max-w-[135px] lg:max-w-[165px] xl:max-w-[195px] max-h-[75px] sm:max-h-[90px] md:max-h-[115px] lg:max-h-[135px] xl:max-h-[150px]",
    },
  ],
  individual: [],
} as const;

export default sponsors;
