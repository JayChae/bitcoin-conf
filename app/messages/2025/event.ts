import type { EventInfo } from "@/app/_utils/seo";

export const event: EventInfo = {
  startDate: "2025-11-29T09:00:00+09:00",
  endDate: "2025-11-30T18:00:00+09:00",
  image: "/logo-dark.png",
  // The /api/og card is rendered with this edition's branding.
  ogImage: { url: "/api/og", width: 1200, height: 630 },
  places: [
    {
      name: "NSP Hall",
      streetAddress: "B1, 20, Magokjungang 1-ro, Gangseo-gu",
      addressLocality: "Seoul",
      addressCountry: "KR",
    },
    {
      name: "Hanbit Building",
      streetAddress: "76, Yeonhui-ro 2-gil, Seodaemun-gu",
      addressLocality: "Seoul",
      addressCountry: "KR",
    },
    {
      name: "SPACE BE",
      streetAddress: "21, Donggyo-ro 30-gil, Mapo-gu",
      addressLocality: "Seoul",
      addressCountry: "KR",
    },
  ],
};
