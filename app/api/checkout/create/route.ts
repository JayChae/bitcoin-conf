import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { saveCheckoutMapping } from "@/lib/seat-lock";
import { createCheckoutCart } from "@/lib/shopify";
import type { TierKey } from "@/app/[locale]/(2026)/_types/tickets";
import type { SeatHoldRequest, SeatStatusInfo } from "@/app/[locale]/(2026)/_types/seats";

export async function POST(request: NextRequest) {
  const { sessionId } = await request.json();

  if (!sessionId) {
    return NextResponse.json(
      { error: "sessionId required" },
      { status: 400 },
    );
  }

  // Get held seats
  const holdsData = await redis.get<SeatHoldRequest[]>(`holds:${sessionId}`);
  if (!holdsData || holdsData.length === 0) {
    return NextResponse.json(
      { error: "No active holds found" },
      { status: 404 },
    );
  }

  // Get tier from the first held seat
  const firstSeat = holdsData[0];
  const seatData = await redis.get<SeatStatusInfo>(
    `seat:${firstSeat.section}:${firstSeat.seat}`,
  );
  if (!seatData || seatData.status !== "held") {
    return NextResponse.json({ error: "Hold expired" }, { status: 410 });
  }

  const tier = seatData.tier as TierKey;

  try {
    const { cartId, checkoutUrl } = await createCheckoutCart(holdsData, tier);
    await saveCheckoutMapping(cartId, sessionId, holdsData, tier);
    return NextResponse.json({ checkoutUrl, cartId });
  } catch {
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 },
    );
  }
}
