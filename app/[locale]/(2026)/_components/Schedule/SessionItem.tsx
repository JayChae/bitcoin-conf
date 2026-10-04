import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { MONO_CLASS } from "./styles";
import type { SessionView, SpeakerView } from "./timeline";

type Props = {
  session: SessionView;
  // 형식 라벨에 쓰는 그날의 액센트 색.
  accent: string;
  // 여러 공간이 섞여 보일 때 붙이는 공간 이름. lg 부터는 열 머리글이 대신한다.
  roomLabel?: string;
  // 시간 열이 이 세션의 종료 시각을 대신 말해주지 못할 때 직접 표시한다.
  showTime?: boolean;
  // 여러 열 중 한 칸일 때는 제목을 한 단계 작게.
  compact?: boolean;
  className?: string;
  style?: CSSProperties;
};

// 공간·형식 같은 부가 정보는 배지 대신 조용한 글자로만 둔다.
const SEPARATOR = (
  <span aria-hidden className="text-white/30">
    ·
  </span>
);

export default function SessionItem({
  session,
  accent,
  roomLabel,
  showTime = false,
  compact = false,
  className,
  style,
}: Props) {
  const tags: ReactNode[] = [];
  if (session.formatLabel) {
    tags.push(
      <span key="format" className={cn("font-semibold", accent)}>
        {session.formatLabel}
      </span>
    );
  }
  if (showTime && session.end) {
    tags.push(
      <span
        key="time"
        className={cn(MONO_CLASS, "tabular-nums text-white/75")}
      >
        {session.start} – {session.end}
      </span>
    );
  }

  return (
    <article className={cn("min-w-0", className)} style={style}>
      <div className={cn("flex flex-col gap-3", !compact && "max-w-3xl")}>
        {(roomLabel || tags.length > 0) && (
          <p
            className={cn(
              "flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[13px] md:text-sm leading-tight",
              tags.length === 0 && "lg:hidden"
            )}
          >
            {roomLabel && (
              <span className="inline-flex items-baseline gap-x-2 lg:hidden">
                <span className="font-semibold text-white/90">{roomLabel}</span>
                {tags.length > 0 && SEPARATOR}
              </span>
            )}
            {tags.map((tag, index) => (
              <span key={index} className="inline-flex items-baseline gap-x-2">
                {index > 0 && SEPARATOR}
                {tag}
              </span>
            ))}
          </p>
        )}

        <h3
          className={cn(
            "leading-snug break-keep [overflow-wrap:anywhere]",
            compact
              ? "text-lg md:text-xl lg:text-lg xl:text-xl"
              : "text-lg md:text-xl lg:text-2xl",
            session.tba ? "font-medium text-white/40" : "font-bold text-white"
          )}
        >
          {session.href ? (
            <Link
              href={session.href}
              className="group underline-offset-4 decoration-white/40 hover:underline focus:outline-none focus-visible:underline"
            >
              {session.title}
              <ArrowUpRight
                aria-hidden
                className="ml-1.5 inline size-[0.85em] align-baseline text-white/50 transition-colors group-hover:text-white"
              />
            </Link>
          ) : (
            session.title
          )}
        </h3>

        {session.speakers.length > 0 && (
          <ul className="flex flex-wrap gap-x-8 gap-y-3 pt-0.5">
            {session.speakers.map((speaker) => (
              <li key={speaker.key} className="min-w-0">
                <SpeakerItem speaker={speaker} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

function SpeakerItem({ speaker }: { speaker: SpeakerView }) {
  const body = (
    <>
      <span className="flex size-11 md:size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/[0.06]">
        {speaker.image ? (
          <Image
            src={speaker.image}
            alt=""
            width={48}
            height={48}
            className="size-full object-cover"
          />
        ) : (
          <span aria-hidden className="text-base font-semibold text-white/50">
            {speaker.name.charAt(0)}
          </span>
        )}
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span
          className={cn(
            "text-[15px] md:text-base font-semibold leading-tight text-white",
            speaker.href &&
              "underline-offset-4 decoration-white/40 group-hover:underline group-focus-visible:underline"
          )}
        >
          {speaker.name}
        </span>
        {speaker.affiliation && (
          <span className="text-[13px] md:text-sm leading-snug text-white/65 break-keep">
            {speaker.affiliation}
          </span>
        )}
      </span>
    </>
  );

  if (!speaker.href) {
    return <div className="flex items-center gap-3">{body}</div>;
  }

  // 하루에 연사 링크가 서른 개 가까이 된다 — 화면에 들어올 때마다 상세 페이지를
  // 미리 받아오면 대부분 쓰이지 않는 데이터라 프리페치를 끈다.
  return (
    <Link
      href={speaker.href}
      prefetch={false}
      className="group flex items-center gap-3 focus:outline-none"
    >
      {body}
    </Link>
  );
}
