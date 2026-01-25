import Image from "next/image";
import Link from "next/link";
import sponsors, { type Sponsor } from "../../../messages/2025/sponsors";
import ShinyText from "@/components/ShinyText";
import GradientText from "@/components/GradientText";
import { cn } from "@/lib/utils";

type SponsorTier = {
  title: string;
  sponsors: Sponsor[];
  imageClass: string;
  titleClass?: string;
  colors: string;
  backgroundClass: string;
  borderClass?: string;
};

type Props = {
  goldTitle: string;
  silverTitle: string;
  bronzeTitle: string;
  individualTitle: string;
};

export default function Sponsor({
  goldTitle,
  silverTitle,
  bronzeTitle,
  individualTitle,
}: Props) {
  const sponsorTiers: SponsorTier[] = [
    {
      title: goldTitle,
      sponsors: sponsors.gold,
      imageClass:
        "max-w-[200px] md:max-w-[400px] lg:max-w-[500px] xl:max-w-[600px] max-h-[200px] md:max-h-[300px] lg:max-h-[350px] xl:max-h-[400px]",
      colors: "#FFD700",
      backgroundClass: "",
      borderClass: "shadow-xl shadow-yellow-400/60",
    },
    {
      title: silverTitle,
      sponsors: sponsors.silver,
      imageClass:
        "max-w-[140px] sm:max-w-[180px] md:max-w-[240px] lg:max-w-[300px] xl:max-w-[350px] max-h-[100px] sm:max-h-[120px] md:max-h-[160px] lg:max-h-[200px] xl:max-h-[240px]",
      colors: "#C0C0C0",
      backgroundClass: "",
      borderClass: "shadow-xl shadow-gray-400/60",
    },
    {
      title: bronzeTitle,
      sponsors: sponsors.bronze,
      imageClass:
        "max-w-[120px] sm:max-w-[160px] md:max-w-[220px] lg:max-w-[280px] xl:max-w-[320px] max-h-[100px] sm:max-h-[120px] md:max-h-[150px] lg:max-h-[180px] xl:max-h-[200px]",
      colors: "#CD7F32",
      backgroundClass: "",
      borderClass: "border-0 shadow-none",
    },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center gap-12 sm:gap-16 md:gap-20 lg:gap-24 px-4 sm:px-6 md:px-8">
      {sponsorTiers.map((tier, tierIndex) => (
        <div
          key={tierIndex}
          className={cn(
            "w-full flex flex-col items-center gap-4 sm:gap-6 md:gap-8 p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl sm:rounded-3xl",
            tier.backgroundClass,
            tier.borderClass
          )}
        >
          <div className="w-full flex justify-start">
            <h2
              className={cn(
                "font-bold pointer-events-none drop-shadow-sm",
                "text-lg md:text-3xl lg:text-4xl"
              )}
              style={{ color: tier.colors }}
            >
              {tier.title}
            </h2>
          </div>
          <div className=" size-fit flex justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 flex-wrap max-w-7xl">
            {tier.sponsors.map((sponsor, sponsorIndex) => {
              return (
                <Link
                  key={sponsorIndex}
                  href={sponsor.url}
                  target="_blank"
                  className="group transition-all duration-300 hover:scale-105 flex-shrink-0"
                >
                  <div className="relative p-4 sm:p-6 rounded-xl hover:shadow-xl transition-all duration-300">
                    <Image
                      src={sponsor.image}
                      alt={sponsor.alt}
                      width={600}
                      height={400}
                      className={cn(
                        "rounded-lg object-contain transition-all duration-300 group-hover:brightness-110 w-auto h-auto",
                        sponsor.customImageClass || tier.imageClass
                      )}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
