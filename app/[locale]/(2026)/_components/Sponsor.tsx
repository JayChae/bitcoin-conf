import Image from "next/image";
import Link from "next/link";
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

type Props = {
  diamondTitle: string;
  goldTitle: string;
  silverTitle: string;
  bronzeTitle: string;
  comingSoonText?: string;
};

export default function Sponsor({
  diamondTitle,
  goldTitle,
  silverTitle,
  bronzeTitle,
  comingSoonText = "Coming Soon",
}: Props) {
  const tiers: TierConfig[] = [
    {
      key: "diamond",
      title: diamondTitle,
      sponsors: sponsors.diamond,
      logoSize: "h-[60px] sm:h-[80px] md:h-[100px] lg:h-[120px]",
      titleSize: "text-xl sm:text-2xl md:text-3xl lg:text-4xl",
      accentColor: "#B9F2FF",
      glowColor: "rgba(185, 242, 255, 0.15)",
      lineGradient: "from-transparent via-cyan-400/80 to-transparent",
    },
    {
      key: "gold",
      title: goldTitle,
      sponsors: sponsors.gold,
      logoSize: "h-[50px] sm:h-[65px] md:h-[80px] lg:h-[100px]",
      titleSize: "text-lg sm:text-xl md:text-2xl lg:text-3xl",
      accentColor: "#FFD700",
      glowColor: "rgba(255, 215, 0, 0.12)",
      lineGradient: "from-transparent via-yellow-400/70 to-transparent",
    },
    {
      key: "silver",
      title: silverTitle,
      sponsors: sponsors.silver,
      logoSize: "h-[40px] sm:h-[55px] md:h-[70px] lg:h-[85px]",
      titleSize: "text-base sm:text-lg md:text-xl lg:text-2xl",
      accentColor: "#C0C0C0",
      glowColor: "rgba(192, 192, 192, 0.10)",
      lineGradient: "from-transparent via-gray-400/60 to-transparent",
    },
    {
      key: "bronze",
      title: bronzeTitle,
      sponsors: sponsors.bronze,
      logoSize: "h-[35px] sm:h-[45px] md:h-[55px] lg:h-[70px]",
      titleSize: "text-sm sm:text-base md:text-lg lg:text-xl",
      accentColor: "#CD7F32",
      glowColor: "rgba(205, 127, 50, 0.08)",
      lineGradient: "from-transparent via-amber-700/50 to-transparent",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-20 sm:gap-24 md:gap-28">
      {tiers.map((tier, i) => (
        <div
          key={tier.key}
          className="flex flex-col items-center gap-6 sm:gap-8 md:gap-10"
        >
          {/* Tier label with gradient line */}
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

          {/* Sponsor logos or Coming Soon */}
          {tier.sponsors.length > 0 ? (
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
                        "w-auto object-contain brightness-90 group-hover:brightness-110 transition-all duration-300",
                        sponsor.customImageClass || tier.logoSize,
                      )}
                    />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm sm:text-base text-white/30 tracking-widest uppercase">
              {comingSoonText}
            </p>
          )}

          {/* Bottom fade line for last tier */}
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
