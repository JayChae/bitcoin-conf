import { getTranslations } from "next-intl/server";
import { TICKETS } from "../../_constants/tickets";
import { TIER_COLORS } from "../../_constants/seats";

const TIERS = TICKETS.map((t) => ({
  key: t.tier,
  seats: t.totalSeats,
  color: TIER_COLORS[t.tier === "general" ? "regular" : t.tier],
}));

// Fan arc path builder: concentric arcs from center top
function fanArc(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  spreadDeg: number,
): string {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const startAngle = 90 - spreadDeg / 2;
  const endAngle = 90 + spreadDeg / 2;

  const x1o = cx + outerR * Math.cos(toRad(startAngle));
  const y1o = cy + outerR * Math.sin(toRad(startAngle));
  const x2o = cx + outerR * Math.cos(toRad(endAngle));
  const y2o = cy + outerR * Math.sin(toRad(endAngle));
  const x1i = cx + innerR * Math.cos(toRad(endAngle));
  const y1i = cy + innerR * Math.sin(toRad(endAngle));
  const x2i = cx + innerR * Math.cos(toRad(startAngle));
  const y2i = cy + innerR * Math.sin(toRad(startAngle));

  return [
    `M ${x1o} ${y1o}`,
    `A ${outerR} ${outerR} 0 0 1 ${x2o} ${y2o}`,
    `L ${x1i} ${y1i}`,
    `A ${innerR} ${innerR} 0 0 0 ${x2i} ${y2i}`,
    "Z",
  ].join(" ");
}

// Label position at the center of an arc band
function arcCenter(
  cx: number,
  cy: number,
  r: number,
): { x: number; y: number } {
  return { x: cx, y: cy + r };
}

export default async function SeatingChart() {
  const t = await getTranslations("Tickets2026");

  const cx = 200;
  const cy = 52;
  const gap = 4;
  const bandWidth = 44;
  const startR = 40;
  const spread = 120;

  return (
    <div className="w-full max-w-lg md:max-w-2xl mx-auto mb-12 md:mb-16">
      <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 md:p-8">
        <h2 className="text-center text-sm md:text-base font-medium text-white/50 tracking-widest uppercase mb-5 md:mb-6">
          {t("seatMap")}
        </h2>

        <svg
          viewBox="0 0 400 260"
          className="w-full h-auto"
          role="img"
          aria-label={t("seatMap")}
        >
          {/* Stage */}
          <rect
            x={cx - 70}
            y={10}
            width={140}
            height={28}
            rx={6}
            fill="white"
            fillOpacity={0.1}
            stroke="white"
            strokeOpacity={0.2}
            strokeWidth={1}
          />
          <text
            x={cx}
            y={28}
            textAnchor="middle"
            className="fill-white/60 text-[11px] font-medium tracking-widest uppercase"
            style={{ fontSize: 11 }}
          >
            {t("stage")}
          </text>

          {/* Tier arcs */}
          {TIERS.map((tier, i) => {
            const innerR = startR + i * (bandWidth + gap);
            const outerR = innerR + bandWidth;
            const midR = (innerR + outerR) / 2;
            const center = arcCenter(cx, cy, midR);
            const label = t(tier.key === "general" ? "general" : tier.key);

            return (
              <g key={tier.key}>
                <path
                  d={fanArc(cx, cy, innerR, outerR, spread)}
                  fill={tier.color}
                  fillOpacity={0.18}
                  stroke={tier.color}
                  strokeOpacity={0.4}
                  strokeWidth={1}
                />
                <text
                  x={center.x}
                  y={center.y - 4}
                  textAnchor="middle"
                  className="fill-white font-semibold"
                  style={{ fontSize: 13 }}
                >
                  {label}
                </text>
                <text
                  x={center.x}
                  y={center.y + 12}
                  textAnchor="middle"
                  className="fill-white/50"
                  style={{ fontSize: 10 }}
                >
                  {tier.seats.toLocaleString()} {t("seats")}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
