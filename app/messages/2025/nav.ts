export type NavItem = { label: string; href: string };
export const hrefList = {
  home: "#home",
  speakers: "#speakers",
  schedule: "#schedule",
  lightningMarket: "#lightningMarket",
  sponsors: "#sponsors",
};

const enItems: NavItem[] = [
  { label: "Tickets", href: hrefList.home },
  { label: "Speakers", href: hrefList.speakers },
  { label: "Schedule", href: hrefList.schedule },
  { label: "Lightning Market", href: hrefList.lightningMarket },
  { label: "Sponsors", href: hrefList.sponsors },
] as const;

const koItems: NavItem[] = [
  { label: "티켓", href: hrefList.home },
  { label: "연사 소개", href: hrefList.speakers },
  { label: "일정", href: hrefList.schedule },
  { label: "라이트닝 마켓", href: hrefList.lightningMarket },
  { label: "후원자", href: hrefList.sponsors },
] as const;

const navItems = {
  en: enItems,
  ko: koItems,
};

export default navItems;
