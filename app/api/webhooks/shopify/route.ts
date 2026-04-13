import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { confirmSeats, deleteCheckoutMapping } from "@/lib/seat-lock";
import { redis } from "@/lib/redis";
import { incrementPhase2Sold, incrementPhaseSold } from "@/lib/pricing";
import { sendDiscordAlert } from "@/lib/discord";

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

  // Only process orders/paid events (ignore orders/create, orders/updated, etc.)
  const topic = request.headers.get("x-shopify-topic");
  if (topic && topic !== "orders/paid") {
    return NextResponse.json({ ignored: true, topic }, { status: 200 });
  }

  const payload = JSON.parse(body);

  // Atomic idempotency: SET NX prevents race condition between duplicate webhooks
  const orderId = payload.id?.toString();
  if (orderId) {
    const claimed = await redis.set(`webhook:order:${orderId}`, "processing", {
      nx: true,
      ex: 86400,
    });
    if (!claimed) {
      return NextResponse.json({ success: true, message: "Already processing" });
    }
  }

  try {
    // Extract customer email (try multiple Shopify payload fields)
    const email: string | undefined = payload.contact_email || payload.email || payload.customer?.email || undefined;

    // Extract cart token and build the full GID (strip query params for consistency)
    const rawCartToken = payload.cart_token;
    if (!rawCartToken) {
      console.error("Webhook payload missing cart_token:", payload);
      if (orderId) await redis.del(`webhook:order:${orderId}`);
      return NextResponse.json({ error: "No cart token" }, { status: 400 });
    }
    const cartToken = rawCartToken.split("?")[0];

    console.log("[webhook] received:", { orderId, cartToken, email, contact_email: payload.contact_email, payloadEmail: payload.email, customerEmail: payload.customer?.email });

    // Try different cart ID formats
    let matchedCartId = `gid://shopify/Cart/${cartToken}`;

    let result = await confirmSeats(matchedCartId, email);

    // If not found, try with the raw cart token as it might be the full ID already
    if (!result.confirmed && cartToken.startsWith("gid://")) {
      matchedCartId = cartToken;
      result = await confirmSeats(matchedCartId, email);
    }

    console.log("[webhook] confirmSeats result:", JSON.stringify(result));

    // If confirmation failed (e.g. checkout mapping expired or seats already sold),
    // return 500 so Shopify retries the webhook. Do NOT mark as processed.
    if (!result.confirmed) {
      console.error("[webhook] confirmation failed — checkout mapping not found. orderId:", orderId, "cartId:", matchedCartId);
      await sendDiscordAlert(
        `🚨 **좌석 확정 실패 — 환불 필요**\n` +
        `주문 ID: ${orderId}\n` +
        `이메일: ${email ?? "없음"}\n` +
        `Cart ID: ${matchedCartId}\n` +
        `사유: checkout 매핑 없음 또는 좌석 이미 판매됨`,
      );
      // Remove idempotency key so Shopify retry can re-process
      if (orderId) await redis.del(`webhook:order:${orderId}`);
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

    // Delete checkout mapping — TTL auto-cleans anyway as fallback
    await deleteCheckoutMapping(matchedCartId);

    return NextResponse.json({ success: true, confirmed: true });
  } catch (error) {
    console.error("[webhook] unexpected error:", error);
    // Remove idempotency key so Shopify retry can re-process
    if (orderId) await redis.del(`webhook:order:${orderId}`);
    return NextResponse.json(
      { success: false, error: "Internal error" },
      { status: 500 },
    );
  }
}
