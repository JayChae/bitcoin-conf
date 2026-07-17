import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { routing } from "./i18n/routing";

const nextConfig: NextConfig = {
  images: {
    // 설정하는 순간 허용 목록이 된다 — 목록에 없는 q 는 최적화 단계에서 400.
    // 그래서 ReviewCard/ReviewLightbox 의 82 뿐 아니라, quality 를 넘기지 않는
    // 나머지 이미지가 쓰는 기본값 75 도 함께 있어야 한다.
    qualities: [75, 82],
  },
  // /partners 는 /sponsors 로 흡수됐다.
  // next.config 의 redirects 는 next-intl 미들웨어보다 먼저 실행되므로
  // (headers → redirects → middleware) 로케일 프리픽스가 붙은 경로를 직접 매칭해야 한다.
  // localePrefix 가 기본값("always")이라 실제 URL 은 전부 로케일 프리픽스를 갖는다.
  async redirects() {
    return [
      {
        // 로케일 목록은 routing.locales 단일 출처에서 파생(로케일 추가 시 자동 반영).
        source: `/:locale(${routing.locales.join("|")})/partners`,
        destination: "/:locale/sponsors",
        permanent: true,
      },
      // 프리픽스 없는 레거시 링크: /sponsors 로 보내면 미들웨어가
      // Accept-Language 에 맞춰 프리픽스를 붙인다(2-hop, 의도된 동작).
      { source: "/partners", destination: "/sponsors", permanent: true },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
