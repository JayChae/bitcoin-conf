import type { Locale } from "@/i18n/routing";

export type VenueId = "coex" | "kfb" | "masil";

type VenueMeta = {
  day: 1 | 2;
  naverMapUrl: string;
  googleMapUrl: string;
};

export function venueMapUrl(id: VenueId, locale: Locale): string {
  const v = venues[id];
  return locale === "ko" ? v.naverMapUrl : v.googleMapUrl;
}

export const venues: Record<VenueId, VenueMeta> = {
  coex: {
    day: 1,
    naverMapUrl: "https://map.naver.com/p/search/%EC%BD%94%EC%97%91%EC%8A%A4",
    googleMapUrl:
      "https://www.google.com/maps/search/?api=1&query=COEX+Seoul",
  },
  kfb: {
    day: 2,
    naverMapUrl:
      "https://map.naver.com/p/search/%EC%A0%84%EA%B5%AD%EC%9D%80%ED%96%89%EC%97%B0%ED%95%A9%ED%9A%8C",
    googleMapUrl:
      "https://www.google.com/maps/search/?api=1&query=Korea+Federation+of+Banks+Myeongdong+Seoul",
  },
  masil: {
    day: 2,
    naverMapUrl:
      "https://map.naver.com/p/search/%EC%BB%A4%EB%AE%A4%EB%8B%88%ED%8B%B0%ED%95%98%EC%9A%B0%EC%8A%A4%20%EB%A7%88%EC%8B%A4",
    googleMapUrl:
      "https://www.google.com/maps/search/?api=1&query=Community+House+Masil+Myeongdong+Seoul",
  },
};
