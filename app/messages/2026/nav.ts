export type NavItem = { label: string; href: string };
export const hrefList = {
  home: "#home",
  speakers: "#speakers",
  schedule: "#schedule",
  lightningMarket: "#lightningMarket",
  sponsors: "#sponsors",
};

const enItems: NavItem[] = [
  { label: "Schedule", href: hrefList.schedule },
  { label: "Speakers", href: hrefList.speakers },
  { label: "Lightning Market", href: hrefList.lightningMarket },
  { label: "Tickets", href: hrefList.home },
  { label: "Sponsors", href: hrefList.sponsors },
] as const;

const koItems: NavItem[] = [
  { label: "일정", href: hrefList.schedule },
  { label: "연사 소개", href: hrefList.speakers },
  { label: "라이트닝 마켓", href: hrefList.lightningMarket },
  { label: "티켓", href: hrefList.home },
  { label: "후원사", href: hrefList.sponsors },
] as const;

const navItems = {
  en: enItems,
  ko: koItems,
};

export default navItems;
