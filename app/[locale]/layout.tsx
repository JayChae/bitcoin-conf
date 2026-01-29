import type { Metadata } from "next";
import "./globals.css";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import localFont from "next/font/local";
import { generateSEOMetadata, generateStructuredData } from "../_utils/seo";
import { GoogleAnalytics } from "@next/third-parties/google";

const suitFont = localFont({
  src: "../../public/fonts/SUIT-Variable.woff2",
});

const ubuntuMonoFont = localFont({
  src: "../../public/fonts/UbuntuMono-BI.ttf",
  variable: "--font-ubuntu-mono",
});

const neurimboGothicFont = localFont({
  src: "../../public/fonts/neurimboGothicRegular.otf",
  variable: "--font-neurimbo-gothic",
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

  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const structuredData = generateStructuredData(locale);

  return (
    <html lang={locale} className={`size-full ${suitFont.className} ${ubuntuMonoFont.variable} ${neurimboGothicFont.variable}`}>
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
          {children}
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics gaId="G-9R5RSRB96E" />
    </html>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
