"use client";

import type { MouseEvent } from "react";
import { Link } from "@/i18n/navigation";

type Props = {
  label: string;
  href: string;
};

export default function HeroTicketCta({ label, href }: Props) {
  // 티켓 섹션은 판매 시작 전(saleStatus === "upcoming")에 렌더되지 않는다.
  // 그래서 앵커가 아니라 진짜 링크(/tickets)로 두고, #tickets가 DOM에 있을 때만
  // 클릭을 가로채 스크롤한다 — 없으면 링크 기본 동작으로 티켓 페이지에 간다.
  const scrollToTickets = (e: MouseEvent<HTMLAnchorElement>) => {
    const section = document.getElementById("tickets");
    if (!section) return;

    e.preventDefault();
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Link
      href={href}
      onClick={scrollToTickets}
      className="mt-6 inline-flex items-center rounded-full border border-white bg-white/90 px-8 py-3.5 text-base font-semibold text-[#101018] backdrop-blur-2xl transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-[#E947F5] hover:bg-[#E947F5] hover:text-white hover:shadow-[0_0_24px_-4px_rgba(233,71,245,0.85)] active:scale-[0.97] md:mt-8 md:px-10 md:py-4 md:text-lg"
    >
      {label}
    </Link>
  );
}
