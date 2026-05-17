import Image from "next/image";
import { Sparkles } from "lucide-react";

type Size = "card" | "hero";

const SIZE_PRESETS = {
  card: {
    icon: "size-9 mb-2",
    label: "text-[10px] tracking-[0.22em]",
    imageClassName: "object-cover transition-transform duration-500 group-hover:scale-[1.03]",
    sizes: "(min-width: 1024px) 540px, (min-width: 640px) 42vw, 100vw",
    priority: false,
  },
  hero: {
    icon: "size-12 mb-3",
    label: "text-xs tracking-[0.25em]",
    imageClassName: "object-cover",
    sizes: "(min-width: 768px) 896px, 100vw",
    priority: true,
  },
} as const;

type Props = {
  src: string | null;
  alt: string;
  placeholderLabel: string;
  size: Size;
};

export default function SideEventImage({
  src,
  alt,
  placeholderLabel,
  size,
}: Props) {
  const preset = SIZE_PRESETS[size];

  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={preset.priority}
        sizes={preset.sizes}
        className={preset.imageClassName}
      />
    );
  }

  return (
    <div className="relative size-full flex flex-col items-center justify-center bg-gradient-to-br from-glow-purple/30 via-glow-pink/15 to-glow-blue/30">
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 40%), radial-gradient(circle at 70% 70%, rgba(255,255,255,0.12) 0%, transparent 35%)",
        }}
      />
      <Sparkles className={`text-white/80 relative ${preset.icon}`} />
      <span
        className={`uppercase text-white/70 relative ${preset.label}`}
      >
        {placeholderLabel}
      </span>
    </div>
  );
}
