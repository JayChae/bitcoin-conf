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
      // ws.png 는 상하 투명 여백이 ~50% 라 h-[100px] 박스에서 글자가 49px 뿐이었다.
      // /partners/1.webp 는 같은 원본을 알파 트림한 것(아트워크·색 동일, 파일도 더 작다)
      // → 박스 높이 = 글자 높이. 대신 비율이 4.8:1 → 8.45:1 로 길어지므로 높이를 낮춰 잡는다.
      image: "/partners/1.webp",
      alt: "Wallet of Satoshi",
      customImageClass: "h-[36px] sm:h-[48px] md:h-[62px] lg:h-[76px]",
    },
  ],
  silver: [],
  bronze: [],
} as const;

export default sponsors;
