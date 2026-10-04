import type { DayId, RoomId } from "@/app/messages/2026/schedules";

export type SpeakerView = {
  key: string;
  name: string;
  affiliation: string | null;
  // null 이면 이니셜 아바타.
  image: string | null;
  // 프로필이 없는 게스트는 null.
  href: string | null;
};

export type SessionView = {
  id: string;
  start: string;
  end: string | null;
  startMin: number;
  endMin: number | null;
  room: RoomId | null;
  // 세션이 아니라 휴식·점심 같은 구분 행.
  divider: boolean;
  // 제목 위에 붙는 형식 라벨. 기본 형식(발표)이거나 제목이 곧 형식명이면 null.
  formatLabel: string | null;
  title: string;
  // 토픽이 아직 없어 title 이 "주제 추후 공개" 안내문일 때.
  tba: boolean;
  speakers: SpeakerView[];
  href: string | null;
};

type RoomView = { id: RoomId; label: string };

export type ScheduleDayView = {
  id: DayId;
  rooms: RoomView[];
  // 시작 시각 → 공통 행 → 공간 순으로 정렬된 상태.
  sessions: SessionView[];
};

// 공간에서 열리는 세션은 종료 시각이 반드시 있다(없으면 resolver 가 에러를 낸다).
type RoomSession = SessionView & { room: RoomId; end: string; endMin: number };

// col 은 segment.rooms 의 인덱스.
type GridItem = { session: RoomSession; col: number; span: number };

type GridRow = {
  start: string;
  // 이 행에서 가장 흔한 종료 시각. 다르게 끝나는 세션(90분 워크숍 등)은 자기 시간을 따로 표시한다.
  end: string;
  items: GridItem[];
  // 세션이 없고 위 행에서 이어지는 세션도 없는 열. 표의 가로선을 잇는 빈 칸으로 그린다.
  empties: number[];
};

export type TimelineSegment =
  | { kind: "wide"; session: SessionView }
  | { kind: "grid"; key: string; rooms: RoomView[]; rows: GridRow[] };

const isRoomSession = (session: SessionView): session is RoomSession =>
  session.room !== null && session.end !== null && session.endMin !== null;

// 가장 많은 세션이 끝나는 시각. 같으면 이른 쪽.
function commonEnd(sessions: RoomSession[]): string {
  const count = (session: RoomSession) =>
    sessions.filter((other) => other.endMin === session.endMin).length;
  return sessions.reduce((best, session) => {
    const diff = count(session) - count(best);
    return diff > 0 || (diff === 0 && session.endMin < best.endMin)
      ? session
      : best;
  }).end;
}

// 공통 행(휴식·점심 등)을 경계로 블록을 나누고, 블록 안에서는 시작 시각마다 한 행을 만든다.
// 열은 그 블록에서 실제로 세션이 있는 공간만 쓴다 — 한 공간만 진행하는 구간은 1열이 된다.
export function buildTimeline(
  sessions: SessionView[],
  rooms: RoomView[]
): TimelineSegment[] {
  const visible = new Set(rooms.map((room) => room.id));
  const segments: TimelineSegment[] = [];
  let bucket: RoomSession[] = [];
  let seq = 0;

  const flush = () => {
    // 필터로 비는 블록에서도 번호를 올려야 뒤 블록의 key 가 필터와 무관하게 유지된다.
    const key = `grid-${seq++}`;
    const shown = bucket.filter((session) => visible.has(session.room));
    bucket = [];
    if (shown.length === 0) return;

    const cols = rooms.filter((room) =>
      shown.some((session) => session.room === room.id)
    );
    const starts = [...new Set(shown.map((session) => session.startMin))].sort(
      (a, b) => a - b
    );
    // 열마다 "몇 번째 행까지 세션이 이어지는지".
    const coveredUntil = cols.map(() => 0);

    const rows = starts.map((startMin, rowIndex): GridRow => {
      const inRow = shown.filter((session) => session.startMin === startMin);

      const items = inRow.map((session): GridItem => {
        const col = cols.findIndex((room) => room.id === session.room);
        // 진행 중에 시작하는 행 수만큼 아래로 이어진다(90분 워크숍 = 3행).
        const span = starts.filter(
          (other) => other >= startMin && other < session.endMin
        ).length;
        coveredUntil[col] = rowIndex + span;
        return { session, col, span };
      });

      return {
        start: inRow[0].start,
        end: commonEnd(inRow),
        items,
        empties: cols
          .map((_, col) => col)
          .filter((col) => coveredUntil[col] <= rowIndex),
      };
    });

    segments.push({ kind: "grid", key, rooms: cols, rows });
  };

  for (const session of sessions) {
    if (isRoomSession(session)) {
      bucket.push(session);
    } else {
      flush();
      segments.push({ kind: "wide", session });
    }
  }
  flush();

  return segments;
}
