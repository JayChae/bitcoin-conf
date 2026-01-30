import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("Footer");
  return (
    <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg mb-4">
              {t("contact")}
            </h3>
            <div className="flex items-center gap-2">
              <Image
                src="/sns/x.svg"
                alt="X (Twitter)"
                width={18}
                height={18}
                className="opacity-100"
              />
              <Link
                href="https://x.com/Bitcoinminiconf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white text-sm transition-colors duration-200"
              >
                @Bitcoinminiconf
              </Link>
            </div>
          </div>

          {/* Donation Section */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg mb-4">
              {t("donation")}
            </h3>
            <Link
              href="mailto:bitcoinspecter@gmail.com"
              className="text-white/60 hover:text-white text-sm transition-colors duration-200 block"
            >
              lovebtc@blink.sv
            </Link>
          </div>

          {/* Location Section */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg mb-4">
              {t("location")}
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">
                  {t("day1")}
                </p>
                <p className="text-white/60 text-sm leading-relaxed">
                  {t("address1")}
                </p>
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">
                  {t("day2")}
                </p>
                <div className="space-y-1">
                  <p className="text-white/60 text-sm">{t("address2")}</p>
                  <p className="text-white/60 text-sm">{t("address3")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-6">
          <div className="flex justify-center">
            <p className="text-white/60 text-sm">
              © 2025 Bitcoin Mini Conference. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
