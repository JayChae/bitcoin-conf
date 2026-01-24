"use client";

import Image from "next/image";
import { type Market, type Product } from "../../messages/markets";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { handleModalRef } from "@/app/_utils/modal";

type Props = {
  market: Market | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function MarketModal({ market, isOpen, onClose }: Props) {
  const t = useTranslations("LightningMarket");

  if (!isOpen || !market) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      ref={() => handleModalRef(onClose)}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300 modal-scrollbar">
        <div className="relative">
          {/* Background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/40 to-purple-600/60 rounded-3xl" />

          {/* Animated border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-400 to-purple-600 p-[3px]">
            <div className="h-full w-full bg-black/95 rounded-3xl" />
          </div>

          {/* Content */}
          <div className="relative p-8 md:p-12">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-purple-500/20 hover:bg-purple-500/40 text-white hover:text-purple-200 transition-all duration-300 group cursor-pointer"
            >
              <svg
                className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-6 mb-6">
                {/* Logo */}
                {market.logo && (
                  <div className="relative size-20 md:size-24 flex-shrink-0 overflow-hidden rounded-full">
                    <div className="h-full w-full bg-white rounded-full overflow-hidden">
                      <Image
                        src={market.logo}
                        alt={`${market.name} logo`}
                        fill
                        className="object-contain rounded-full"
                        priority
                      />
                    </div>
                  </div>
                )}

                {/* Title */}
                <div className="flex-1">
                  <h2 className="text-xl md:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    {market.name}
                  </h2>
                  <div className="h-1 w-1/3 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg md:text-xl font-semibold text-purple-200 mb-2">
                {t("about")}
              </h3>
              <p className="text-gray-300 text-sm md:text-lg leading-relaxed">
                {market.description}
              </p>
            </div>

            {/* products section */}
            <div className="mb-8">
              <h3 className="text-lg md:text-xl font-semibold text-purple-200 mb-2">
                {t("products")}
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {market.products?.map((product, index) => (
                  <ProductImageCard
                    key={index}
                    product={product}
                    index={index}
                  />
                )) || (
                  <div className="col-span-full text-center py-12">
                    <div className="text-gray-400 italic text-sm md:text-lg">
                      {t("productsInformationComingSoon")}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Special Event section */}
            {market.specialEvent && (
              <div className="mb-8">
                <h3 className="text-lg md:text-xl font-semibold text-purple-200 mb-2">
                  {t("specialEvent")}
                </h3>
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30">
                  <div className="flex items-center gap-3">
                    <svg
                      className="size-4 md:size-6 text-yellow-400 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-yellow-100 font-medium text-xs md:text-base">
                      {market.specialEvent}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Contact/Links section */}
            <div className="space-y-4">
              <div className="flex gap-2 md:gap-4">
                {market.website && (
                  <Link
                    href={market.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-4 md:px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-medium text-sm md:text-base rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    {t("website")}
                  </Link>
                )}

                {market.onlineStore && (
                  <Link
                    href={market.onlineStore}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-4 md:px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-medium text-sm md:text-base rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    {t("onlineStore")}
                  </Link>
                )}
              </div>

              {market.contact && (
                <div className="flex items-center gap-3 text-gray-300">
                  <svg
                    className="w-5 h-5 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                  <span className="font-medium text-sm md:text-base">
                    Contact: {market.contact}
                  </span>
                </div>
              )}
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-purple-400/20 rounded-full animate-pulse"
                  style={{
                    left: `${10 + i * 20}%`,
                    top: `${5 + i * 15}%`,
                    animationDelay: `${i * 0.8}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Separate component for product images
function ProductImageCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  return (
    <div className="group flex flex-col items-center space-y-3">
      {/* Image Container */}
      <div className="relative size-24 md:size-36 overflow-hidden rounded-xl bg-gray-900/50 transition-transform duration-300 group-hover:scale-110">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain"
            priority={index < 2} // Prioritize first 2 images
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full bg-purple-500/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-purple-400/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Product Name */}
      <p className="text-sm text-gray-300 font-medium text-center leading-tight">
        {product.name}
      </p>
    </div>
  );
}
