import { NextRequest, NextResponse } from "next/server";
import { getAllSeatSummary } from "@/lib/seat-lock";
import { isValidSession } from "../auth/route";

export async function GET(request: NextRequest) {
  if (!isValidSession(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const summary = await getAllSeatSummary();
  return NextResponse.json(summary);
}
