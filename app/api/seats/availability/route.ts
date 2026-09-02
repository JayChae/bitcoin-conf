import { NextRequest, NextResponse } from "next/server";
import { getRemainingSeatsBySectionForTier } from "@/lib/seat-lock";
import { getSelectableCount, isValidTier } from "@/app/[locale]/(2026)/_utils/tierMapping";
import { TIER_SECTIONS } from "@/app/[locale]/(2026)/_constants/tierMapping";
import { TIER_KEYS } from "@/app/[locale]/(2026)/_types/tickets";

export async function GET(request: NextRequest) {
  const tier = request.nextUrl.searchParams.get("tier");

  if (!tier || !isValidTier(tier)) {
    return NextResponse.json(
      { error: `Valid tier parameter required (${TIER_KEYS.join(", ")})` },
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
