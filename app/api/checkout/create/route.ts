import { NextRequest, NextResponse } from "next/server";
import { holdSeats, saveCheckoutMapping, releaseSeats, stampCartIdOnSeats } from "@/lib/seat-lock";
import { createCheckoutCart } from "@/lib/shopify";
import { isTierPurchasable } from "@/lib/shopify-config";
import { isTierHidden } from "@/app/[locale]/(2026)/_constants/tickets";
import { getCurrentPhase, getSaleStatus } from "@/lib/pricing";
import { redis } from "@/lib/redis";
import { isValidTier } from "@/app/[locale]/(2026)/_utils/tierMapping";
import type { TierKey } from "@/app/[locale]/(2026)/_types/tickets";
import type { SeatHoldRequest } from "@/app/[locale]/(2026)/_types/seats";

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

  if (!isValidTier(tier)) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  // 공개 보류된 티어는 카드도 구매 페이지도 없지만, API를 직접 호출하면 뚫린다.
  // 좌석을 잡기 전에 막아 숨긴 티켓이 조용히 팔리는 일을 방지한다.
  if (isTierHidden(tier)) {
    return NextResponse.json({ error: "Tier is not available" }, { status: 404 });
  }

  // Shopify variant가 아직 등록되지 않은 티어는 좌석을 잡기 전에 막는다.
  // 그러지 않으면 잘못된 variant ID로 카트 생성이 실패해 사용자에게는
  // 좌석 예약 실패처럼 보인다.
  if (!isTierPurchasable(tier)) {
    console.error(`[checkout] tier "${tier}" has no Shopify variant configured`);
    return NextResponse.json(
      { error: "Tier is not available for purchase" },
      { status: 503 },
    );
  }

  const saleStatus = await getSaleStatus();
  if (saleStatus !== "open") {
    return NextResponse.json(
      { error: "Sales are not open" },
      { status: 400 },
    );
  }

  // VIP는 애프터 파티 포함, 그 외 티어는 매진되어 애드온 판매 중단.
  // 오래된 클라이언트가 afterParty: true를 보내도 서버에서 강제로 덮어쓴다.
  const normalizedSeats = seats.map((s) => ({
    ...s,
    afterParty: tier === "vip",
  }));

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
