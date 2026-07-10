import { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export const BASE_URL = "https://bitcoinkoreaconference.com";

export interface EventPlace {
  name: string;
  streetAddress: string;
  addressLocality: string;
  addressCountry: string;
}

export interface OgImage {
  /** Path relative to the site root, e.g. "/2026/2026_OG.jpg" */
  url: string;
  width?: number;
  height?: number;
}

export interface EventOffer {
  /** Path relative to the locale root, e.g. "/tickets" */
  path: string;
  price: number;
  priceCurrency: string;
  availability: string;
}

export interface EventInfo {
  startDate: string;
  endDate: string;
  /** Path relative to the site root, e.g. "/2026/2026_OG.jpg" */
  image: string;
  ogImage: OgImage;
  places: EventPlace[];
  /** Omit for past editions — a closed event has nothing on offer. */
  offers?: EventOffer;
}

interface SeoGeo {
  region: string;
  placename: string;
  /** "latitude;longitude" in decimal degrees; both tags are omitted without it. */
  position?: string;
}

export interface SeoContent {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
  siteName: string;
  author: string;
  creator: string;
  publisher: string;
  category: string;
  classification: string;
  subject: string;
  audience: string;
  revisitAfter: string;
  geo: SeoGeo;
}

export type SeoMessages = Record<Locale, SeoContent>;

export function toLocale(locale: string): Locale {
  return locale === "en" ? "en" : "ko";
}

function localeUrl(locale: Locale, pathname: string): string {
  return `${BASE_URL}${getPathname({ href: pathname, locale })}`;
}

export function generateAlternates(
  locale: string,
  pathname = "/",
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const supported of routing.locales) {
    languages[supported] = localeUrl(supported, pathname);
  }
  languages["x-default"] = localeUrl(routing.defaultLocale, pathname);

  return { canonical: localeUrl(toLocale(locale), pathname), languages };
}

interface GenerateMetadataProps {
  locale: string;
  pathname?: string;
  seoMessages: SeoMessages;
  event: EventInfo;
  /** Overrides the edition-wide title/description for a single page. */
  title?: string;
  description?: string;
  /** Overrides the edition's social card, e.g. a speaker portrait. */
  ogImage?: OgImage;
}

export function generateSEOMetadata({
  locale,
  pathname = "/",
  seoMessages,
  event,
  title,
  description,
  ogImage,
}: GenerateMetadataProps): Metadata {
  const lang = toLocale(locale);
  const seo = seoMessages[lang];
  const url = localeUrl(lang, pathname);
  const card = ogImage ?? event.ogImage;

  // Resolved against the root layout's metadataBase.
  const images = [
    {
      url: card.url,
      width: card.width,
      height: card.height,
      alt: title ?? seo.siteName,
    },
  ];

  return {
    title: title ?? seo.title,
    description: description ?? seo.description,
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
      title: title ?? seo.ogTitle,
      description: description ?? seo.ogDescription,
      siteName: seo.siteName,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? seo.twitterTitle,
      description: description ?? seo.twitterDescription,
      images,
      creator: "@Bitcoinkoreaconference",
      site: "@Bitcoinkoreaconference",
    },
    alternates: generateAlternates(locale, pathname),
    other: {
      "geo.region": seo.geo.region,
      "geo.placename": seo.geo.placename,
      ...(seo.geo.position
        ? { "geo.position": seo.geo.position, ICBM: seo.geo.position }
        : {}),
      "revisit-after": seo.revisitAfter,
      audience: seo.audience,
      subject: seo.subject,
    },
  };
}

interface EditionSeo {
  seoMessages: SeoMessages;
  event: EventInfo;
  /** Prefix under the locale root, e.g. "/2025". Empty for the current edition. */
  basePath?: string;
}

export interface PageMetadataProps {
  /** Path relative to the edition root, e.g. "/speakers". */
  pathname: string;
  /** Defaults to the request locale; pass it when the route already has it. */
  locale?: string;
  title?: string;
  description?: string;
  ogImage?: OgImage;
}

/**
 * Binds an edition's messages and event data so each page only supplies its own
 * path and copy. Without a per-page path, pages inherit the layout's canonical
 * and every route claims to be the homepage.
 */
export function createPageMetadata({
  seoMessages,
  event,
  basePath = "",
}: EditionSeo) {
  return async function pageMetadata({
    locale,
    pathname,
    ...props
  }: PageMetadataProps): Promise<Metadata> {
    return generateSEOMetadata({
      locale: locale ?? (await getLocale()),
      pathname: pathname === "/" ? basePath || "/" : `${basePath}${pathname}`,
      seoMessages,
      event,
      ...props,
    });
  };
}

interface GenerateStructuredDataProps {
  locale: string;
  seoMessages: SeoMessages;
  event: EventInfo;
}

export function generateStructuredData({
  locale,
  seoMessages,
  event,
}: GenerateStructuredDataProps) {
  const lang = toLocale(locale);
  const seo = seoMessages[lang];

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: seo.title,
    description: seo.description,
    startDate: event.startDate,
    endDate: event.endDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: event.places.map((place) => ({
      "@type": "Place",
      name: place.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: place.streetAddress,
        addressLocality: place.addressLocality,
        addressCountry: place.addressCountry,
      },
    })),
    image: [`${BASE_URL}${event.image}`],
    organizer: {
      "@type": "Organization",
      name: seo.siteName,
      url: BASE_URL,
    },
    ...(event.offers
      ? {
          offers: {
            "@type": "Offer",
            url: localeUrl(lang, event.offers.path),
            price: event.offers.price,
            priceCurrency: event.offers.priceCurrency,
            availability: event.offers.availability,
          },
        }
      : {}),
    inLanguage: lang === "ko" ? "ko-KR" : "en-US",
    about: {
      "@type": "Thing",
      name: "Bitcoin",
      description: "Bitcoin education and community conference",
    },
  };
}
