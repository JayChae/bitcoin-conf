import Image from "next/image";
import { cn } from "@/lib/utils";
import { snsIconUrl, type SNS } from "@/app/messages/2026/speakers";

type Props = {
  links: SNS[];
  size?: "xs" | "sm" | "md";
  className?: string;
};

const dimByVariant = {
  xs: { box: "size-6", icon: 13, opacity: "opacity-75 hover:opacity-100" },
  sm: { box: "size-8", icon: 16, opacity: "opacity-80" },
  md: { box: "size-9", icon: 18, opacity: "opacity-80" },
};

export default function SnsLinks({ links, size = "sm", className }: Props) {
  if (links.length === 0) return null;

  const v = dimByVariant[size];
  const isMinimal = size === "xs";

  return (
    <div
      className={cn(
        "flex items-center",
        isMinimal ? "gap-1" : "gap-1.5",
        className,
      )}
    >
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
            isMinimal
              ? "hover:bg-white/10"
              : "border border-white/10 bg-white/5 hover:bg-white/15 hover:border-white/25",
          )}
        >
          <Image
            src={snsIconUrl[link.type]}
            alt=""
            width={v.icon}
            height={v.icon}
            className={v.opacity}
          />
        </a>
      ))}
    </div>
  );
}
