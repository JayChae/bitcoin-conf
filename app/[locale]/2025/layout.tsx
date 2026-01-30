import { setRequestLocale } from "next-intl/server";
import Footer from "./_components/Footer";
import DarkVeil from "./_components/DarkVeil";
import Nav from "./_components/Nav";
import navItems from "@/app/messages/2025/nav";
import { generateSEOMetadata } from "@/app/_utils/seo";
import { Metadata } from "next";
import { seoMessages } from "@/app/messages/2025/seo";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generateSEOMetadata({ locale, seoMessages: seoMessages });
}
export default async function Layout2025({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale === "en" ? "en" : "ko";

  return (
    <>
      <Nav items={navItems[lang]} />
      {children}
      <Footer />
      <DarkVeil speed={0.8} />
    </>
  );
}
