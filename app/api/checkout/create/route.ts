import { NextRequest, NextResponse } from "next/server";
import { holdSeats, saveCheckoutMapping, releaseSeats, stampCartIdOnSeats } from "@/lib/seat-lock";
import { createCheckoutCart } from "@/lib/shopify";
import { getCurrentPhase, getSaleStatus } from "@/lib/pricing";
import { redis } from "@/lib/redis";
import type { TierKey } from "@/app/[locale]/(2026)/_types/tickets";
import type { SeatHoldRequest } from "@/app/[locale]/(2026)/_types/seats";

const VALID_TIERS: TierKey[] = ["vip", "premium", "general"];

export async function POST(request: NextRequest) {
  // Rate limiting: 5 checkout attempts per IP per minute
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rateLimitKey = `ratelimit:checkout:${ip}`;
  const count = await redis.incr(rateLimitKey);
  if (count === 1) await redis.expire(rateLimitKey, 60);
  if (count > 5) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

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

  // Step 1: Atomically hold seats (30 min TTL)
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

    // Stamp cartId on held seats for ownership verification + extend TTL to match checkout mapping
    await stampCartIdOnSeats(normalizedSeats, cleanCartId);
    await saveCheckoutMapping(cleanCartId, normalizedSeats, tier, phase);
    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error("Failed to create checkout:", error);
    // Release held seats so user can retry immediately
    await releaseSeats(normalizedSeats);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 },
    );
  }
}
