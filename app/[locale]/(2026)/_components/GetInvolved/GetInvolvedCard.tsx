import {
  ArrowUpRight,
  Handshake,
  Megaphone,
  PartyPopper,
  Store,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { InvolveCard, InvolveKey } from "@/app/messages/2026/getInvolved";

// key별 아이콘 매핑(데이터엔 두지 않고 여기서 연결).
const ICONS: Record<InvolveKey, LucideIcon> = {
  sideEvent: PartyPopper,
  market: Store,
  sponsor: Handshake,
  partner: Megaphone,
};

// 카드별 accent — 브랜드 스펙트럼(blue→purple→pink)으로 4칸을 시각적으로 구분한다.
// SponsorTiers 의 TierConfig 패턴과 동일하게 config 맵 + cn 으로 조립.
const ACCENTS: Record<InvolveKey, { chip: string; cta: string }> = {
  sideEvent: {
    chip: "bg-glow-pink/15 border-glow-pink/30 text-[#F8C8FF]",
    cta: "text-[#F8C8FF]",
  },
  market: {
    chip: "bg-glow-blue/15 border-glow-blue/30 text-[#C8D6FF]",
    cta: "text-[#C8D6FF]",
  },
  sponsor: {
    chip: "bg-glow-purple/15 border-glow-purple/30 text-[#E0C8FF]",
    cta: "text-[#E0C8FF]",
  },
  partner: {
    chip: "bg-gradient-to-br from-glow-blue/20 via-glow-purple/20 to-glow-pink/20 border-white/15 text-[#F8C8FF]",
    cta: "text-[#F8C8FF]",
  },
};

type Props = {
  card: InvolveCard;
  applyLabel: string;
};

export default function GetInvolvedCard({ card, applyLabel }: Props) {
  const Icon = ICONS[card.key];
  const accent = ACCENTS[card.key];

  return (
    <div className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl bg-[#15122a]/90 backdrop-blur-2xl border border-white/10 hover:border-white/25 transition-all duration-300 sm:hover:-translate-y-0.5 p-6 md:p-7">
      {/* 카드 전체를 덮는 외부 신청 폼 링크(새 탭). i18n Link 아님. */}
      <a
        href={card.formUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={card.title}
        className="absolute inset-0 z-10 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-glow-purple/50"
      />

      <span
        className={cn(
          "inline-flex size-12 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105",
          accent.chip,
        )}
      >
        <Icon className="size-6" />
      </span>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
          {card.title}
        </h3>
        <p className="text-sm text-white/70 leading-relaxed">
          {card.description}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-end gap-1.5 pt-2">
        <span
          className={cn(
            "text-sm font-medium transition-colors group-hover:text-white",
            accent.cta,
          )}
        >
          {applyLabel}
        </span>
        <ArrowUpRight
          className={cn(
            "size-4 transition-all group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
            accent.cta,
          )}
        />
      </div>
    </div>
  );
}
