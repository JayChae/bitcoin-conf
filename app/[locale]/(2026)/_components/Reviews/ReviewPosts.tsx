import Image from "next/image";
import { ArrowUpRight, PenLine } from "lucide-react";
import type { ReviewPost } from "@/app/messages/2026/reviews";
import { EYEBROW_CLASS } from "../Speakers/InfoField";

type Props = {
  posts: ReviewPost[];
  ctaLabel: string;
};

export default function ReviewPosts({ posts, ctaLabel }: Props) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {posts.map((post) => (
        <a
          key={post.url}
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-stretch gap-4 rounded-2xl border border-white/10 bg-[#15122a]/60 p-3 transition-all duration-300 hover:border-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-glow-purple/50 sm:p-4 sm:hover:-translate-y-0.5"
        >
          {/* 대표 이미지는 세로(3:4) 원본 — 카드 옆에 그대로 세워 크롭을 최소화한다 */}
          <span className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#0d0a1c] sm:w-28">
            <Image
              src={post.thumb.src}
              fill
              sizes="(min-width: 640px) 112px, 96px"
              alt=""
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </span>

          <div className="flex min-w-0 flex-1 flex-col py-1">
            <div className="flex items-center gap-2">
              <PenLine aria-hidden="true" className="size-3.5 text-white/40" />
              <span className={EYEBROW_CLASS}>
                {post.author} · {post.date}
              </span>
            </div>

            <h4 className="mt-2 line-clamp-2 text-base font-bold leading-snug text-white md:text-lg">
              {post.title}
            </h4>

            <div className="mt-auto flex items-center justify-end gap-1.5 pt-3">
              <span className="text-sm font-medium text-[#F8C8FF] transition-colors group-hover:text-white">
                {ctaLabel}
              </span>
              <ArrowUpRight className="size-4 text-[#F8C8FF] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
