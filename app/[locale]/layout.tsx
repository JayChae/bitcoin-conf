import type { Metadata } from "next";
import "./globals.css";
import Nav from "./_components/Nav";
import Footer from "./_components/Footer";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import navItems from "../messages/nav";
import localFont from "next/font/local";
import { generateSEOMetadata, generateStructuredData } from "../_utils/seo";
import { GoogleAnalytics } from "@next/third-parties/google";

const pretendardFont = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generateSEOMetadata({ locale });
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  const lang = locale === "en" ? "en" : "ko";

  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const structuredData = generateStructuredData(locale);

  return (
    <html lang={locale} className={`size-full ${pretendardFont.className}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className={`antialiased size-full relative overflow-y-auto bg-black`}>
        <NextIntlClientProvider>
          <Nav items={navItems[lang]} />
          <div className="h-screen">{children}</div>
          <Footer />
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics gaId="G-9R5RSRB96E" />
    </html>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
