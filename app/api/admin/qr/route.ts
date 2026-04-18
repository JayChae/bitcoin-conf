import { NextRequest, NextResponse } from "next/server";
import { signPayload, type QRPayload } from "@/lib/qr";
import { isValidSession } from "../auth/route";

export async function POST(request: NextRequest) {
  if (!isValidSession(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { cid, sec, seat, tier, ap } = body;

  if (!cid || !sec || seat === undefined || !tier || ap === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const payload: QRPayload = { cid, sec, seat: Number(seat), tier, ap: Boolean(ap) };
  const token = signPayload(payload);

  return NextResponse.json({ token });
}
