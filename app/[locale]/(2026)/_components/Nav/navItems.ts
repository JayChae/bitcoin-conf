export type NavItem = {
  label: string;
  href: string;
};

const enItems: NavItem[] = [
  { label: "Speakers", href: "/speakers" },
  { label: "Tickets", href: "/tickets" },
];

const koItems: NavItem[] = [
  { label: "연사 소개", href: "/speakers" },
  { label: "티켓", href: "/tickets" },
];

const navItems: Record<string, NavItem[]> = {
  en: enItems,
  ko: koItems,
};

export default navItems;
