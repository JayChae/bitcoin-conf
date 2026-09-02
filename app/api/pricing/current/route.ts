import { NextRequest, NextResponse } from "next/server";
import {
  getCurrentPhase,
  getDiscountRate,
  getPricingConfig,
  getPhase2Sold,
  PHASE2_TIERS,
} from "@/lib/pricing";
import { isValidTier } from "@/app/[locale]/(2026)/_utils/tierMapping";

export async function GET(request: NextRequest) {
  const tier = request.nextUrl.searchParams.get("tier");

  if (tier !== null && !isValidTier(tier)) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  // config를 먼저 읽어 getCurrentPhase가 같은 키를 다시 GET 하지 않게 한다
  const config = await getPricingConfig();
  const phase = await getCurrentPhase(tier ?? undefined, config);
  const discount = getDiscountRate(phase);

  const response: Record<string, unknown> = { phase, discount };

  // Include Phase 2 remaining info if relevant (VIP·Main Day excluded from Phase 2)
  if (tier && config.phase2.enabled && PHASE2_TIERS.includes(tier)) {
    const sold = await getPhase2Sold(tier);
    const max = config.phase2.maxTickets[tier] ?? 0;
    response.phase2Remaining = Math.max(0, max - sold);
  }

  return NextResponse.json(response);
}
