import { NextRequest, NextResponse } from "next/server";
import {
  getPricingConfig,
  savePricingConfig,
  getCurrentPhase,
  getPhase2Sold,
  type PricingConfig,
} from "@/lib/pricing";
import { isValidSession } from "../auth/route";
import type { TierKey } from "@/app/[locale]/(2026)/_types/tickets";

const TIERS: TierKey[] = ["vip", "premium", "general"];

export async function GET(request: NextRequest) {
  if (!isValidSession(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = await getPricingConfig();

  // Get current phase per tier and sold counts
  const tiers: Record<string, { phase: string; sold: number }> = {};
  for (const tier of TIERS) {
    const phase = await getCurrentPhase(tier);
    const sold = await getPhase2Sold(tier);
    tiers[tier] = { phase, sold };
  }

  return NextResponse.json({ config, tiers });
}

export async function PUT(request: NextRequest) {
  if (!isValidSession(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as PricingConfig;

  // Validate Phase 1 dates
  if (body.phase1?.enabled) {
    const start = new Date(body.phase1.startDate);
    const end = new Date(body.phase1.endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 },
      );
    }
    if (start >= end) {
      return NextResponse.json(
        { error: "시작일이 종료일보다 이후입니다" },
        { status: 400 },
      );
    }
  }

  // Validate Phase 2 maxTickets
  if (body.phase2?.enabled) {
    for (const tier of TIERS) {
      const max = body.phase2.maxTickets?.[tier];
      if (typeof max !== "number" || max < 1 || !Number.isInteger(max)) {
        return NextResponse.json(
          { error: `${tier} 최대 티켓 수는 1 이상의 정수여야 합니다` },
          { status: 400 },
        );
      }
    }
  }

  await savePricingConfig(body);

  return NextResponse.json({ success: true });
}
