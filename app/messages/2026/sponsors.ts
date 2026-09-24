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
  bronze: [
    {
      name: "Fedi",
      url: "https://www.fedi.xyz",
      image: "/sponsors/fedi.webp",
      alt: "Fedi",
    },
    {
      name: "Obscura VPN",
      url: "https://obscura.com",
      // 원본(~/Downloads/obscura_vpn.png)은 "obscura" 가 검은 글씨라 다크 배경에서 사라진다.
      // 바깥과 이어진 검은 픽셀(글자·TV 외곽선·안테나)만 흰색으로 바꾸고 화면 속 눈·입과 주황 "vpn" 은 그대로 둔 무손실 webp.
      image: "/sponsors/obscura.webp",
      alt: "Obscura VPN",
      // 박스 높이는 TV 아이콘이 꽉 채우고 글자 x-height 는 43% 뿐이라(Fedi 는 글자가 박스 높이 전체),
      // 브론즈 기본 높이로는 Fedi 보다 작아 보인다 → 기본값의 약 1.3배.
      customImageClass: "h-[26px] sm:h-[32px] md:h-[36px] lg:h-[44px]",
    },
  ],
} as const;

export default sponsors;
