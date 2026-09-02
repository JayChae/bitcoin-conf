import type { TierKey } from "../_types/tickets";
import type { SeatTier } from "../_types/seats";
import { TICKETS } from "./tickets";

/** general·mainday가 공유하는 구역 목록 */
const REGULAR_SECTIONS = ["A", "G", "H", "J", "K", "L", "M", "N", "F"];

export const TIER_TO_SEAT_TIER: Record<TierKey, SeatTier> = {
  vip: "vip",
  premium: "premium",
  general: "regular",
  // Main Day는 제너럴과 동일한 물리 좌석 풀을 공유한다
  mainday: "regular",
};

export const TIER_SECTIONS: Record<TierKey, string[]> = {
  vip: ["C", "D"],
  premium: ["A", "B", "C", "D", "E", "F"],
  general: REGULAR_SECTIONS,
  mainday: REGULAR_SECTIONS,
};

/**
 * 좌석 티어 → 대표 티켓 티어.
 * 한 좌석 풀을 여러 티켓 티어가 공유할 수 있으므로, 구매 티어를 알 수 없을 때의 기본값이다.
 * 풀을 소유한 티어(sharesSeatPoolWith가 없는 쪽)를 TICKETS에서 파생하므로 수동 동기화가 필요 없다.
 */
export const DEFAULT_TIER_FOR_POOL = Object.fromEntries(
  TICKETS.filter((t) => !t.sharesSeatPoolWith).map((t) => [
    TIER_TO_SEAT_TIER[t.tier],
    t.tier,
  ]),
) as Record<Exclude<SeatTier, "unavailable">, TierKey>;
