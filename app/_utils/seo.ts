import { Metadata } from "next";
import { SeoLanguage, seoMessages } from "../messages/2025/seo";

interface GenerateMetadataProps {
  locale: string;
  pathname?: string;
  seoMessages: any;
}

export function generateSEOMetadata({
  locale,
  pathname = "/",
  seoMessages,
}: GenerateMetadataProps): Metadata {
  const lang = (locale === "ko" ? "ko" : "en") as SeoLanguage;
  const seo = seoMessages[lang];

  const baseUrl = "https://bitcoinkoreaconference.com";
  const url = `${baseUrl}${locale === "en" ? "" : `/${locale}`}${
    pathname === "/" ? "" : pathname
  }`;

  const images = [
    {
      url: `${baseUrl}/logo-v2.png`,
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
      creator: "@Bitcoinkoreaconference",
      site: "@Bitcoinkoreaconference",
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
        name: "COEX",
        address: {
          "@type": "PostalAddress",
          streetAddress: "159, Samsung-ro, Gangnam-gu",
          addressLocality: "Seoul",
          addressCountry: "KR",
        },
      },
    ],
    image: ["https://bitcoinkoreaconference.com/logo-dark.png"],
    organizer: {
      "@type": "Organization",
      name: seo.siteName,
      url: "https://bitcoinkoreaconference.com",
    },
    offers: {
      "@type": "Offer",
      url: "https://bitcoinkoreaconference.com",
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
