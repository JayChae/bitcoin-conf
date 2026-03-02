import { NextRequest, NextResponse } from "next/server";
import { releaseHolds } from "@/lib/seat-lock";

export async function POST(request: NextRequest) {
  const { sessionId } = await request.json();

  if (!sessionId) {
    return NextResponse.json(
      { error: "sessionId required" },
      { status: 400 },
    );
  }

  try {
    await releaseHolds(sessionId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to release holds" },
      { status: 500 },
    );
  }
}
