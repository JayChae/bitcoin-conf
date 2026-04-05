import { NextRequest, NextResponse } from "next/server";
import { getRemainingSeatsBySectionForTier } from "@/lib/seat-lock";
import { getSelectableCount } from "@/app/[locale]/(2026)/_utils/tierMapping";
import { TIER_SECTIONS } from "@/app/[locale]/(2026)/_constants/tierMapping";
import type { TierKey } from "@/app/[locale]/(2026)/_types/tickets";

const VALID_TIERS: TierKey[] = ["vip", "premium", "general"];

export async function GET(request: NextRequest) {
  const tier = request.nextUrl.searchParams.get("tier") as TierKey | null;

  if (!tier || !VALID_TIERS.includes(tier)) {
    return NextResponse.json(
      { error: "Valid tier parameter required (vip, premium, general)" },
      { status: 400 },
    );
  }

  try {
    const sections = await getRemainingSeatsBySectionForTier(tier);
    return NextResponse.json({ tier, sections });
  } catch {
    const fallback: Record<string, number> = {};
    for (const id of TIER_SECTIONS[tier]) {
      fallback[id] = getSelectableCount(id, tier);
    }
    return NextResponse.json({ tier, sections: fallback });
  }
}
