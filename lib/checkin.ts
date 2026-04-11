import { redis } from "./redis";
import { verifyPayload, type QRPayload } from "./qr";

// ─── Types ───

export type CheckinResult =
  | { valid: false; reason: string }
  | { valid: true; alreadyCheckedIn: false; payload: QRPayload }
  | { valid: true; alreadyCheckedIn: true; payload: QRPayload; checkedInAt: string };

// ─── Redis Key ───

function checkinKey(cid: string, section: string, seat: number): string {
  return `checkin:${cid}:${section}:${seat}`;
}

// ─── Check-in Processing ───

/**
 * Verify a QR token and mark the ticket as checked in.
 * - Invalid/tampered token → { valid: false }
 * - First scan → records check-in time, returns { valid: true, alreadyCheckedIn: false }
 * - Duplicate scan → returns { valid: true, alreadyCheckedIn: true, checkedInAt }
 */
export async function processCheckin(token: string): Promise<CheckinResult> {
  const payload = verifyPayload(token);
  if (!payload) {
    return { valid: false, reason: "Invalid or tampered QR code" };
  }

  const key = checkinKey(payload.cid, payload.sec, payload.seat);
  const now = new Date().toISOString();

  // Atomic check-in: SETNX returns true only for the first call
  const wasSet = await redis.setnx(key, now);

  if (!wasSet) {
    const checkedInAt = await redis.get<string>(key);
    return { valid: true, alreadyCheckedIn: true, payload, checkedInAt: checkedInAt! };
  }

  return { valid: true, alreadyCheckedIn: false, payload };
}
