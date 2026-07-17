import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  value: ReactNode;
  label: string;
  /** 값 뒤에 깔리는 글로우 색. 밴드 전체가 좌→우 스펙트럼을 이루도록 주입한다. */
  accent: string;
  /** 숫자 값에만 모노 + tabular-nums. 카운트업 중 자릿수가 흔들리지 않는다. */
  mono?: boolean;
};

export default function StatItem({ value, label, accent, mono }: Props) {
  return (
    // before:* — 세로 구분선. md 이상에서만 그린다(모바일 2×2에서는 소음이라
    // gap 으로만 나눈다). 그리드 칸 안의 유사요소라 4칸 구조를 깨지 않는다.
    <div
      className={cn(
        "relative flex flex-col items-center gap-2 text-center md:gap-3",
        "md:before:absolute md:before:inset-y-3 md:before:left-0 md:before:w-px",
        "md:before:bg-gradient-to-b md:before:from-transparent md:before:via-white/15 md:before:to-transparent",
        "md:first:before:hidden"
      )}
    >
      {/* 영문 "Korea's Largest"는 4칸 레이아웃(약 224px/칸)에서 어떤 크기로도 한 줄에
          못 들어가 두 줄로 접힌다. 슬롯을 2줄 높이로 고정하고 값을 세로 중앙에 두면
          그 칸만 키가 커지지 않아 네 칸의 라벨이 로케일과 무관하게 한 줄에 정렬된다. */}
      <div className="relative flex min-h-[4rem] items-center justify-center md:min-h-[6.25rem]">
        {/* 글로우는 값 뒤에서만 번진다 — 라벨까지 덮으면 라벨이 탁해진다.
            opacity-70: 다크 스크림 위에서 색 액센트로만 읽혀야 한다. 더 세면
            흰 수치를 뒤에서 밀어올려 오히려 대비를 깎는다. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-70 blur-2xl"
          style={{
            background: `radial-gradient(50% 50% at 50% 50%, ${accent}, transparent 70%)`,
          }}
        />
        {/* 네 값의 크기는 항상 같다. 항목마다 크기를 달리하면 정렬은 쉬워지지만
            "한국 최대"와 "1000+"이 서로 짝으로 안 읽힌다.
            text-shadow: 글로우가 바로 뒤에 있어 흰 글자 가장자리가 뭉갠다 — 얇은
            어두운 그림자로 글자를 배경에서 떼어낸다. */}
        <span
          className={cn(
            "text-3xl font-bold leading-[1.05] md:text-5xl",
            "[text-shadow:0_2px_12px_rgba(0,0,0,0.55)]",
            mono && "font-[family-name:var(--font-ubuntu-mono)] tabular-nums"
          )}
        >
          {value}
        </span>
      </div>

      {/* Speakers 의 EYEBROW_CLASS 를 쓰지 않는다 — 그 상수의 다섯 결정 중 크기·색·
          자간 셋을 여기서 덮어써야 해서, 실제로 남는 건 아래 두 유틸뿐이다. 상속하면
          eyebrow 를 손볼 때 이쪽엔 반영되는 척만 하고 조용히 무시된다.
          자간 0.04em — eyebrow 기본값(0.22em)은 한글에서 "라 이 트 닝"처럼 낱자가
          흩어져 단어로 안 뭉친다. 값보다는 작게 둬서 위계는 유지한다. */}
      <span className="font-[family-name:var(--font-ubuntu-mono)] text-xs uppercase tracking-[0.04em] text-white/90 md:text-sm">
        {label}
      </span>
    </div>
  );
}
