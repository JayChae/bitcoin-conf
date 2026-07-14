"use client";

import { Link } from "@/i18n/navigation";
import { type NavItem } from "./navItems";

type Props = {
  items: NavItem[];
  ticket: NavItem;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  handleClick: (e: React.MouseEvent, href: string) => void;
  locale: string;
};

export default function Mobile({
  items,
  ticket,
  isOpen,
  setIsOpen,
  handleClick,
  locale,
}: Props) {
  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white/80 hover:text-white p-2 rounded-md transition-colors duration-200 cursor-pointer"
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-black/90 backdrop-blur-md rounded-b-lg border border-white/10">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className="text-white/80 hover:text-white block px-3 py-2 text-base font-medium transition-colors duration-200 cursor-pointer"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/10">
              <Link
                href={ticket.href}
                className="block text-center px-3 py-2 text-base font-semibold text-[#101018] bg-white/90 rounded-full border border-white transition-all duration-150 ease-out hover:bg-[#E947F5] hover:border-[#E947F5] hover:text-white hover:shadow-[0_0_24px_-4px_rgba(233,71,245,0.85)] active:scale-[0.97] cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                {ticket.label}
              </Link>
            </div>
            <div className="pt-2 border-t border-white/10">
              <Link
                href="/"
                locale={locale === "en" ? "ko" : "en"}
                className="text-white/80 hover:text-white block w-full text-left px-3 py-2 text-base font-medium transition-colors duration-200 bg-white/10 hover:bg-white/20 rounded-md border border-white/20 cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                {locale === "en" ? "한국어" : "English"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
