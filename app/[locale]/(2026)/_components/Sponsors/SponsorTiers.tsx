import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import sponsors, { type Sponsor } from "@/app/messages/2026/sponsors";
import { cn } from "@/lib/utils";

type TierConfig = {
  key: string;
  title: string;
  sponsors: Sponsor[];
  logoSize: string;
  titleSize: string;
  accentColor: string;
  glowColor: string;
  lineGradient: string;
};

export default async function SponsorTiers() {
  const t = await getTranslations("Sponsor");

  const allTiers: TierConfig[] = [
    {
      key: "gold",
      title: t("gold"),
      sponsors: sponsors.gold,
      logoSize: "h-[50px] sm:h-[65px] md:h-[80px] lg:h-[100px]",
      titleSize: "text-lg sm:text-xl md:text-2xl lg:text-3xl",
      accentColor: "#FFD700",
      glowColor: "rgba(255, 215, 0, 0.12)",
      lineGradient: "from-transparent via-yellow-400/70 to-transparent",
    },
    {
      key: "silver",
      title: t("silver"),
      sponsors: sponsors.silver,
      logoSize: "h-[40px] sm:h-[55px] md:h-[70px] lg:h-[85px]",
      titleSize: "text-base sm:text-lg md:text-xl lg:text-2xl",
      accentColor: "#C0C0C0",
      glowColor: "rgba(192, 192, 192, 0.10)",
      lineGradient: "from-transparent via-gray-400/60 to-transparent",
    },
    {
      key: "bronze",
      title: t("bronze"),
      sponsors: sponsors.bronze,
      logoSize: "h-[35px] sm:h-[45px] md:h-[55px] lg:h-[70px]",
      titleSize: "text-sm sm:text-base md:text-lg lg:text-xl",
      accentColor: "#CD7F32",
      glowColor: "rgba(205, 127, 50, 0.08)",
      lineGradient: "from-transparent via-amber-700/50 to-transparent",
    },
  ];

  // 빈 티어는 라벨·구분선까지 통째로 숨긴다("준비 중" 표기 대신 후원 문의 CTA 가 그 역할).
  // 렌더 시점 계산이라 sponsors.ts 에 실버가 채워지면 저절로 다시 나타난다.
  const tiers = allTiers.filter((tier) => tier.sponsors.length > 0);
  if (tiers.length === 0) return null;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-20 sm:gap-24 md:gap-28">
      {tiers.map((tier, i) => (
        <div
          key={tier.key}
          className="flex flex-col items-center gap-6 sm:gap-8 md:gap-10"
        >
          <div className="w-full flex items-center gap-3 sm:gap-4 md:gap-6">
            <div
              className={cn("h-[1.5px] flex-1 bg-gradient-to-r", tier.lineGradient)}
            />
            <span
              className={cn(
                "font-semibold tracking-[0.2em] sm:tracking-[0.25em] uppercase whitespace-nowrap",
                tier.titleSize,
              )}
              style={{ color: tier.accentColor }}
            >
              {tier.title}
            </span>
            <div
              className={cn("h-[1.5px] flex-1 bg-gradient-to-r", tier.lineGradient)}
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16">
            {tier.sponsors.map((sponsor, j) => (
              <Link
                key={j}
                href={sponsor.url}
                target="_blank"
                className="group relative flex items-center justify-center"
              >
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl scale-150"
                  style={{ backgroundColor: tier.glowColor }}
                />
                <div className="relative p-3 sm:p-4 md:p-5 rounded-xl transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={sponsor.image}
                    alt={sponsor.alt}
                    width={400}
                    height={200}
                    className={cn(
                      "w-auto object-contain transition-all duration-300 group-hover:brightness-110",
                      sponsor.customImageClass || tier.logoSize,
                    )}
                  />
                </div>
              </Link>
            ))}
          </div>

          {i === tiers.length - 1 && (
            <div
              className={cn(
                "w-full h-px bg-gradient-to-r mt-2 sm:mt-4",
                tier.lineGradient,
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
