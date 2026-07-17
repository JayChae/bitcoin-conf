import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import SectionTitle from "./SectionTitle";

type Props = {
  id: string;
  title: string;
  children: ReactNode;
  // 하단 패딩 등 섹션별 여백 보정용(예: 푸터 바로 위 섹션).
  className?: string;
};

export default function Section({ id, title, children, className }: Props) {
  return (
    <section
      id={id}
      className={cn("w-full scroll-mt-24 mt-40 md:mt-44", className)}
    >
      <SectionTitle title={title} className="mb-12" />

      {children}
    </section>
  );
}
