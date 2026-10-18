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
      // 원본(~/Downloads/tbb_logo_yoko_primary.png, 5440×1920)의 컬러 버전. 워드마크가 짙은 갈색(#43341b)이라
      // 검정 배경에 묻힌다 → 갈색만 로고 자체의 크림색(#fcfaf2)으로 바꿨다. 코인 빨강·머리글자 색(보라·주황·청록)은 그대로.
      // 사방 320px 투명 여백 트림 + 무손실 webp. (흰색 단색 원본 tbb_logo_yoko_white.png 도 있으나 컬러판으로 확정)
      image: "/media-partners/tokyo-bitcoin-base-primary.webp",
      alt: "Tokyo Bitcoin Base",
      // 코인 2개 + 3줄 워드마크라 한 줄 글자 높이가 박스의 ~21% 뿐이다.
      // 기본 높이로는 글자가 7px 남짓이라 읽히지 않는다 → 글자가 15~23px 이 되도록 크게 잡는다.
      // 모바일 72px = 폭 270px(390px 화면 콘텐츠 폭 358px 안).
      customImageClass: "h-[72px] sm:h-[84px] md:h-[96px] lg:h-[112px]",
    },
  ],
};

// 두 티어가 모두 비면 랜딩·/sponsors 의 미디어 파트너 블록을 제목째 숨긴다.
export const hasMediaPartners =
  mediaPartners.main.length + mediaPartners.media.length > 0;

export default mediaPartners;
