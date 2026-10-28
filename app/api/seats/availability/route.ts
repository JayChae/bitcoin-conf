import { NextRequest, NextResponse } from "next/server";
import { getRemainingSeatsBySectionForTier } from "@/lib/seat-lock";
import { getSelectableCount, isValidTier } from "@/app/[locale]/(2026)/_utils/tierMapping";
import { TIER_SECTIONS } from "@/app/[locale]/(2026)/_constants/tierMapping";
import { TIER_KEYS } from "@/app/[locale]/(2026)/_types/tickets";
import { isSeatlessTier } from "@/app/[locale]/(2026)/_constants/tickets";

export async function GET(request: NextRequest) {
  const tier = request.nextUrl.searchParams.get("tier");

  // 좌석 없는 티어는 구역별 잔여석이 없다
  if (!tier || !isValidTier(tier) || isSeatlessTier(tier)) {
    return NextResponse.json(
      { error: `Valid tier parameter required (${TIER_KEYS.filter((t) => !isSeatlessTier(t)).join(", ")})` },
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
