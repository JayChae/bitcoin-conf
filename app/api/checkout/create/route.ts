import { NextRequest, NextResponse } from "next/server";
import { holdSeats, saveCheckoutMapping } from "@/lib/seat-lock";
import { createCheckoutCart } from "@/lib/shopify";
import { getCurrentPhase, getSaleStatus } from "@/lib/pricing";
import type { TierKey } from "@/app/[locale]/(2026)/_types/tickets";
import type { SeatHoldRequest } from "@/app/[locale]/(2026)/_types/seats";

const VALID_TIERS: TierKey[] = ["vip", "premium", "general"];

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { seats, tier, locale } = body as {
    seats: SeatHoldRequest[];
    tier: TierKey;
    locale?: string;
  };

  if (!seats?.length || !tier) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  if (!VALID_TIERS.includes(tier)) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  const saleStatus = await getSaleStatus();
  if (saleStatus !== "open") {
    return NextResponse.json(
      { error: "Sales are not open" },
      { status: 400 },
    );
  }

  // VIP includes after party — force true regardless of client value
  const normalizedSeats =
    tier === "vip"
      ? seats.map((s) => ({ ...s, afterParty: true }))
      : seats;

  // Step 1: Atomically hold seats (7 min TTL)
  const holdResult = await holdSeats(normalizedSeats, tier);

  if (!holdResult.success) {
    return NextResponse.json(
      { error: holdResult.error ?? "Seats unavailable", failedSeats: holdResult.failedSeats },
      { status: 409 },
    );
  }

  // Step 2: Create Shopify checkout
  try {
    const phase = await getCurrentPhase(tier);
    const { cartId, checkoutUrl } = await createCheckoutCart(normalizedSeats, tier, phase, locale);

    const cleanCartId = cartId.split('?')[0];

    console.log("[checkout] phase:", phase, "tier:", tier, "cleanCartId:", cleanCartId, "seats:", normalizedSeats.length);

    await saveCheckoutMapping(cleanCartId, normalizedSeats, tier, phase);
    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error("Failed to create checkout:", error);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 },
    );
  }
}
