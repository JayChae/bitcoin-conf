"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { type NavItem } from "@/app/messages/2025/nav";
import Mobile from "./Mobile";
import SplitText from "@/components/SplitText";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Check, ChevronDown, Globe } from "lucide-react";

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
      className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b-[1px] border-white/50 font-suit"
      ref={initScroll}
    >
      <div className="max-w-7xl mx-auto px-6 xl:px-2 relative md:py-2">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo-v2.png" alt="Logo" width={40} height={40} />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="flex items-center justify-center space-x-8">
              {items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleClick(e, item.href)}
                  className="text-white/80 text-lg font-light cursor-pointer flex items-center justify-center h-10"
                >
                  <SplitText
                    text={item.label}
                    triggerOn="hover"
                    from={{ opacity: 0, y: 10 }}
                    to={{ opacity: 1, y: 0 }}
                    duration={0.8}
                    delay={80}
                    ease="power3.out"
                  />
                </Link>
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex items-center justify-center gap-1 group text-lg">
                    <Globe className="size-5 text-white/80 group-hover:text-white cursor-pointer transition-colors duration-200" />
                    <span className="text-white/80 group-hover:text-white cursor-pointer transition-colors duration-200">
                      {locale === "en" ? "English" : "한국어"}
                    </span>
                    <ChevronDown className="size-5 text-white/80 group-hover:text-white cursor-pointer transition-colors duration-200" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="bg-black/90 border-white/20 backdrop-blur-md min-w-24"
                  sideOffset={12}
                >
                  <DropdownMenuItem
                    className={`text-md focus:bg-white/10 focus:text-white ${
                      locale === "en"
                        ? "text-white bg-white/10 cursor-default"
                        : "text-white/80 hover:text-white cursor-pointer"
                    }`}
                  >
                    <Link href="/" locale="en" className="flex items-center gap-2 w-full">
                      English
                      {locale === "en" && <Check className="size-4" />}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={`text-md focus:bg-white/10 focus:text-white ${
                      locale === "ko"
                        ? "text-white bg-white/10 cursor-default"
                        : "text-white/80 hover:text-white cursor-pointer"
                    }`}
                  >
                    <Link href="/" locale="ko" className="flex items-center gap-2 w-full">
                      한국어
                      {locale === "ko" && <Check className="size-4" />}
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
