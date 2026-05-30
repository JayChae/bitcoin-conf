export type Sponsor = {
  name: string;
  url: string;
  image: string;
  alt: string;
  customImageClass?: string;
};

const sponsors: {
  gold: Sponsor[];
  silver: Sponsor[];
  bronze: Sponsor[];
} = {
  gold: [
    {
      name: "HRF",
      url: "https://hrf.org",
      image: "/sponsors/hrf.png",
      alt: "Human Rights Foundation",
      customImageClass: "h-[75px] sm:h-[95px] md:h-[120px] lg:h-[145px]",
    },
    {
      name: "Wallet of Satoshi",
      url: "https://walletofsatoshi.com",
      image: "/sponsors/ws.png",
      alt: "Wallet of Satoshi",
    },
  ],
  silver: [],
  bronze: [],
} as const;

export default sponsors;
