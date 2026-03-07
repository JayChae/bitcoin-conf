import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("Footer");
  return (
    <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
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
                href="https://x.com/btckoreaconf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white text-sm transition-colors duration-200"
              >
                @btckoreaconf
              </Link>
            </div>
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

        {/* Business Info */}
        <div className="border-t border-white/10 pt-6 space-y-1 text-white/40 text-xs leading-relaxed">
          <p>상호명: 비토문 | 사업자번호: 747-36-01655</p>
          <p>
            우편번호: 41935 | 사업장 주소: 대구광역시 중구 국채보상로 558-1, 2층
            S25호(종로1가)
          </p>
          <p>
            대표 이메일: admin@bitomun.com | 대표자명: 박성현 | 국문상호명:
            비토문
          </p>
          <p>통신판매업 신고표기: 2026-대구중구-0149</p>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-6 mt-6">
          <div className="flex justify-center">
            <p className="text-white/60 text-sm">
              © 2026 Bitcoin Korea Conference. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
