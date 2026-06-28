import { cn } from "@/lib/utils";
import PartnerLogo from "./PartnerLogo";
import type { Partner } from "@/app/messages/2026/partners";

type Props = {
  partners: Partner[];
};

const TILE =
  "flex aspect-[3/2] items-center justify-center rounded-2xl bg-neutral-400 p-6 transition-transform duration-300 sm:p-8";
const LOGO_CLASS = "max-h-full w-auto max-w-full object-contain";
const LOGO_SIZES = "(min-width: 1024px) 260px, (min-width: 640px) 30vw, 45vw";

export default function PartnersGrid({ partners }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
      {partners.map((p, i) => (
        <PartnerLogo
          key={i}
          partner={p}
          imageClassName={LOGO_CLASS}
          sizes={LOGO_SIZES}
          wrapperClassName={cn(TILE, "hover:-translate-y-0.5")}
        />
      ))}
    </div>
  );
}
