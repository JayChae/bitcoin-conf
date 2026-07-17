import { ArrowUpRight } from "lucide-react";

// 외부 후원 신청 폼(Fillout) — i18n Link 대상이 아니라 평범한 <a> + target="_blank".
const INQUIRY_URL = "https://bitcoinkoreaconference.fillout.com/t/nZ2nj5TqeQus";

type Props = {
  label: string;
  description: string;
};

// 섹션의 주 전환 액션. 테두리 카드로 감싸 배경 위에 떠 보이지 않게 하고,
// 버튼은 고스트 필(ViewAllLink)이 아니라 Nav 티켓 CTA 와 같은 primary 트리트먼트.
export default function SponsorInquiryCta({ label, description }: Props) {
  return (
    <div className="mx-auto mt-14 md:mt-16 max-w-2xl">
      <div className="flex flex-col items-center gap-6 rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-10 md:px-10 md:py-12 text-center backdrop-blur-sm">
        <p className="max-w-md text-sm md:text-base text-white/70">
          {description}
        </p>
        <a
          href={INQUIRY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white/90 backdrop-blur-2xl text-[#101018] text-base font-semibold border border-white transition-all duration-150 ease-out hover:bg-[#E947F5] hover:border-[#E947F5] hover:text-white hover:shadow-[0_0_24px_-4px_rgba(233,71,245,0.85)] hover:-translate-y-0.5 active:scale-[0.97]"
        >
          {label}
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
}
