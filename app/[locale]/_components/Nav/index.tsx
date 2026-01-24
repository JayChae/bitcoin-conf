"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { type NavItem } from "@/app/messages/nav";
import Mobile from "./Mobile";

type Props = {
  items: NavItem[];
};

export default function Nav({ items }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  const handleClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      // URL 업데이트
      router.push(href, { scroll: false });
      // 부드러운 스크롤
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setIsOpen(false);
  };

  const initScroll = useCallback(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10"
      ref={initScroll}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo-v2.png" alt="Logo" width={40} height={40} />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleClick(e, item.href)}
                  className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/"
                locale={locale === "en" ? "ko" : "en"}
                className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200 bg-white/10 hover:bg-white/20 rounded-md border border-white/20 cursor-pointer"
              >
                {locale === "en" ? "한국어" : "English"}
              </Link>
            </div>
          </div>

          {/* Mobile Navigation */}
          <Mobile
            items={items}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            handleClick={handleClick}
            locale={locale}
          />
        </div>
      </div>
    </nav>
  );
}
