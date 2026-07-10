import type { EventInfo } from "@/app/_utils/seo";
import { TICKETS } from "@/app/[locale]/(2026)/_constants/tickets";

const generalPrice = TICKETS.find((t) => t.tier === "general")!.basePrice;

export const event: EventInfo = {
  startDate: "2026-11-07T09:00:00+09:00",
  endDate: "2026-11-08T18:00:00+09:00",
  image: "/2026/2026_OG.jpg",
  ogImage: { url: "/2026/2026_OG.jpg", width: 1280, height: 720 },
  places: [
    {
      name: "COEX",
      streetAddress: "513 Yeongdong-daero, Gangnam-gu",
      addressLocality: "Seoul",
      addressCountry: "KR",
    },
    {
      name: "Korea Federation of Banks",
      streetAddress: "19 Myeongdong 11-gil, Jung-gu",
      addressLocality: "Seoul",
      addressCountry: "KR",
    },
    {
      name: "Community House Masil",
      streetAddress: "14 Myeongdong 11-gil, Jung-gu",
      addressLocality: "Seoul",
      addressCountry: "KR",
    },
  ],
  offers: {
    path: "/tickets",
    // Lowest tier at full price.
    price: generalPrice,
    priceCurrency: "KRW",
    availability: "https://schema.org/InStock",
  },
};
