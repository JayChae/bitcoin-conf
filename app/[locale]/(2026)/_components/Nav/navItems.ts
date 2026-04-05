export type NavItem = {
  label: string;
  href: string;
};

const enItems: NavItem[] = [
  { label: "Tickets", href: "/tickets" },
];

const koItems: NavItem[] = [
  { label: "티켓", href: "/tickets" },
];

const navItems: Record<string, NavItem[]> = {
  en: enItems,
  ko: koItems,
};

export default navItems;
