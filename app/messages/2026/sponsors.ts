export type Sponsor = {
  name: string;
  url: string;
  image: string;
  alt: string;
  customImageClass?: string;
};

const sponsors: {
  diamond: Sponsor[];
  gold: Sponsor[];
  silver: Sponsor[];
  bronze: Sponsor[];
} = {
  diamond: [],
  gold: [],
  silver: [
    {
      name: "Wallet of Satoshi",
      url: "https://walletofsatoshi.com",
      image: "/sponsors/ws.png",
      alt: "Wallet of Satoshi",
    },
  ],
  bronze: [],
} as const;

export default sponsors;
