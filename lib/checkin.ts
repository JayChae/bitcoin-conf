import { redis } from "./redis";
import { verifyPayload, type QRPayload } from "./qr";
import { TIER_VALID_DAYS } from "@/app/[locale]/(2026)/_constants/tickets";
import type { TierKey } from "@/app/[locale]/(2026)/_types/tickets";

// ─── Types ───

export type CheckinResult =
  | { valid: false; reason: string }
  | { valid: true; alreadyCheckedIn: false; payload: QRPayload }
  | { valid: true; alreadyCheckedIn: true; payload: QRPayload; checkedInAt: string };

// ─── Date ───

/** 행사 기준 시간대(KST)의 오늘 날짜 — YYYY-MM-DD */
export function todayInKST(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" });
}

// ─── Redis Key ───

/**
 * 체크인 도장 키. 날짜를 포함해 "하루 1회"로 동작한다.
 * 날짜가 없으면 이틀권 소지자 전원이 Day 2에 "이미 체크인됨"으로 걸려,
 * 스태프가 중복 경고를 무시하도록 학습된다 — 부정 사용 신호가 죽는다.
 */
function checkinKey(cid: string, section: string, seat: number, day: string): string {
  return `checkin:${cid}:${section}:${seat}:${day}`;
}

// ─── Check-in Processing ───

/**
 * Verify a QR token and mark the ticket as checked in for today (KST).
 * - Invalid/tampered token → { valid: false }
 * - Ticket not valid today (e.g. Main Day on Day 2) → { valid: false }
 * - First scan today → records check-in time, returns { valid: true, alreadyCheckedIn: false }
 * - Duplicate scan today → returns { valid: true, alreadyCheckedIn: true, checkedInAt }
 */
export async function processCheckin(token: string): Promise<CheckinResult> {
  const payload = verifyPayload(token);
  if (!payload) {
    return { valid: false, reason: "Invalid or tampered QR code" };
  }

  const today = todayInKST();

  // 입장 가능 일자가 지정된 티어(Main Day 등)는 그 날짜에만 통과시킨다.
  // 시안색 뱃지 + 스태프 육안 확인에만 기대면 Day 2 통제가 되지 않는다.
  const validity = TIER_VALID_DAYS[payload.tier as TierKey];
  if (validity && !validity.days.includes(today)) {
    return {
      valid: false,
      reason: `Not valid today — this ticket is for ${validity.days.join(", ")} only`,
    };
  }

  const key = checkinKey(payload.cid, payload.sec, payload.seat, today);
  const now = new Date().toISOString();

  // Atomic check-in: SETNX returns true only for the first call
  const wasSet = await redis.setnx(key, now);

  if (!wasSet) {
    const checkedInAt = await redis.get<string>(key);
    return { valid: true, alreadyCheckedIn: true, payload, checkedInAt: checkedInAt! };
  }

  return { valid: true, alreadyCheckedIn: false, payload };
}
