import { cn } from "@/lib/utils";

type Props = {
  title: string;
  // 아래 여백은 섹션마다 다르다(리드 문단이 붙는 섹션은 더 좁게).
  className?: string;
};

// 섹션 제목 + 글로우. Section 래퍼를 쓸 수 없는 섹션(리드 문단이 따로 붙는 등)도 공유한다.
export default function SectionTitle({ title, className }: Props) {
  return (
    <div className={cn("relative inline-block w-full text-center", className)}>
      <div className="absolute inset-0 section-title-glow pointer-events-none" />
      <h2
        className="relative text-3xl md:text-4xl lg:text-5xl font-bold pointer-events-none animate-fade-in px-6 py-3"
        style={{ color: "#FFFFFF" }}
      >
        {title}
      </h2>
    </div>
  );
}
