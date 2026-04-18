/**
 * One-off QR token generator for manual ticket reissue.
 * Usage: npx tsx scripts/gen-qr.ts
 */

import { signPayload } from "../lib/qr";

const token = signPayload({
  cid: "328432a6",
  sec: "C",
  seat: 42,
  tier: "premium",
  ap: true,
});

console.log("Token:", token);
console.log("QR URL:", `https://bitcoinkoreaconference.com/api/qr/${token}`);
