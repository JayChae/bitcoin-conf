import type { Sponsor } from "./sponsors";

/**
 * 미디어 파트너 — 후원사와 다른 개념이라 랜딩(MediaPartnersSection)과 /sponsors 페이지 모두 후원사 아래·트랙 레코드 위의
 * 별도 섹션에 노출한다(MediaPartnerTiers — 후원사 티어와 다른 지면형 레이아웃).
 * 빈 배열인 티어는 라벨까지 숨겨지므로, 메인 미디어 파트너가 정해지면 main 에 넣기만 하면 된다.
 */
const mediaPartners: {
  main: Sponsor[];
  media: Sponsor[];
} = {
  main: [],
  media: [
    {
      name: "Tokyo Bitcoin Base",
      url: "https://tokyobitcoin.space",
      // 원본(~/Downloads/tbb_logo_yoko_white.png, 5440×1920)의 흰색 버전 — 검정 배경에서 워드마크가 읽히는 유일한 버전.
      // (primary 는 워드마크가 짙은 갈색이라 배경에 묻힌다.) 사방 320px 투명 여백만 트림한 무손실 webp.
      image: "/media-partners/tokyo-bitcoin-base.webp",
      alt: "Tokyo Bitcoin Base",
      // 코인 2개 + 3줄 워드마크라 한 줄 글자 높이가 박스의 ~21% 뿐이다.
      // 기본 높이로는 글자가 7px 남짓이라 읽히지 않는다 → 글자가 10~13px 이 되도록 키운다.
      customImageClass: "h-[44px] sm:h-[50px] md:h-[56px] lg:h-[64px]",
    },
  ],
};

// 두 티어가 모두 비면 랜딩·/sponsors 의 미디어 파트너 블록을 제목째 숨긴다.
export const hasMediaPartners =
  mediaPartners.main.length + mediaPartners.media.length > 0;

export default mediaPartners;
