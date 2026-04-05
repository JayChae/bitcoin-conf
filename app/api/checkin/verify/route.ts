import { NextRequest, NextResponse } from "next/server";
import { isValidSession } from "@/app/api/admin/auth/route";
import { processCheckin } from "@/lib/checkin";

export async function POST(request: NextRequest) {
  if (!isValidSession(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { token } = await request.json();
  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const result = await processCheckin(token);
  return NextResponse.json(result);
}
