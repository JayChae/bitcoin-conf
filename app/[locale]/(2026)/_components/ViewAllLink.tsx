import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

type Props = {
  href: string;
  label: string;
};

// 섹션 하단 "전체 보기" CTA — Speakers/SideEvents/Partners 가 공유한다.
export default function ViewAllLink({ href, label }: Props) {
  return (
    <div className="flex justify-center mt-10 md:mt-12">
      <Link
        href={href}
        className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white/10 backdrop-blur-2xl text-white text-base font-semibold border border-white/15 transition-colors duration-200 hover:bg-white/15 active:scale-[0.97]"
      >
        {label}
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
