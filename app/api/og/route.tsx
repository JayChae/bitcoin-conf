import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  const logoData = await readFile(
    join(process.cwd(), "public", "logo-v2.png")
  );
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#111111",
        }}
      >
        <img
          src={logoSrc}
          width={260}
          height={260}
          style={{ objectFit: "contain" }}
        />
        <div
          style={{
            marginTop: 24,
            fontSize: 48,
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
          }}
        >
          Bitcoin Korea Conference
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 28,
            color: "#999999",
            textAlign: "center",
          }}
        >
          COEX, Seoul
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
