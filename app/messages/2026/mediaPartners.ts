import type { Sponsor } from "./sponsors";

/**
 * 미디어 파트너 — 후원사와 다른 개념이라 랜딩(MediaPartnersSection)과 /sponsors 페이지 모두 후원사 아래·트랙 레코드 위의
 * 별도 섹션에 노출한다(MediaPartnerTiers — 후원사 티어와 다른 지면형 레이아웃).
 * 빈 배열인 티어는 라벨까지 숨겨진다.
 */
const mediaPartners: {
  main: Sponsor[];
  media: Sponsor[];
} = {
  main: [
    {
      name: "한국경제TV",
      url: "https://www.wowtv.co.kr",
      // 원본(~/Downloads/TV_blue.png, 2234×435) 남색 #1D398D 는 검정 배경 대비가 2:1 이라 거의 안 보인다
      // → 같은 색상(225°)에서 밝기만 올린 #7491E7(대비 7:1)로 칠했다. 투명 여백 트림 + 폭 1600 무손실 webp.
      image: "/media-partners/wowtv-light-blue.webp",
      alt: "한국경제TV",
    },
  ],
  media: [
    {
      name: "Tokyo Bitcoin Base",
      url: "https://tokyobitcoin.space",
      // 원본(~/Downloads/tbb_logo_yoko_primary.png, 5440×1920)의 컬러 버전. 워드마크가 짙은 갈색(#43341b)이라
      // 검정 배경에 묻힌다 → 갈색만 로고 자체의 크림색(#fcfaf2)으로 바꿨다. 코인 빨강·머리글자 색(보라·주황·청록)은 그대로.
      // 사방 320px 투명 여백 트림 + 무손실 webp. (흰색 단색 원본 tbb_logo_yoko_white.png 도 있으나 컬러판으로 확정)
      image: "/media-partners/tokyo-bitcoin-base-primary.webp",
      alt: "Tokyo Bitcoin Base",
    },
    {
      name: "Bitcoin News",
      url: "https://bitcoinnews.com",
      // 원본(~/Downloads/Bitcoin_News_Full_Logo.png, 1224×432) 컬러판. 워드마크 "BITCOIN" 이 검정이라
      // 검정 배경에 묻힌다 → 그 검정만 로고 자체의 흰색으로 바꿨다. 빨간 코인·"NEWS" 는 그대로.
      // 투명 여백 트림 + 무손실 webp. (흰색 단색 원본 BN_Logo_white_1.png 도 있으나 TBB 처럼 컬러판으로)
      image: "/media-partners/bitcoin-news.webp",
      alt: "Bitcoin News",
    },
  ],
};

// 두 티어가 모두 비면 랜딩·/sponsors 의 미디어 파트너 블록을 제목째 숨긴다.
export const hasMediaPartners =
  mediaPartners.main.length + mediaPartners.media.length > 0;

export default mediaPartners;
