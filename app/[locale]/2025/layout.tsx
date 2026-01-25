import { setRequestLocale } from "next-intl/server";
import Footer from "./_components/Footer";
import DarkVeil from "./_components/DarkVeil";
import Nav from "./_components/Nav";
import navItems from "@/app/messages/2025/nav";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

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
