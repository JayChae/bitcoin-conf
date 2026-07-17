import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    // 설정하는 순간 허용 목록이 된다 — 목록에 없는 q 는 최적화 단계에서 400.
    // 그래서 ReviewCard/ReviewLightbox 의 82 뿐 아니라, quality 를 넘기지 않는
    // 나머지 이미지가 쓰는 기본값 75 도 함께 있어야 한다.
    qualities: [75, 82],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
