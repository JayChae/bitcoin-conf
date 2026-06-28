export type Partner = {
  image: string;
  alt: string;
  width: number; // 원본 px (next/image 비율 계산 → 레이아웃 시프트 방지)
  height: number;
  /** 기업 공식 사이트 (있으면 로고 클릭 시 새 탭으로 이동) */
  url?: string;
  /** 흰색/밝은 단색 로고는 회색 배경에서 안 보이므로 색을 반전해 노출 */
  invert?: boolean;
};

// 노출 순서 = /public/partners/N.webp 파일 번호순 (1~26).
const partners: Partner[] = [
  { image: "/partners/1.webp", alt: "Wallet of Satoshi", width: 2849, height: 593, url: "https://www.walletofsatoshi.com" },
  { image: "/partners/2.webp", alt: "Human Rights Foundation", width: 1181, height: 1181, url: "https://hrf.org" },
  { image: "/partners/3.webp", alt: "Blockstream", width: 2008, height: 1009, url: "https://blockstream.com" },
  { image: "/partners/4.webp", alt: "Frostsnap", width: 1181, height: 1181, url: "https://frostsnap.com" },
  { image: "/partners/5.webp", alt: "Seoul Bitcoin Meetup", width: 1181, height: 300, url: "https://www.meetup.com/seoulbitcoin/" },
  { image: "/partners/6.webp", alt: "NonceLab", width: 905, height: 291, url: "https://noncelab.com" },
  { image: "/partners/7.webp", alt: "Bitomun", width: 1200, height: 630, url: "https://bitomun.com" },
  { image: "/partners/8.webp", alt: "Keystone", width: 1200, height: 630, url: "https://keyst.one", invert: true },
  { image: "/partners/9.webp", alt: "Zappi", width: 1200, height: 400, url: "https://wallet.zappi.space" },
  { image: "/partners/10.webp", alt: "KCGI Asset Management", width: 1200, height: 630, url: "https://kcgiam.com" },
  { image: "/partners/11.webp", alt: "Lightning Labs", width: 347, height: 145, url: "https://lightning.engineering" },
  { image: "/partners/12.webp", alt: "Bitcoin Policy Institute", width: 512, height: 155, url: "https://www.btcpolicy.org" },
  { image: "/partners/13.webp", alt: "My First Bitcoin", width: 300, height: 160, url: "https://myfirstbitcoin.io" },
  { image: "/partners/14.webp", alt: "AmityAge", width: 600, height: 180, url: "https://www.amityage.com" },
  { image: "/partners/15.webp", alt: "Adopting Bitcoin", width: 641, height: 471, url: "https://adoptingbitcoin.org" },
  { image: "/partners/16.webp", alt: "Fedi", width: 512, height: 123, url: "https://www.fedi.xyz" },
  { image: "/partners/17.webp", alt: "Bitcoin Beach", width: 1200, height: 630, url: "https://www.bitcoinbeach.com" },
  { image: "/partners/18.webp", alt: "OpenSats", width: 1200, height: 300, url: "https://opensats.org" },
  { image: "/partners/19.webp", alt: "SeedSigner", width: 1080, height: 381, url: "https://seedsigner.com" },
  { image: "/partners/20.webp", alt: "Liana", width: 1200, height: 630, url: "https://wizardsardine.com/liana/" },
  { image: "/partners/21.webp", alt: "OCEAN", width: 1200, height: 630, url: "https://ocean.xyz" },
  { image: "/partners/22.webp", alt: "Code Orange Dev School", width: 1200, height: 630, url: "https://codeorange.dev" },
  { image: "/partners/23.webp", alt: "Umbrel", width: 1200, height: 630, url: "https://umbrel.com" },
  { image: "/partners/24.webp", alt: "Second", width: 900, height: 300, url: "https://second.tech" },
  // 25번: 전부 흰색 로고라 식별 불가 → alt/URL 미확인 (확인되면 보완)
  { image: "/partners/25.webp", alt: "Partner", width: 1280, height: 720, invert: true },
  { image: "/partners/26.webp", alt: "Corn Wallet", width: 2952, height: 435, url: "https://team.oksu.su" },
];

export default partners;
