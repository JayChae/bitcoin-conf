import { NextRequest, NextResponse } from "next/server";
import {
  getPricingConfig,
  savePricingConfig,
  getCurrentPhase,
  getPhase2Sold,
  getAllPhaseSold,
  PHASE2_TIERS,
  type PricingConfig,
} from "@/lib/pricing";
import { isValidSession } from "../auth/route";
import { TIER_KEYS, type TierKey } from "@/app/[locale]/(2026)/_types/tickets";

export async function GET(request: NextRequest) {
  if (!isValidSession(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = await getPricingConfig();

  // 티어별 조회는 서로 독립적이고, config는 위에서 읽은 것을 재사용한다
  const [tierEntries, phaseSold] = await Promise.all([
    Promise.all(
      TIER_KEYS.map(async (tier) => {
        const [phase, sold] = await Promise.all([
          getCurrentPhase(tier, config),
          getPhase2Sold(tier),
        ]);
        return [tier, { phase, sold }] as const;
      }),
    ),
    getAllPhaseSold(),
  ]);
  const tiers = Object.fromEntries(tierEntries);

  return NextResponse.json({ config, tiers, phaseSold });
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

  // Validate Phase 2 maxTickets (VIP is excluded from Phase 2)
  if (body.phase2?.enabled) {
    for (const tier of PHASE2_TIERS) {
      const max = body.phase2.maxTickets?.[tier];
      if (typeof max !== "number" || max < 1 || !Number.isInteger(max)) {
        return NextResponse.json(
          { error: `${tier} 최대 티켓 수는 1 이상의 정수여야 합니다` },
          { status: 400 },
        );
      }
    }
  }

  // Validate saleStatus
  const validStatuses = ["upcoming", "open", "closed"];
  if (body.saleStatus && !validStatuses.includes(body.saleStatus)) {
    return NextResponse.json(
      { error: "Invalid sale status" },
      { status: 400 },
    );
  }

  await savePricingConfig(body);

  return NextResponse.json({ success: true });
}
