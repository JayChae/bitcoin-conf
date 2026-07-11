import type { Locale } from "@/i18n/routing";

// 2025 참가자 후기 자산. SNS 스크린샷은 세로 마퀴 월/라이트박스에서, 영상은 플레이리스트에서 소비한다.
// width/height 는 실측 픽셀값 — next/image 가 종횡비 박스를 예약해 마퀴 루프가 로드 중에도 튀지 않게 한다.
export type Shot = { src: string; width: number; height: number };

export const REVIEW_SHOTS: Shot[] = [
  { src: "/2025-reviews/1.jpg", width: 1090, height: 1280 },
  { src: "/2025-reviews/2.jpg", width: 858, height: 1280 },
  { src: "/2025-reviews/3.jpg", width: 1103, height: 1280 },
  { src: "/2025-reviews/4.jpg", width: 754, height: 1280 },
  { src: "/2025-reviews/5.jpg", width: 810, height: 1280 },
  { src: "/2025-reviews/6.jpg", width: 1113, height: 1280 },
  { src: "/2025-reviews/7.jpg", width: 1179, height: 1201 },
  { src: "/2025-reviews/8.jpg", width: 1179, height: 1276 },
  { src: "/2025-reviews/9.jpg", width: 919, height: 1280 },
  { src: "/2025-reviews/10.jpg", width: 1108, height: 1280 },
  { src: "/2025-reviews/11.jpg", width: 792, height: 1280 },
  { src: "/2025-reviews/12.jpg", width: 1102, height: 1280 },
  { src: "/2025-reviews/13.jpg", width: 1179, height: 815 },
  { src: "/2025-reviews/14.jpg", width: 964, height: 1280 },
  { src: "/2025-reviews/15.jpg", width: 1178, height: 1074 },
  { src: "/2025-reviews/16.jpg", width: 1178, height: 1068 },
  { src: "/2025-reviews/17.jpg", width: 1178, height: 1247 },
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
  {
    id: "mFJQ2aZaius",
    channel: "토미네이터TV",
    title: {
      ko: "수십, 수백억 자산가들과 함께 있었던 걸까... 비트코인 미니 컨퍼런스 후기",
      en: "Was I sitting among multimillionaires? A Bitcoin Mini Conference review",
    },
  },
  {
    id: "X7YKmSuWpRc",
    channel: "지분전쟁⚡️산원수⚡️비트벌새",
    title: {
      ko: "2025 비트코인 미니 컨퍼런스 후기",
      en: "2025 Bitcoin Mini Conference review",
    },
  },
];

export const reviewVideos = {
  en: videoItems.map(({ title, ...common }) => ({ ...common, title: title.en })),
  ko: videoItems.map(({ title, ...common }) => ({ ...common, title: title.ko })),
} satisfies Record<Locale, ReviewVideo[]>;
