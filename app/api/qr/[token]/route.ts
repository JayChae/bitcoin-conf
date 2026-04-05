import { NextRequest, NextResponse } from "next/server";
import { verifyPayload, generateQRBuffer } from "@/lib/qr";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  // Verify signature before generating — prevents abuse
  const payload = verifyPayload(token);
  if (!payload) {
    return new NextResponse("Invalid token", { status: 400 });
  }

  const buffer = await generateQRBuffer(token);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/png",
      // Token is unique and immutable — cache forever
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
