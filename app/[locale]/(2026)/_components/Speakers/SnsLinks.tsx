import Image from "next/image";
import { cn } from "@/lib/utils";
import { snsIconUrl, type SNS } from "@/app/messages/2026/speakers";

type Props = {
  links: SNS[];
  size: "xs" | "md";
  className?: string;
};

const dimByVariant = {
  xs: { box: "size-6", icon: 13, gap: "gap-1", chrome: "hover:bg-white/10" },
  md: {
    box: "size-9",
    icon: 18,
    gap: "gap-1.5",
    chrome:
      "border border-white/10 bg-white/5 hover:bg-white/15 hover:border-white/25",
  },
};

export default function SnsLinks({ links, size, className }: Props) {
  if (links.length === 0) return null;

  const v = dimByVariant[size];

  return (
    <div className={cn("flex items-center", v.gap, className)}>
      {links.map((link) => (
        <a
          key={`${link.type}-${link.url}`}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.type}
          className={cn(
            "inline-flex items-center justify-center rounded-full transition-colors",
            v.box,
            v.chrome,
          )}
        >
          <Image
            src={snsIconUrl[link.type]}
            alt=""
            width={v.icon}
            height={v.icon}
            className="opacity-80 hover:opacity-100"
          />
        </a>
      ))}
    </div>
  );
}
