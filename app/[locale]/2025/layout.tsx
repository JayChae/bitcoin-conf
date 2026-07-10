import { setRequestLocale } from "next-intl/server";
import Footer from "./_components/Footer";
import DarkVeil from "./_components/DarkVeil";
import Nav from "./_components/Nav";
import navItems from "@/app/messages/2025/nav";
import { toLocale } from "@/app/_utils/seo";
import StructuredData from "@/app/_components/StructuredData";
import { Metadata } from "next";
import { seoMessages } from "@/app/messages/2025/seo";
import { event } from "@/app/messages/2025/event";
import { pageMetadata } from "./_utils/metadata";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ locale, pathname: "/" });
}
export default async function Layout2025({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = toLocale(locale);

  return (
    <>
      <StructuredData locale={locale} seoMessages={seoMessages} event={event} />
      <Nav items={navItems[lang]} />
      {children}
      <Footer />
      <DarkVeil speed={0.8} />
    </>
  );
}
