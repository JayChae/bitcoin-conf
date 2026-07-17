import { getTranslations } from "next-intl/server";
import CountUp from "@/components/CountUp";
import { cn } from "@/lib/utils";
import { TOTAL_ATTENDEES, TOTAL_SPEAKERS } from "@/app/messages/2026/stats";
import StatItem from "./StatItem";

// 좌→우로 브랜드 팔레트를 훑는다. 양 끝은 실제 팔레트 토큰을 참조해야 색을
// 바꿀 때 같이 움직인다 — 가운데 둘은 두 토큰 사이를 보간한 값이라 토큰이 없다.
// 가장 뜨거운 핑크가 맨 오른쪽 "3회 / 개최"에 떨어져 크레센도가 된다.
// 모바일 2×2 에서는 같은 스윕이 대각선 그라데이션으로 읽힌다.
const ACCENTS = [
  "var(--color-glow-blue)",
  "#6A4FB6",
  "#A94FD6",
  "var(--color-glow-pink)",
];

// 카운트업 길이(초). 1000 까지 세는 데 이보다 짧으면 숫자가 튀는 것처럼 보인다.
const COUNT_DURATION = 1.2;

// 밴드 위아래를 긋는 네온 헤어라인.
const RULE_CLASS =
  "pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-glow-purple/70 to-transparent";

export default async function StatsSection() {
  const t = await getTranslations("Stats2026");

  return (
    // 히어로(min-h-lvh) 바로 다음 섹션 — 위 마진 없이 스크롤하자마자 나와야 한다.
    // 제목이 없는 섹션이라 SectionTitle 도, Section 래퍼도 쓰지 않는다.
    // text-white 필수 — 안 주면 body 의 text-foreground(거의 검정)를 물려받아
    // 값이 검게 깔린다. 히어로 안에 있을 땐 히어로가 이걸 줬다.
    <section id="stats" className="scroll-mt-24 text-white">
      {/* 전폭 다크 스크림. 배경 FloatingLines 는 이 구간에서 흰빛이 확 밝아지는데,
          스크림 없이는 흰 수치가 그대로 묻힌다 (구 HeroStats 의 유리 패널이 하던 일).
          컨테이너 폭이 아니라 화면 끝까지 늘려 리본처럼 읽히게 한다.
          backdrop-blur 는 쓰지 않는다 — 뒤의 FloatingLines 가 매 rAF 다시 그려지는
          WebGL 캔버스라 백드롭이 매 프레임 dirty 다. 전폭 블러를 얹으면 밴드가
          화면에 있는 내내 그 영역을 프레임마다 재샘플·재블러한다. 감쇠(/70)만으로도
          가는 선들이 충분히 죽어서 흰 수치가 뜬다. */}
      <div className="relative bg-black/70">
        <div className={cn(RULE_CLASS, "top-0")} aria-hidden />

        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-4 gap-y-8 px-4 py-10 md:grid-cols-4 md:gap-x-0 md:py-12">
          <StatItem
            value={t("marketValue")}
            label={t("marketLabel")}
            accent={ACCENTS[0]}
          />
          <StatItem
            // separator 를 주지 않는다 — "1,000+" 보다 "1000+" 이 "60+" 과 짝이 맞는다.
            value={
              <>
                <CountUp to={TOTAL_SPEAKERS} duration={COUNT_DURATION} />+
              </>
            }
            label={t("speakersLabel")}
            accent={ACCENTS[1]}
            mono
          />
          <StatItem
            value={
              <>
                <CountUp to={TOTAL_ATTENDEES} duration={COUNT_DURATION} />+
              </>
            }
            label={t("attendeesLabel")}
            accent={ACCENTS[2]}
            mono
          />
          <StatItem
            value={t("editionValue")}
            label={t("editionLabel")}
            accent={ACCENTS[3]}
          />
        </div>

        <div className={cn(RULE_CLASS, "bottom-0")} aria-hidden />
      </div>
    </section>
  );
}
