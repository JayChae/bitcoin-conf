import CountUp from "@/components/CountUp";
import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "./Speakers/InfoField";

type Props = {
  attendees: number;
  attendeesLabel: string;
  marketValue: string;
  marketLabel: string;
};

// 두 항목이 같은 형태(값 + 라벨)를 갖도록 통일한다. 라이트닝 마켓에는 숫자가 없어
// "한국 최대"를 값 자리에 놓아야 800+와 시각적으로 짝이 맞는다.
// 모바일 22px — 24px면 360px 폭(갤럭시)에서 "Korea's Largest"가 6px 모자라 접힌다.
const VALUE_CLASS = "text-[22px] font-bold md:text-4xl";
// 공통 eyebrow는 히어로 배경(FloatingLines) 위에서 묻힐 만큼 작고 흐리다.
// 크기·밝기를 올리고, 한글이 "참 가 자"처럼 벌어지지 않게 자간도 좁힌다.
const LABEL_CLASS = cn(
  EYEBROW_CLASS,
  "text-xs tracking-[0.1em] text-white/75 md:text-base"
);
// 폭을 균등 분할(flex-1)하지 않는다. 375px에서 "Korea's Largest"는 168px이 필요한데
// 반씩 나누면 140px밖에 못 받아 두 줄로 접혔다. 내용 폭대로 두면 101 + 168 + 여백이
// 가용폭 안에 들어가 한 줄로 유지된다. 값과 라벨은 한 덩어리로 붙여 둔다 —
// 떼어 놓으면 한쪽이 접혔을 때 다른 쪽 값이 허공에 뜬다.
const COLUMN_CLASS = "flex min-w-0 flex-col items-center gap-1.5 md:gap-2";

export default function HeroStats({
  attendees,
  attendeesLabel,
  marketValue,
  marketLabel,
}: Props) {
  return (
    // pt-*: 세로가 아주 짧은 화면에서 중앙 블록이 눌려도 CTA와 패널이 붙지 않게 한다
    <div className="pt-8 pb-10 md:pt-10 md:pb-14">
      {/* 반투명 패널 — 배경의 그라데이션 위에서도 수치가 또렷하게 뜬다 */}
      {/* md:max-w-3xl — 이보다 좁으면 "Korea's Largest"가 데스크톱에서도 두 줄로 접힌다 */}
      <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4 backdrop-blur-2xl md:max-w-3xl md:px-10 md:py-6">
        {/* 모바일에서도 가로 1행 — 세로로 쌓으면 min-h-lvh 안에서 세로 공간이 빡빡해진다 */}
        <div className="flex items-center justify-center gap-3 text-center md:gap-12">
          <div className={COLUMN_CLASS}>
            <span
              className={cn(
                VALUE_CLASS,
                "font-[family-name:var(--font-ubuntu-mono)] tabular-nums"
              )}
            >
              <CountUp to={attendees} duration={1.2} />+
            </span>
            <span className={LABEL_CLASS}>{attendeesLabel}</span>
          </div>

          <div className="w-px self-stretch bg-white/15" aria-hidden />

          <div className={COLUMN_CLASS}>
            <span className={VALUE_CLASS}>{marketValue}</span>
            <span className={LABEL_CLASS}>{marketLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
