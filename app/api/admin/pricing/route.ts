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

  // Basic validation
  if (
    typeof body.phase1?.discount !== "number" ||
    typeof body.phase2?.discount !== "number"
  ) {
    return NextResponse.json(
      { error: "Invalid config: discount must be a number" },
      { status: 400 },
    );
  }

  if (body.phase1.discount < 0 || body.phase1.discount > 1) {
    return NextResponse.json(
      { error: "Phase 1 discount must be between 0 and 1" },
      { status: 400 },
    );
  }

  if (body.phase2.discount < 0 || body.phase2.discount > 1) {
    return NextResponse.json(
      { error: "Phase 2 discount must be between 0 and 1" },
      { status: 400 },
    );
  }

  await savePricingConfig(body);

  return NextResponse.json({ success: true });
}
