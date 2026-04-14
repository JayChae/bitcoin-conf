import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { confirmSeats, deleteCheckoutMapping, type ConfirmFailureReason } from "@/lib/seat-lock";
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

    // If mapping not found, try with the raw cart token as it might be the full ID already
    if (!result.confirmed && result.reason === "mapping_expired" && cartToken.startsWith("gid://")) {
      matchedCartId = cartToken;
      result = await confirmSeats(matchedCartId, email);
    }

    console.log("[webhook] confirmSeats result:", JSON.stringify(result));

    if (!result.confirmed) {
      const reason: ConfirmFailureReason = result.reason;
      console.error("[webhook] confirmation failed:", { orderId, cartId: matchedCartId, reason });

      await sendDiscordAlert(
        `**좌석 확정 실패 — 환불 필요**\n` +
        `주문 ID: ${orderId}\n` +
        `이메일: ${email ?? "없음"}\n` +
        `Cart ID: ${matchedCartId}\n` +
        `사유: ${reason}`,
      );

      // Permanent failures: stop retrying (return 200), keep idempotency key
      if (reason === "mapping_expired" || reason === "already_sold") {
        if (orderId) await redis.set(`webhook:order:${orderId}`, `failed:${reason}`, { ex: 86400 });
        return NextResponse.json(
          { success: false, error: reason, needsRefund: true },
          { status: 200 },
        );
      }

      // Transient failure (held_by_other): allow limited retries
      if (reason === "held_by_other" && orderId) {
        const retryKey = `webhook:retry:${orderId}`;
        const retryCount = await redis.incr(retryKey);
        if (retryCount === 1) await redis.expire(retryKey, 3600);

        if (retryCount > 3) {
          await redis.set(`webhook:order:${orderId}`, "failed:max_retries", { ex: 86400 });
          return NextResponse.json(
            { success: false, error: "Max retries exceeded", needsRefund: true },
            { status: 200 },
          );
        }

        // Allow Shopify retry
        await redis.del(`webhook:order:${orderId}`);
        return NextResponse.json(
          { success: false, error: "held_by_other" },
          { status: 500 },
        );
      }

      // Unknown reason — allow retry
      if (orderId) await redis.del(`webhook:order:${orderId}`);
      return NextResponse.json(
        { success: false, error: "Confirmation failed" },
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

    // Cap retries for unexpected errors
    if (orderId) {
      const retryKey = `webhook:retry:${orderId}`;
      const retryCount = await redis.incr(retryKey);
      if (retryCount === 1) await redis.expire(retryKey, 3600);

      if (retryCount > 5) {
        await sendDiscordAlert(
          `**웹훅 처리 반복 실패**\n` +
          `주문 ID: ${orderId}\n` +
          `에러: ${error instanceof Error ? error.message : String(error)}`,
        );
        await redis.set(`webhook:order:${orderId}`, "failed:error", { ex: 86400 });
        return NextResponse.json(
          { success: false, error: "Internal error - max retries" },
          { status: 200 },
        );
      }

      await redis.del(`webhook:order:${orderId}`);
    }

    return NextResponse.json(
      { success: false, error: "Internal error" },
      { status: 500 },
    );
  }
}
