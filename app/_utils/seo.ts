import { Metadata } from "next";
import { seoMessages, SeoLanguage } from "../messages/2025/seo";

interface GenerateMetadataProps {
  locale: string;
  pathname?: string;
}

export function generateSEOMetadata({
  locale,
  pathname = "/",
}: GenerateMetadataProps): Metadata {
  const lang = (locale === "ko" ? "ko" : "en") as SeoLanguage;
  const seo = seoMessages[lang];

  const baseUrl = "https://mini.bitcoinconf.org";
  const url = `${baseUrl}${locale === "en" ? "" : `/${locale}`}${
    pathname === "/" ? "" : pathname
  }`;

  const images = [
    {
      url: `${baseUrl}/logo-dark.png`,
      width: 1200,
      height: 630,
      alt: seo.siteName,
    },
  ];

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: seo.author }],
    creator: seo.creator,
    publisher: seo.publisher,
    category: seo.category,
    classification: seo.classification,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: "/logo-v2.png",
      shortcut: "/logo-v2.png",
      apple: "/logo-v2.png",
    },
    openGraph: {
      type: "website",
      locale: lang === "ko" ? "ko_KR" : "en_US",
      url,
      title: seo.ogTitle,
      description: seo.ogDescription,
      siteName: seo.siteName,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitterTitle,
      description: seo.twitterDescription,
      images,
      creator: "@Bitcoinminiconf",
      site: "@Bitcoinminiconf",
    },
    alternates: {
      canonical: url,
      languages: {
        en: `${baseUrl}`,
        ko: `${baseUrl}/ko`,
        "x-default": `${baseUrl}`,
      },
    },
    other: {
      "geo.region": seo.geo.region,
      "geo.placename": seo.geo.placename,
      "geo.position": `${seo.geo.region};${seo.geo.placename}`,
      ICBM: `${seo.geo.region};${seo.geo.placename}`,
      "revisit-after": seo.revisitAfter,
      audience: seo.audience,
      subject: seo.subject,
    },
  };
}

export function generateStructuredData(locale: string) {
  const lang = (locale === "ko" ? "ko" : "en") as SeoLanguage;
  const seo = seoMessages[lang];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: seo.title,
    description: seo.description,
    startDate: "2025-11-29T09:00:00+09:00",
    endDate: "2025-11-30T18:00:00+09:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: [
      {
        "@type": "Place",
        name: "NSP Hall",
        address: {
          "@type": "PostalAddress",
          streetAddress: "20, Magokjungang 1-ro, Gangseo-gu",
          addressLocality: "Seoul",
          addressCountry: "KR",
        },
      },
      {
        "@type": "Place",
        name: "Hanbit Building",
        address: {
          "@type": "PostalAddress",
          streetAddress: "76, Yeonhui-ro 2-gil, Seodaemun-gu",
          addressLocality: "Seoul",
          addressCountry: "KR",
        },
      },
    ],
    image: ["https://mini.bitcoinconf.org/logo-dark.png"],
    organizer: {
      "@type": "Organization",
      name: seo.siteName,
      url: "https://mini.bitcoinconf.org",
    },
    offers: {
      "@type": "Offer",
      url: "https://mini.bitcoinconf.org",
      availability: "https://schema.org/InStock",
    },
    inLanguage: lang === "ko" ? "ko-KR" : "en-US",
    about: {
      "@type": "Thing",
      name: "Bitcoin",
      description: "Bitcoin education and community conference",
    },
  };

  return structuredData;
}
