import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { confirmSeats } from "@/lib/seat-lock";
import { redis } from "@/lib/redis";
import { getCurrentPhase, incrementPhase2Sold } from "@/lib/pricing";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const hmacHeader = request.headers.get("x-shopify-hmac-sha256");

  // HMAC verification
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret || !hmacHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const computedHmac = crypto
    .createHmac("sha256", secret)
    .update(body, "utf8")
    .digest("base64");

  if (hmacHeader !== computedHmac) {
    return NextResponse.json({ error: "Invalid HMAC" }, { status: 401 });
  }

  const payload = JSON.parse(body);

  // Idempotency: skip if already processed
  const orderId = payload.id?.toString();
  if (orderId) {
    const alreadyProcessed = await redis.get(`webhook:order:${orderId}`);
    if (alreadyProcessed) {
      return NextResponse.json({ success: true, message: "Already processed" });
    }
  }

  // Extract cart token and build the full GID
  const cartToken = payload.cart_token;
  if (!cartToken) {
    console.error("Webhook payload missing cart_token:", payload);
    return NextResponse.json({ error: "No cart token" }, { status: 400 });
  }

  console.log("Webhook received:", {
    orderId: orderId,
    cartToken: cartToken,
    noteAttributes: payload.note_attributes,
  });

  // Try different cart ID formats
  const cartId = `gid://shopify/Cart/${cartToken}`;
  console.log("Attempting to confirm seats with cartId:", cartId);

  let result = await confirmSeats(cartId);

  // If not found, try with the raw cart token as it might be the full ID already
  if (!result.confirmed && cartToken.startsWith("gid://")) {
    console.log("Retrying with raw cart token:", cartToken);
    result = await confirmSeats(cartToken);
  }

  // Increment Phase 2 sold counter if applicable
  if (result.confirmed) {
    const phase = await getCurrentPhase(result.tier);
    if (phase === "earlybird2") {
      await incrementPhase2Sold(result.tier, result.seatCount);
    }
  }

  // Mark as processed (24h TTL)
  if (orderId) {
    await redis.set(`webhook:order:${orderId}`, "1", { ex: 86400 });
  }

  return NextResponse.json({ success: true, confirmed: result.confirmed });
}
