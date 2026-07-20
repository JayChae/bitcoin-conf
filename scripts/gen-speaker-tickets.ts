/**
 * Speaker seat reservation — claims a FIXED seat list and issues valid tickets.
 *
 * Same mechanism as gen-comp-tickets.ts (HMAC-signed QR token = a real,
 * scannable ticket; Shopify is never involved), but the seats are specified
 * explicitly instead of auto-assigned, because speakers sit in a known block.
 *
 * This script:
 *   1. Checks each listed seat's intrinsic tier + current Redis status
 *   2. Marks the free ones "sold" in Redis (email marker = SPEAKER_EMAIL) so
 *      they can't be sold to the public and show up in the admin dashboard
 *   3. Signs a QR token per seat, writes a PNG + a CSV/JSON manifest
 *
 * Usage:
 *   npx tsx scripts/gen-speaker-tickets.ts            # dry run — preview, no writes
 *   npx tsx scripts/gen-speaker-tickets.ts --commit   # claim seats + generate tokens/PNGs/manifest
 */

import "./_env"; // MUST be first — loads .env before ../lib/redis instantiates its client
import fs from "fs";
import path from "path";
import crypto from "crypto";

import { redis } from "../lib/redis";
import { signPayload, generateQRBuffer } from "../lib/qr";
import { SECTIONS } from "../app/[locale]/(2026)/_constants/seats";
import { TIER_TO_SEAT_TIER } from "../app/[locale]/(2026)/_constants/tierMapping";
import type { TierKey } from "../app/[locale]/(2026)/_types/tickets";
import type { SeatTier } from "../app/[locale]/(2026)/_types/seats";

// ─── Config ───

// Marker email so speaker seats are identifiable in the admin dashboard.
const SPEAKER_EMAIL = "speakers@bitcoinkoreaconference.com";

const SECTION = "A";
// A-1 ~ A-22, minus seats already sold to the public.
const SEAT_FROM = 1;
const SEAT_TO = 22;
const EXCLUDE = new Set([7]); // A-7 — already sold

// A-1~A-65 are premium seats. Premium doesn't bundle the after-party, but
// speakers get it regardless.
const TIER: TierKey = "premium";
const AFTER_PARTY = true;

const OUT_DIR = path.join(process.cwd(), "scripts", "out", "speaker-tickets");
const QR_BASE = "https://bitcoinkoreaconference.com/api/qr";
const COMMIT = process.argv.includes("--commit");

// ─── Helpers ───

// Re-implemented locally to avoid pulling in @/-aliased modules under tsx.
function getSeatTier(sectionId: string, seatNumber: number): SeatTier {
  const section = SECTIONS.find((s) => s.id === sectionId);
  if (!section) return "unavailable";
  for (const range of section.tierRanges) {
    if (seatNumber >= range.from && seatNumber <= range.to) return range.tier;
  }
  return "unavailable";
}

function seatKey(section: string, seat: number) {
  return `seat:${section}:${seat}`;
}

type SeatStatusInfo = {
  status: "available" | "held" | "sold";
  tier?: string;
  afterParty?: boolean;
  email?: string;
  cartId?: string;
};

// Claim a seat only if it is not already held/sold (atomic). Returns true on success.
const LUA_CLAIM = `
local val = redis.call('GET', KEYS[1])
if val then
  local info = cjson.decode(val)
  if info.status == 'sold' or info.status == 'held' then
    return 0
  end
end
redis.call('SET', KEYS[1], ARGV[1])
return 1
`;

// ─── Main ───

async function main() {
  console.log(`\n=== Speaker seat reservation (${COMMIT ? "COMMIT" : "DRY RUN"}) ===\n`);

  const targets: number[] = [];
  for (let seat = SEAT_FROM; seat <= SEAT_TO; seat++) {
    if (!EXCLUDE.has(seat)) targets.push(seat);
  }

  // 1. Verify every target seat really is a TIER seat — a mismatch would issue
  //    a ticket the check-in tier doesn't match.
  const expectedSeatTier = TIER_TO_SEAT_TIER[TIER];
  const wrongTier = targets.filter(
    (seat) => getSeatTier(SECTION, seat) !== expectedSeatTier,
  );
  if (wrongTier.length > 0) {
    throw new Error(
      `Not ${TIER} seats: ${wrongTier.map((s) => `${SECTION}-${s}`).join(", ")}`,
    );
  }

  // 2. Report current occupancy so a dry run shows exactly what will happen.
  const statuses = await redis.mget<(SeatStatusInfo | null)[]>(
    ...targets.map((seat) => seatKey(SECTION, seat)),
  );
  const free: number[] = [];
  const taken: { seat: number; info: SeatStatusInfo }[] = [];
  targets.forEach((seat, i) => {
    const info = statuses[i];
    if (info && (info.status === "sold" || info.status === "held")) {
      taken.push({ seat, info });
    } else {
      free.push(seat);
    }
  });

  console.log(
    `Target: ${SECTION}-${SEAT_FROM}~${SEAT_TO} minus ${[...EXCLUDE]
      .map((s) => `${SECTION}-${s}`)
      .join(", ")}  →  ${targets.length} seats\n`,
  );
  console.log(`  claimable (${free.length}): ${free.map((s) => `${SECTION}${s}`).join(", ")}`);
  if (taken.length > 0) {
    console.log(`  already taken (${taken.length}):`);
    for (const t of taken) {
      console.log(
        `    ${SECTION}${t.seat}  ${t.info.status}  ${t.info.email ?? "(no email)"}`,
      );
    }
  }

  if (!COMMIT) {
    console.log(
      `\nDry run only — no seats reserved, no tokens generated.\n` +
        `Re-run with --commit to claim these seats and write tickets to ${OUT_DIR}\n`,
    );
    return;
  }

  // 3. Commit: claim each seat in Redis, then issue token + PNG.
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const manifest: {
    tier: TierKey;
    section: string;
    seat: number;
    afterParty: boolean;
    cid: string;
    token: string;
    qrUrl: string;
    file: string;
  }[] = [];

  console.log("");
  for (const seat of free) {
    const info: SeatStatusInfo = {
      status: "sold",
      tier: TIER,
      afterParty: AFTER_PARTY,
      email: SPEAKER_EMAIL,
    };
    const claimed = await redis.eval(LUA_CLAIM, [seatKey(SECTION, seat)], [
      JSON.stringify(info),
    ]);
    if (claimed !== 1) {
      console.warn(`  ⚠ Skipped ${SECTION}${seat} — became unavailable`);
      continue;
    }

    const cid = crypto.randomBytes(4).toString("hex"); // unique per ticket
    const token = signPayload({
      cid,
      sec: SECTION,
      seat,
      tier: TIER,
      ap: AFTER_PARTY,
    });
    const fileName = `speaker_${SECTION}${seat}.png`;
    const png = await generateQRBuffer(token);
    fs.writeFileSync(path.join(OUT_DIR, fileName), png);

    manifest.push({
      tier: TIER,
      section: SECTION,
      seat,
      afterParty: AFTER_PARTY,
      cid,
      token,
      qrUrl: `${QR_BASE}/${token}`,
      file: fileName,
    });
    console.log(`  ✓ ${SECTION}${seat}  →  ${fileName}`);
  }

  // 4. Write manifests.
  fs.writeFileSync(path.join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2));
  const csv = [
    "tier,section,seat,afterParty,cid,token,qrUrl,file",
    ...manifest.map((m) =>
      [m.tier, m.section, m.seat, m.afterParty, m.cid, `"${m.token}"`, `"${m.qrUrl}"`, m.file].join(","),
    ),
  ].join("\n");
  fs.writeFileSync(path.join(OUT_DIR, "manifest.csv"), csv);

  console.log(
    `\nDone. ${manifest.length} tickets written to:\n  ${OUT_DIR}\n` +
      `  - PNG per ticket\n  - manifest.csv / manifest.json (token + QR URL)\n`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("\n✗ Failed:", err);
    process.exit(1);
  });
