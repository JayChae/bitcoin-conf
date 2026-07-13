export type Partner = {
  image: string;
  alt: string;
  width: number; // 원본 px (next/image 비율 계산 → 레이아웃 시프트 방지)
  height: number;
  /** 기업 공식 사이트 (있으면 로고 클릭 시 새 탭으로 이동) */
  url?: string;
};

/**
 * 마퀴/그리드 노출 높이 보정 배수(0~1). 모든 로고를 같은 높이로 맞추면 가로로 긴
 * 워드마크는 폭이 과도하게 넓어져 혼자 커 보이고, 정사각형 로고는 작아 보인다.
 * → 체감 크기(면적)가 균일해지도록 높이를 h ∝ √(1/비율) 로 보정한다.
 * REF: 이 비율(≈정사각~2:1)까지는 최대 높이(배수 1). MIN: 극단적으로 긴 로고의 하한.
 */
const REF_RATIO = 2;
const MIN_SCALE = 0.5;

export function logoScale(p: Partner): number {
  const ratio = p.width / p.height;
  return Math.min(1, Math.max(MIN_SCALE, Math.sqrt(REF_RATIO / ratio)));
}

// 노출 순서 = /public/partners/N.webp 파일 번호순 (1~26).
// 원본 이미지는 어두운 배경 노출용으로 가공 완료 상태:
//   - 투명 여백 트림(알파 바운딩 박스 기준)
//   - 검정/짙은 무채색 픽셀 → 흰색 (브랜드 색은 보존, 단색 로고는 명도 반전으로 명암 유지)
// → 코드에서 색 반전(brightness/invert)이나 크기 스케일 보정을 하지 않는다.
const partners: Partner[] = [
  { image: "/partners/1.webp", alt: "Wallet of Satoshi", width: 2476, height: 293, url: "https://www.walletofsatoshi.com" },
  { image: "/partners/2.webp", alt: "Human Rights Foundation", width: 1171, height: 323, url: "https://hrf.org" },
  { image: "/partners/3.webp", alt: "Blockstream", width: 1501, height: 508, url: "https://blockstream.com" },
  { image: "/partners/4.webp", alt: "Frostsnap", width: 1073, height: 242, url: "https://frostsnap.com" },
  { image: "/partners/5.webp", alt: "Seoul Bitcoin Meetup", width: 979, height: 215, url: "https://www.meetup.com/seoulbitcoin/" },
  { image: "/partners/6.webp", alt: "NonceLab", width: 848, height: 237, url: "https://noncelab.com" },
  { image: "/partners/7.webp", alt: "Bitomun", width: 1117, height: 243, url: "https://bitomun.com" },
  { image: "/partners/8.webp", alt: "Keystone", width: 1168, height: 194, url: "https://keyst.one" },
  { image: "/partners/9.webp", alt: "Zappi", width: 1013, height: 290, url: "https://wallet.zappi.space" },
  { image: "/partners/10.webp", alt: "KCGI Asset Management", width: 1128, height: 355, url: "https://kcgiam.com" },
  { image: "/partners/11.webp", alt: "Lightning Labs", width: 347, height: 145, url: "https://lightning.engineering" },
  { image: "/partners/12.webp", alt: "Bitcoin Policy Institute", width: 454, height: 108, url: "https://www.btcpolicy.org" },
  { image: "/partners/13.webp", alt: "My First Bitcoin", width: 300, height: 160, url: "https://myfirstbitcoin.io" },
  { image: "/partners/14.webp", alt: "AmityAge", width: 600, height: 179, url: "https://www.amityage.com" },
  { image: "/partners/15.webp", alt: "Adopting Bitcoin", width: 641, height: 469, url: "https://adoptingbitcoin.org" },
  { image: "/partners/16.webp", alt: "Fedi", width: 512, height: 123, url: "https://www.fedi.xyz" },
  { image: "/partners/17.webp", alt: "Bitcoin Beach", width: 1135, height: 462, url: "https://www.bitcoinbeach.com" },
  { image: "/partners/18.webp", alt: "OpenSats", width: 1018, height: 141, url: "https://opensats.org" },
  { image: "/partners/19.webp", alt: "SeedSigner", width: 980, height: 314, url: "https://seedsigner.com" },
  { image: "/partners/20.webp", alt: "Liana", width: 972, height: 237, url: "https://wizardsardine.com/liana/" },
  { image: "/partners/21.webp", alt: "OCEAN", width: 1200, height: 630, url: "https://ocean.xyz" },
  { image: "/partners/22.webp", alt: "Code Orange Dev School", width: 842, height: 431, url: "https://codeorange.dev" },
  { image: "/partners/23.webp", alt: "Umbrel", width: 1080, height: 322, url: "https://umbrel.com" },
  { image: "/partners/24.webp", alt: "Second", width: 843, height: 290, url: "https://second.tech" },
  // 25번: 흰색 아웃라인 로고 "Bitcoin Social Layer" — URL 미확인 (확인되면 보완).
  { image: "/partners/25.webp", alt: "Bitcoin Social Layer", width: 1094, height: 352 },
  { image: "/partners/26.webp", alt: "Corn Wallet", width: 2852, height: 290, url: "https://team.oksu.su" },
];

export default partners;
