import { NextRequest, NextResponse } from "next/server";
import { getCurrentPhase, getDiscountRate, getPricingConfig, getPhase2Sold } from "@/lib/pricing";
import type { TierKey } from "@/app/[locale]/(2026)/_types/tickets";

const VALID_TIERS = new Set<string>(["vip", "premium", "general"]);

export async function GET(request: NextRequest) {
  const tier = request.nextUrl.searchParams.get("tier") as TierKey | null;

  if (tier && !VALID_TIERS.has(tier)) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  const phase = await getCurrentPhase(tier ?? undefined);
  const discount = getDiscountRate(phase);
  const config = await getPricingConfig();

  const response: Record<string, unknown> = { phase, discount };

  // Include Phase 2 remaining info if relevant (VIP excluded from Phase 2)
  if (tier && config.phase2.enabled && tier !== "vip") {
    const sold = await getPhase2Sold(tier);
    const max = config.phase2.maxTickets[tier] ?? 0;
    response.phase2Remaining = Math.max(0, max - sold);
  }

  return NextResponse.json(response);
}
