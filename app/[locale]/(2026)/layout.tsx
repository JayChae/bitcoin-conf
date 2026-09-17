import { setRequestLocale } from "next-intl/server";
import Nav from "./_components/Nav";
import Footer from "./_components/Footer";
import navItems, { ticketCta } from "@/app/messages/2026/nav";
import ColorBends from "@/components/ColorBends";

import LiquidEther from "@/components/LiquidEther";
import { toLocale } from "@/app/_utils/seo";
import StructuredData from "@/app/_components/StructuredData";
import { seoMessages } from "@/app/messages/seo";
import { event } from "@/app/messages/2026/event";
import { pageMetadata } from "./_utils/metadata";
import { Metadata } from "next";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ locale, pathname: "/" });
}

export default async function Layout2026({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = toLocale(locale);

  return (
    <>
      <StructuredData locale={locale} seoMessages={seoMessages} event={event} />
      <div className="fixed inset-0 z-0 bg-[#101018]" />
      {/* 가로 넘침(호버 글로우 scale, 섹션 배경 -inset-x 등)이 모바일에서 좌우 패닝을 만들지 않도록 뷰포트 폭에서 자른다.
          hidden 이 아니라 clip 이라 스크롤 컨테이너가 생기지 않고, 세로 방향·sticky 동작은 그대로다. */}
      <div className="relative z-10 overflow-x-clip">
        <Nav items={navItems[lang]} ticket={ticketCta[lang]} />
        <div className="min-h-screen">{children}</div>
        <Footer />
      </div>
    </>
  );
}
