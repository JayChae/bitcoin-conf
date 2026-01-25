import { setRequestLocale } from "next-intl/server";
import Nav from "./_components/Nav";
import Footer from "./_components/Footer";
import navItems from "@/app/messages/nav";
import ColorBends from "@/components/ColorBends";
import FloatingLines from "@/components/FloatingLines";
import LiquidEther from "@/components/LiquidEther";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function Layout2026({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale === "en" ? "en" : "ko";

  return (
    <>
      <div className="fixed inset-0 z-0 bg-black">
        {/* <ColorBends /> */}
        <FloatingLines />
        {/* <LiquidEther /> */}
      </div>
      <div className="relative z-10">
        <Nav items={navItems[lang]} />
        <div className="min-h-screen">{children}</div>
        <Footer />
      </div>
      {/*  배경 이미지 적용시
      <Nav items={navItems[lang]} />
      <div className="min-h-screen">{children}</div>
      <Footer /> */}
    </>
  );
}
