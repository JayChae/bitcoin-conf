"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  videoId: string;
  title: string;
  className?: string;
  autoStart?: boolean;
  onPlay?: () => void;
};

// 유튜브 썸네일 CDN 규칙 — 파사드와 플레이리스트가 공유한다.
// maxres 는 없는 영상이 있어 404 가능, mq/hq 는 항상 존재한다.
export const ytThumb = (videoId: string, size: "maxres" | "hq" | "mq") =>
  `https://i.ytimg.com/vi/${videoId}/${size}default.jpg`;

// 클릭 전에는 유튜브 플레이어 대신 썸네일 파사드만 렌더해 초기 로드 비용을 없앤다.
// className 으로 aspect-video 를 덮어써 부모 높이에 맞춰 늘릴 수 있다(홈 lg 그리드).
// 그 경우 재생 중인 플레이어는 박스 안에서 16:9 로 세로 중앙 정렬되고,
// 남는 영역은 검은 바 대신 웰 색(#0d0a1c)으로 채워진다.
// autoStart 는 리뷰 플레이리스트처럼 key 로 리마운트하며 즉시 재생시킬 때 쓴다.
// onPlay 는 파사드 클릭으로 시작된 재생을 부모에게 알린다 — 부모가 재생 상태를
// 따로 표시한다면(플레이리스트의 "재생 중" 배지) 이 신호 없이는 어긋난다.
export default function YouTubePlayer({
  videoId,
  title,
  className,
  autoStart = false,
  onPlay,
}: Props) {
  const [playing, setPlaying] = useState(autoStart);
  const [thumbFallback, setThumbFallback] = useState(false);

  const thumb = ytThumb(videoId, thumbFallback ? "hq" : "maxres");

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d0a1c] aspect-video",
        className
      )}
    >
      {playing ? (
        <div className="absolute inset-0 m-auto w-full max-h-full aspect-video">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setPlaying(true);
            onPlay?.();
          }}
          aria-label={title}
          className="group absolute inset-0 h-full w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-glow-purple/50"
        >
          <img
            src={thumb}
            onError={() => setThumbFallback(true)}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/15"
          />
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 flex size-14 sm:size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 border border-white/20 backdrop-blur-md transition-transform duration-300 group-hover:scale-110"
          >
            <Play className="size-6 sm:size-7 translate-x-0.5 fill-white text-white" />
          </span>
        </button>
      )}
    </div>
  );
}
