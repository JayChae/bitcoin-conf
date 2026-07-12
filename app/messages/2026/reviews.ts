import type { Locale } from "@/i18n/routing";

// 2025 참가자 후기 자산. SNS 스크린샷은 세로 마퀴 월/라이트박스에서, 영상은 플레이리스트에서 소비한다.
// width/height 는 실측 픽셀값 — next/image 가 종횡비 박스를 예약해 마퀴 루프가 로드 중에도 튀지 않게 한다.
export type Shot = { src: string; width: number; height: number };

export const REVIEW_SHOTS: Shot[] = [
  { src: "/2025-reviews/1.webp", width: 1178, height: 1068 },
  { src: "/2025-reviews/2.webp", width: 1100, height: 952 },
  { src: "/2025-reviews/3.webp", width: 754, height: 1280 },
  { src: "/2025-reviews/4.webp", width: 1100, height: 1183 },
  { src: "/2025-reviews/5.webp", width: 810, height: 1280 },
  { src: "/2025-reviews/6.webp", width: 1178, height: 1074 },
  { src: "/2025-reviews/7.webp", width: 1100, height: 1585 },
  { src: "/2025-reviews/8.webp", width: 1179, height: 1276 },
  { src: "/2025-reviews/9.webp", width: 1108, height: 1280 },
  { src: "/2025-reviews/10.webp", width: 858, height: 1280 },
  { src: "/2025-reviews/11.webp", width: 919, height: 1280 },
  { src: "/2025-reviews/12.webp", width: 1100, height: 435 },
  { src: "/2025-reviews/13.webp", width: 792, height: 1280 },
  { src: "/2025-reviews/14.webp", width: 1113, height: 1280 },
  { src: "/2025-reviews/15.webp", width: 1100, height: 2088 },
  { src: "/2025-reviews/16.webp", width: 1100, height: 1712 },
  { src: "/2025-reviews/17.webp", width: 1100, height: 3960 },
  { src: "/2025-reviews/18.webp", width: 1102, height: 1160 },
  { src: "/2025-reviews/19.webp", width: 1090, height: 1280 },
  { src: "/2025-reviews/20.webp", width: 1100, height: 435 },
  { src: "/2025-reviews/21.webp", width: 1100, height: 435 },
  { src: "/2025-reviews/22.webp", width: 964, height: 1280 },
  { src: "/2025-reviews/23.webp", width: 1179, height: 1201 },
  { src: "/2025-reviews/24.webp", width: 1103, height: 1280 },
  { src: "/2025-reviews/25.webp", width: 1179, height: 722 },
  { src: "/2025-reviews/26.webp", width: 1100, height: 388 },
  { src: "/2025-reviews/27.webp", width: 960, height: 1280 },
  { src: "/2025-reviews/28.webp", width: 960, height: 1280 },
  { src: "/2025-reviews/29.webp", width: 1178, height: 1247 },
];

export type ReviewVideo = { id: string; channel: string; title: string };

// 중요도 순. channel 은 고유명사라 로케일 공통, title 만 en/ko 분리한다.
type VideoSource = { id: string; channel: string; title: { en: string; ko: string } };

const videoItems: VideoSource[] = [
  {
    id: "mG1oE4OywRc",
    channel: "망고일기",
    title: {
      ko: "비트코인 폭락중📉 컨퍼런스 분위기ㄷㄷ | 2025 미니컨퍼런스 브이로그 Ep.1",
      en: "Bitcoin crashing 📉 and the buzz on the floor | 2025 Mini Conference Vlog Ep.1",
    },
  },
  {
    id: "5pb1wwHoCeU",
    channel: "망고일기",
    title: {
      ko: "비트코인⚡️라이트닝마켓&강의&센터 | 2025 미니컨퍼런스 브이로그 Ep.2",
      en: "Bitcoin ⚡️ Lightning Market, talks & the center | 2025 Mini Conference Vlog Ep.2",
    },
  },
  // 아래 채널들은 게시 허락 대기 중 — 확답 받으면 주석 해제.
  // {
  //   id: "mFJQ2aZaius",
  //   channel: "토미네이터TV",
  //   title: {
  //     ko: "수십, 수백억 자산가들과 함께 있었던 걸까... 비트코인 미니 컨퍼런스 후기",
  //     en: "Was I sitting among multimillionaires? A Bitcoin Mini Conference review",
  //   },
  // },
  // {
  //   id: "X7YKmSuWpRc",
  //   channel: "지분전쟁⚡️산원수⚡️비트벌새",
  //   title: {
  //     ko: "2025 비트코인 미니 컨퍼런스 후기",
  //     en: "2025 Bitcoin Mini Conference review",
  //   },
  // },
];

export const reviewVideos = {
  en: videoItems.map(({ title, ...common }) => ({ ...common, title: title.en })),
  ko: videoItems.map(({ title, ...common }) => ({ ...common, title: title.ko })),
} satisfies Record<Locale, ReviewVideo[]>;
