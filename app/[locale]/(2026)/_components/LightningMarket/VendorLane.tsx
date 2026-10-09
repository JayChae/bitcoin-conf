import { Link } from "@/i18n/navigation";
import type { MarketVendor } from "@/app/messages/2026/lightningMarket";
import ProductPhoto from "./ProductPhoto";

type Props = {
  vendor: MarketVendor;
};

// 골목에는 셀러당 앞쪽 상품만 진열한다 — 전부는 마켓 페이지에서 본다.
const LANE_LIMIT = 4;

// 타일 폭(w-[72vw] sm:w-60 md:w-64 lg:w-72)과 짝을 이룬다.
// 마지막 항목을 calc() 로 감싼 것은 의도적이다 — Next 는 sizes 안의 맨 "Nvw" 중 가장
// 작은 값으로 후보를 걸러 256·384w 를 빼 버려서, 1x 데스크톱이 288px 타일에 640w 를 받게 된다.
const TILE_SIZES =
  "(min-width: 1024px) 288px, (min-width: 768px) 256px, (min-width: 640px) 240px, calc(72vw)";

// 랜딩 골목의 셀러 한 곳(상품 타일 묶음). 어느 셀러인지는 MarketRail 의 목차가 알려준다.
export default function VendorLane({ vendor }: Props) {
  return (
    <li className="shrink-0">
      <ul className="flex gap-3 md:gap-4">
        {vendor.products.slice(0, LANE_LIMIT).map((product) => (
          <li
            key={product.image}
            className="w-[72vw] shrink-0 snap-start sm:w-60 md:w-64 lg:w-72"
          >
            <Link
              href={`/lightning-market#${vendor.slug}`}
              className="group block focus:outline-none"
            >
              {/* 상품명이 바로 아래 캡션으로 링크 이름이 되므로 alt 는 비운다. */}
              <ProductPhoto
                src={product.image}
                alt=""
                sizes={TILE_SIZES}
                className="group-focus-visible:ring-2 group-focus-visible:ring-white/70"
                imageClassName="motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.03]"
              />
              <p className="mt-3 text-[15px] md:text-base font-semibold leading-snug text-white break-keep">
                {product.name}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}
