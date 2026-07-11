"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReviewVideo } from "@/app/messages/2026/reviews";
import YouTubePlayer, { ytThumb } from "../YouTubePlayer";

type Props = {
  videos: ReviewVideo[];
  nowPlayingLabel: string;
  playLabel: string;
};

export default function ReviewVideos({
  videos,
  nowPlayingLabel,
  playLabel,
}: Props) {
  // active = 대표 플레이어에 실린 영상.
  // selections = 플레이리스트 클릭 횟수. key 에 넣어 같은 항목 재클릭 시에도 리마운트 →
  // 재시작되고 이전 iframe 은 파괴된다. 0 이면 아직 아무 항목도 고르지 않은 첫 페인트.
  // playing = 실제 재생 여부. 플레이어 파사드를 직접 눌러도 재생이 시작되므로
  // selections 로 추론하면 "재생 중" 배지가 실제 상태와 어긋난다 → 별도 상태로 둔다.
  const [active, setActive] = useState(0);
  const [selections, setSelections] = useState(0);
  const [playing, setPlaying] = useState(false);

  const select = (i: number) => {
    setActive(i);
    setSelections((n) => n + 1);
    setPlaying(true);
  };

  const current = videos[active];

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <YouTubePlayer
          key={`${current.id}-${selections}`}
          videoId={current.id}
          title={current.title}
          autoStart={selections > 0}
          onPlay={() => setPlaying(true)}
          className="lg:aspect-auto lg:h-full"
        />
      </div>

      <ul className="flex flex-col gap-3 lg:col-span-5">
        {videos.map((v, i) => {
          const isSelected = i === active;
          const isPlaying = isSelected && playing;
          return (
            <li key={v.id}>
              <button
                type="button"
                onClick={() => select(i)}
                aria-current={isSelected || undefined}
                aria-label={`${playLabel}: ${v.title}`}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-colors",
                  isSelected
                    ? "border-glow-pink/60 bg-white/[0.06] ring-1 ring-glow-pink/40"
                    : "border-white/10 bg-[#15122a]/60 hover:border-white/25 hover:bg-white/[0.04]"
                )}
              >
                <span className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element -- 원격 유튜브 썸네일: next/image 로 바꾸면 remotePatterns 필요 */}
                  <img
                    src={ytThumb(v.id, "mq")}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 grid place-items-center bg-black/25 transition-colors group-hover:bg-black/10"
                  >
                    <span className="grid size-8 place-items-center rounded-full border border-white/20 bg-black/60 backdrop-blur-md">
                      <Play className="size-3.5 translate-x-px fill-white text-white" />
                    </span>
                  </span>
                </span>

                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 block text-sm font-semibold leading-snug text-white">
                    {v.title}
                  </span>
                  <span className="mt-1 line-clamp-1 block text-xs text-white/50">
                    {v.channel}
                  </span>
                  {isPlaying && (
                    <span className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-glow-pink-soft">
                      <span className="relative flex size-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-glow-pink-soft opacity-75" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-glow-pink-soft" />
                      </span>
                      {nowPlayingLabel}
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
