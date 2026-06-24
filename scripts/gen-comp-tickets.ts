/**
 * Comp / giveaway ticket generator — issues valid tickets WITHOUT Shopify.
 *
 * A "ticket" here is just an HMAC-signed QR token (see lib/qr.ts). Check-in
 * (lib/checkin.ts) only verifies the signature, so a token from signPayload is
 * a fully valid, scannable ticket — Shopify is never involved.
 *
 * This script:
 *   1. Auto-assigns currently-available seats per tier
 *   2. Marks those seats "sold" in Redis (email marker = COMP_EMAIL) so they
 *      can't be double-sold and show up in the admin dashboard
 *   3. Signs a QR token per seat, writes a PNG + a CSV/JSON manifest
 *
 * Usage:
 *   npx tsx scripts/gen-comp-tickets.ts            # dry run — preview seat plan, no writes
 *   npx tsx scripts/gen-comp-tickets.ts --commit   # claim seats + generate tokens/PNGs/manifest
 */

import "./_env"; // MUST be first — loads .env before ../lib/redis instantiates its client
import fs from "fs";
import path from "path";
import crypto from "crypto";

import { redis } from "../lib/redis";
import { signPayload, generateQRBuffer } from "../lib/qr";
import { SECTIONS } from "../app/[locale]/(2026)/_constants/seats";
import {
  TIER_TO_SEAT_TIER,
  TIER_SECTIONS,
} from "../app/[locale]/(2026)/_constants/tierMapping";
import type { TierKey } from "../app/[locale]/(2026)/_types/tickets";
import type { SeatTier } from "../app/[locale]/(2026)/_types/seats";

// ─── Config ───

// Marker email so comp tickets are identifiable in the admin dashboard.
const COMP_EMAIL = "giveaway@bitcoinkoreaconference.com";

// What to generate. (VIP includes the after-party by bundle; general/premium do not.)
// `sections` restricts seat assignment to those section(s); omit to use all of the tier's sections.
const SPEC: { tier: TierKey; count: number; afterParty: boolean; sections?: string[] }[] = [
  { tier: "vip", count: 1, afterParty: true }, // VIP only exists in C/D
  { tier: "premium", count: 5, afterParty: false, sections: ["F"] },
  { tier: "general", count: 10, afterParty: false, sections: ["H"] },
];

const OUT_DIR = path.join(process.cwd(), "scripts", "out", "comp-tickets");
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

type Assignment = { tier: TierKey; section: string; seat: number; afterParty: boolean };

// All seats (in section order) whose intrinsic tier matches the ticket tier.
// `restrict`, if given, limits to those sections (intersected with the tier's valid sections).
function candidateSeats(tier: TierKey, restrict?: string[]): { section: string; seat: number }[] {
  const seatTier = TIER_TO_SEAT_TIER[tier];
  const sectionIds = restrict
    ? TIER_SECTIONS[tier].filter((id) => restrict.includes(id))
    : TIER_SECTIONS[tier];
  const out: { section: string; seat: number }[] = [];
  for (const sectionId of sectionIds) {
    const section = SECTIONS.find((s) => s.id === sectionId);
    if (!section) continue;
    for (let seat = 1; seat <= section.totalSeats; seat++) {
      if (getSeatTier(sectionId, seat) === seatTier) out.push({ section: sectionId, seat });
    }
  }
  return out;
}

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

async function pickAvailable(
  tier: TierKey,
  count: number,
  restrict?: string[],
): Promise<{ section: string; seat: number }[]> {
  const candidates = candidateSeats(tier, restrict);
  const keys = candidates.map((c) => seatKey(c.section, c.seat));
  const statuses = await redis.mget<(SeatStatusInfo | null)[]>(...keys);
  const free = candidates.filter((_, i) => {
    const s = statuses[i]?.status;
    return s === undefined || s === null || s === "available";
  });
  if (free.length < count) {
    throw new Error(
      `Not enough available ${tier} seats: need ${count}, found ${free.length}`,
    );
  }
  return free.slice(0, count);
}

// ─── Main ───

async function main() {
  console.log(`\n=== Comp ticket generator (${COMMIT ? "COMMIT" : "DRY RUN"}) ===\n`);

  // 1. Plan: pick available seats for every tier up front.
  const plan: Assignment[] = [];
  for (const { tier, count, afterParty, sections } of SPEC) {
    const seats = await pickAvailable(tier, count, sections);
    for (const s of seats) plan.push({ tier, section: s.section, seat: s.seat, afterParty });
    console.log(
      `${tier.padEnd(8)} ×${count}  →  ${seats.map((s) => `${s.section}${s.seat}`).join(", ")}`,
    );
  }

  if (!COMMIT) {
    console.log(
      `\nDry run only — no seats reserved, no tokens generated.\n` +
        `Re-run with --commit to claim these seats and write tickets to ${OUT_DIR}\n`,
    );
    return;
  }

  // 2. Commit: claim each seat in Redis, then issue token + PNG.
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

  for (const a of plan) {
    const info: SeatStatusInfo = {
      status: "sold",
      tier: a.tier,
      afterParty: a.afterParty,
      email: COMP_EMAIL,
    };
    const claimed = await redis.eval(LUA_CLAIM, [seatKey(a.section, a.seat)], [
      JSON.stringify(info),
    ]);
    if (claimed !== 1) {
      console.warn(`  ⚠ Skipped ${a.section}${a.seat} (${a.tier}) — became unavailable`);
      continue;
    }

    const cid = crypto.randomBytes(4).toString("hex"); // unique per ticket
    const token = signPayload({
      cid,
      sec: a.section,
      seat: a.seat,
      tier: a.tier,
      ap: a.afterParty,
    });
    const fileName = `${a.tier}_${a.section}${a.seat}.png`;
    const png = await generateQRBuffer(token);
    fs.writeFileSync(path.join(OUT_DIR, fileName), png);

    manifest.push({
      tier: a.tier,
      section: a.section,
      seat: a.seat,
      afterParty: a.afterParty,
      cid,
      token,
      qrUrl: `${QR_BASE}/${token}`,
      file: fileName,
    });
    console.log(`  ✓ ${a.tier.padEnd(8)} ${a.section}${a.seat}  →  ${fileName}`);
  }

  // 3. Write manifests.
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
