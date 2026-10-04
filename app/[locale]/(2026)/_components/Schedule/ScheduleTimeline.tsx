import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import SessionItem from "./SessionItem";
import { MONO_CLASS, PAGE_BG_CLASS, RULE_CLASS } from "./styles";
import type { TimelineSegment } from "./timeline";

type Props = {
  segments: TimelineSegment[];
  accent: string;
  // 여러 공간을 한 표에 섞어 보여주는 중인지.
  showRoom: boolean;
  // 바로 위에 필터 탭의 밑줄이 있으면 첫 가로선을 그 선에 겹친다.
  flushTop: boolean;
};

// 박스 없이 [시간 | 내용] 두 열과 가로선만으로 읽히는 표.
// 모바일은 한 시간 옆에 공간별 세션이 세로로 쌓이고, lg 부터는 같은 DOM 이
// [시간 | 공간별 열] 그리드가 된다(행 래퍼가 lg:contents 로 사라진다).
// 시간 열의 폭은 --time-col 한 곳에서 정한다.
export default function ScheduleTimeline({
  segments,
  accent,
  showRoom,
  flushTop,
}: Props) {
  return (
    <div
      className={cn(
        "border-b [--time-col:3.75rem] lg:[--time-col:5.5rem]",
        RULE_CLASS,
        flushTop && "-mt-px"
      )}
    >
      {segments.map((segment) => {
        if (segment.kind === "wide") {
          const { session } = segment;
          return (
            <div
              key={session.id}
              className={cn(
                "grid grid-cols-[var(--time-col)_minmax(0,1fr)] gap-x-4 border-t lg:gap-x-8",
                RULE_CLASS,
                session.divider ? "py-4" : "py-6 lg:pt-5 lg:pb-8"
              )}
            >
              <TimeCell
                start={session.start}
                end={session.end}
                muted={session.divider}
              />
              {session.divider ? (
                <p className="text-base md:text-lg font-medium text-white/50">
                  {session.title}
                </p>
              ) : (
                <SessionItem session={session} accent={accent} />
              )}
            </div>
          );
        }

        const columns = `var(--time-col) repeat(${segment.rooms.length}, minmax(0, 1fr))`;
        const compact = segment.rooms.length > 1;

        return (
          <div
            key={segment.key}
            className="lg:grid lg:gap-x-8"
            style={{ gridTemplateColumns: columns }}
          >
            {showRoom && (
              // 필터 탭 바로 아래에 붙는 열 머리글. 밑줄은 본문 칸과 같이 열마다 끊는다.
              <div
                className={cn(
                  "sticky top-[calc(var(--nav-h)_+_var(--tabs-h))] z-10 hidden gap-x-8 lg:grid",
                  PAGE_BG_CLASS
                )}
                style={{
                  gridColumn: "1 / -1",
                  gridRow: "1",
                  gridTemplateColumns: columns,
                }}
              >
                <span className={cn("border-b", RULE_CLASS)} />
                {segment.rooms.map((room) => (
                  <p
                    key={room.id}
                    className={cn(
                      "border-b py-3 text-[15px] font-semibold text-white",
                      RULE_CLASS
                    )}
                  >
                    {room.label}
                  </p>
                ))}
              </div>
            )}

            {segment.rows.map((row, rowIndex) => {
              // 그리드 1행은 열 머리글, 1열은 시간 자리다.
              const gridRow = rowIndex + 2;
              // 머리글 바로 아래 행은 머리글의 밑줄이 윗선을 대신한다.
              const ruled = !(showRoom && rowIndex === 0);
              const cell = cn("lg:pt-5", ruled && ["lg:border-t", RULE_CLASS]);

              return (
                // 모바일 행은 flex 다 — 그리드로 두면 아래 인라인 grid 배치가 모바일에서도 먹는다.
                <div
                  key={row.start}
                  className={cn(
                    "flex gap-x-4 border-t py-6 lg:contents",
                    RULE_CLASS
                  )}
                >
                  <TimeCell
                    start={row.start}
                    end={row.end}
                    className={cn("w-(--time-col) shrink-0", cell)}
                    style={{ gridColumn: "1", gridRow: `${gridRow}` }}
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-5 lg:contents">
                    {row.items.map(({ session, col, span }, index) => (
                      <SessionItem
                        key={session.id}
                        session={session}
                        accent={accent}
                        roomLabel={
                          showRoom ? segment.rooms[col].label : undefined
                        }
                        showTime={session.end !== row.end}
                        compact={compact}
                        className={cn(
                          // 같은 시간대 세션 사이의 옅은 구분선은 세로로 쌓이는 폭에서만 쓴다.
                          index > 0 &&
                            "max-lg:border-t max-lg:border-white/[0.07] max-lg:pt-5",
                          cell,
                          "lg:pb-8"
                        )}
                        style={{
                          gridColumn: `${col + 2}`,
                          gridRow: `${gridRow} / span ${span}`,
                        }}
                      />
                    ))}
                    {row.empties.map((col) => (
                      <div
                        key={col}
                        aria-hidden
                        className={cn("hidden lg:block", cell)}
                        style={{
                          gridColumn: `${col + 2}`,
                          gridRow: `${gridRow}`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function TimeCell({
  start,
  end,
  muted = false,
  className,
  style,
}: {
  start: string;
  end: string | null;
  muted?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={cn(MONO_CLASS, "leading-none tabular-nums", className)}
      style={style}
    >
      <p
        className={cn(
          "text-xl lg:text-2xl font-semibold",
          muted ? "text-white/45" : "text-white"
        )}
      >
        {start}
      </p>
      {end && <p className="mt-2 text-[13px] text-white/50">– {end}</p>}
    </div>
  );
}
