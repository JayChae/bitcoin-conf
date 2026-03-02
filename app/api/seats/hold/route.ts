import { NextRequest, NextResponse } from "next/server";
import { holdSeats } from "@/lib/seat-lock";
import type { TierKey } from "@/app/[locale]/(2026)/_types/tickets";

const VALID_TIERS: TierKey[] = ["vip", "premium", "general"];

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { sessionId, seats, tier } = body as {
    sessionId: string;
    seats: { section: string; seat: number; afterParty: boolean }[];
    tier: TierKey;
  };

  if (!sessionId || !seats?.length || !tier) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  if (!VALID_TIERS.includes(tier)) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  // VIP includes after party — force true regardless of client value
  const normalizedSeats =
    tier === "vip"
      ? seats.map((s) => ({ ...s, afterParty: true }))
      : seats;

  try {
    const result = await holdSeats(sessionId, normalizedSeats, tier);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error ?? "Seats unavailable", failedSeats: result.failedSeats },
        { status: 409 },
      );
    }

    return NextResponse.json({ success: true, holdExpiresIn: 7 * 60 });
  } catch {
    return NextResponse.json(
      { error: "Failed to hold seats" },
      { status: 500 },
    );
  }
}
