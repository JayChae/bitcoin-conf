import { setRequestLocale } from "next-intl/server";
import Nav from "./_components/Nav";
import Footer from "./_components/Footer";
import navItems from "@/app/messages/nav";

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
      <Nav items={navItems[lang]} />
      {children}
      <Footer />
    </>
  );
}
