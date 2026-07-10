import { setRequestLocale } from "next-intl/server";
import Nav from "./_components/Nav";
import Footer from "./_components/Footer";
import navItems from "@/app/messages/2026/nav";
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
      <div className="relative z-10">
        <Nav items={navItems[lang]} />
        <div className="min-h-screen">{children}</div>
        <Footer />
      </div>
    </>
  );
}
