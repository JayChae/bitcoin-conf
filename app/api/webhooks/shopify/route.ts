import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { confirmSeats, deleteCheckoutMapping } from "@/lib/seat-lock";
import { redis } from "@/lib/redis";
import { incrementPhase2Sold, incrementPhaseSold } from "@/lib/pricing";

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

  const a = Buffer.from(hmacHeader, "base64");
  const b = Buffer.from(computedHmac, "base64");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
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

  // Extract customer email (try multiple Shopify payload fields)
  const email: string | undefined = payload.contact_email || payload.email || payload.customer?.email || undefined;

  // Extract cart token and build the full GID
  const cartToken = payload.cart_token;
  if (!cartToken) {
    console.error("Webhook payload missing cart_token:", payload);
    return NextResponse.json({ error: "No cart token" }, { status: 400 });
  }

  console.log("[webhook] received:", { orderId, cartToken, email, contact_email: payload.contact_email, payloadEmail: payload.email, customerEmail: payload.customer?.email });

  // Try different cart ID formats
  const cartId = `gid://shopify/Cart/${cartToken}`;

  let result = await confirmSeats(cartId, email);

  // If not found, try with the raw cart token as it might be the full ID already
  if (!result.confirmed && cartToken.startsWith("gid://")) {
    result = await confirmSeats(cartToken, email);
  }

  console.log("[webhook] confirmSeats result:", JSON.stringify(result));

  // If confirmation failed (e.g. checkout mapping expired), return 500
  // so Shopify retries the webhook. Do NOT mark as processed.
  if (!result.confirmed) {
    console.error("[webhook] confirmation failed — checkout mapping not found. orderId:", orderId, "cartId:", cartId);
    return NextResponse.json(
      { success: false, error: "Checkout mapping not found" },
      { status: 500 },
    );
  }

  // Increment phase sold counters
  await incrementPhaseSold(result.phase, result.tier, result.seatCount);
  console.log("[webhook] phase counter incremented:", result.phase, result.tier, "+", result.seatCount);

  if (result.phase === "earlybird2") {
    await incrementPhase2Sold(result.tier, result.seatCount);
    console.log("[webhook] phase2 tier counter incremented:", result.tier, "+", result.seatCount);
  }

  // Mark as processed ONLY after successful confirmation (24h TTL)
  if (orderId) {
    await redis.set(`webhook:order:${orderId}`, "1", { ex: 86400 });
  }

  // Delete checkout mapping last — if earlier steps fail, Shopify retries
  // can still find the mapping and re-process. TTL auto-cleans anyway.
  await deleteCheckoutMapping(cartId);

  return NextResponse.json({ success: true, confirmed: true });
}
