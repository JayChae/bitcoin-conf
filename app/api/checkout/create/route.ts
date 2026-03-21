import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { saveCheckoutMapping } from "@/lib/seat-lock";
import { createCheckoutCart } from "@/lib/shopify";
import { getCurrentPhase } from "@/lib/pricing";
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
    const phase = await getCurrentPhase(tier);
    const { cartId, checkoutUrl } = await createCheckoutCart(holdsData, tier, phase);

    // Remove query parameters from cartId for consistent Redis key mapping
    // Shopify returns: gid://shopify/Cart/xxx?key=yyy
    // We need to store: gid://shopify/Cart/xxx
    const cleanCartId = cartId.split('?')[0];

    console.log("Created checkout with cartId:", cartId);
    console.log("Saving to Redis with cleanCartId:", cleanCartId);

    await saveCheckoutMapping(cleanCartId, sessionId, holdsData, tier, phase);
    return NextResponse.json({ checkoutUrl, cartId });
  } catch (error) {
    console.error("Failed to create checkout:", error);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 },
    );
  }
}
