import { NextRequest, NextResponse } from "next/server";
import { getSectionStatus } from "@/lib/seat-lock";

export async function GET(request: NextRequest) {
  const section = request.nextUrl.searchParams.get("section");
  if (!section) {
    return NextResponse.json(
      { error: "section parameter required" },
      { status: 400 },
    );
  }

  try {
    const seats = await getSectionStatus(section);
    return NextResponse.json({ section, seats });
  } catch {
    return NextResponse.json(
      { error: "Failed to get seat status" },
      { status: 500 },
    );
  }
}
