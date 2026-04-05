import crypto from "crypto";
import QRCode from "qrcode";

// ─── Types ───

export type QRPayload = {
  cid: string; // unique checkout ID (UUID)
  sec: string; // seat section
  seat: number; // seat number
  tier: string; // vip | premium | general
  ap: boolean; // after party
};

// ─── HMAC Signing / Verification ───

function getSecret(): string {
  const secret = process.env.CHECKIN_SECRET;
  if (!secret) throw new Error("CHECKIN_SECRET environment variable is not set");
  return secret;
}

/**
 * Sign a QR payload with HMAC-SHA256.
 * Returns a compact token: `base64url(JSON).hmac16hex`
 */
export function signPayload(payload: QRPayload): string {
  const data = JSON.stringify(payload);
  const sig = crypto
    .createHmac("sha256", getSecret())
    .update(data)
    .digest("hex")
    .slice(0, 16);
  return `${Buffer.from(data).toString("base64url")}.${sig}`;
}

/**
 * Verify a signed token and extract the payload.
 * Returns null if the token is invalid or tampered.
 */
export function verifyPayload(token: string): QRPayload | null {
  const dotIndex = token.lastIndexOf(".");
  if (dotIndex === -1) return null;

  const dataB64 = token.slice(0, dotIndex);
  const sig = token.slice(dotIndex + 1);
  if (!dataB64 || !sig) return null;

  try {
    const data = Buffer.from(dataB64, "base64url").toString();
    const expected = crypto
      .createHmac("sha256", getSecret())
      .update(data)
      .digest("hex")
      .slice(0, 16);

    if (sig !== expected) return null;
    return JSON.parse(data) as QRPayload;
  } catch {
    return null;
  }
}

// ─── QR Image Generation ───

/**
 * Generate a QR code PNG buffer from a token string.
 */
export async function generateQRBuffer(token: string): Promise<Buffer> {
  return QRCode.toBuffer(token, {
    type: "png",
    width: 300,
    margin: 2,
    color: { dark: "#000000", light: "#FFFFFF" },
    errorCorrectionLevel: "M",
  });
}
