import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MarketVendor } from "@/app/messages/2026/lightningMarket";
import { MONO_CLASS, RULE_CLASS } from "../Schedule/styles";
import ProductPhoto from "./ProductPhoto";

type Props = {
  vendor: MarketVendor;
  index: number;
  storeLabel: string;
};

// lg 는 max-w-7xl 의 7/12 열 안 2열 그리드, sm 은 2열, 모바일은 최대 320px 레일 타일.
const PRODUCT_SIZES =
  "(min-width: 1312px) 353px, (min-width: 1024px) 27vw, (min-width: 640px) 46vw, (min-width: 445px) 320px, 72vw";

// 마켓 페이지의 셀러 쇼룸. lg 에서는 셀러 정보가 왼쪽에 붙어 있고 오른쪽으로 상품이 흐른다.
export default function VendorArticle({ vendor, index, storeLabel }: Props) {
  return (
    <article
      id={vendor.slug}
      className={cn(
        "scroll-mt-24 md:scroll-mt-28 border-t pt-10 md:pt-14 lg:grid lg:grid-cols-12 lg:gap-x-12",
        RULE_CLASS,
      )}
    >
      {/* 그리드 칸 높이로 늘어나면 붙어 있을 자리가 없으므로 self-start. */}
      <header className="relative lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
        {/* VenueCard 의 큰 숫자와 같은 문법 — 셀러명 뒤에 흐리게 걸친다. */}
        <span
          aria-hidden
          className={cn(
            MONO_CLASS,
            "pointer-events-none select-none absolute -top-5 md:-top-8 -left-1 font-extrabold leading-none tracking-tighter text-[6.5rem] md:text-[9rem] text-white/[0.07]",
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <h3 className="relative pt-12 md:pt-16 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[0.95] text-white break-keep">
          {vendor.name}
        </h3>
        <p className="relative mt-3 text-[15px] md:text-base text-white/65 break-keep">
          {vendor.category}
        </p>
        <p className="relative mt-5 md:mt-6 max-w-xl text-[15px] md:text-base leading-relaxed text-white/75 break-keep">
          {vendor.description}
        </p>

        {vendor.storeUrl && (
          <a
            href={vendor.storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative mt-6 inline-flex items-center gap-1 text-[15px] md:text-base text-white/80 hover:text-white underline underline-offset-4 decoration-white/25 hover:decoration-white/60 transition-colors duration-200"
          >
            {storeLabel}
            <ArrowUpRight
              aria-hidden
              className="size-3.5 text-white/50 group-hover:text-white transition-colors duration-200"
            />
          </a>
        )}
      </header>

      {/* 모바일: 화면 끝까지 닿는 진열대(스냅 레일). sm 부터 2열 그리드. */}
      <div className="mt-8 lg:mt-0 lg:col-span-7 -mx-4 overflow-x-auto overflow-y-hidden overscroll-x-contain snap-x snap-mandatory scroll-px-4 scrollbar-none sm:mx-0 sm:overflow-visible sm:snap-none">
        <ul className="flex w-max gap-3 px-4 sm:grid sm:w-auto sm:grid-cols-2 sm:gap-x-5 sm:gap-y-10 sm:px-0">
          {vendor.products.map((product, productIndex) => (
            <li
              key={product.image}
              className="w-[72vw] max-w-80 shrink-0 snap-start sm:w-auto sm:max-w-none"
            >
              <figure>
                {/* 첫 셀러의 앞 두 장은 데스크톱 첫 화면에 걸리는 LCP 후보라 미리 받는다. */}
                <ProductPhoto
                  src={product.image}
                  alt={product.name}
                  sizes={PRODUCT_SIZES}
                  priority={index === 0 && productIndex < 2}
                />
                <figcaption className="mt-3">
                  <p className="text-[15px] md:text-base font-semibold leading-snug text-white break-keep">
                    {product.name}
                  </p>
                  {product.description && (
                    <p className="mt-1.5 text-sm leading-relaxed text-white/65 break-keep">
                      {product.description}
                    </p>
                  )}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
