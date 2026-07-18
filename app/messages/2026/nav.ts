export type NavItem = { label: string; href: string };
export const hrefList = {
  home: "#home",
  speakers: "/speakers",
  schedule: "/schedule",
  sideEvents: "/side-events",
  lightningMarket: "#lightningMarket",
  recap: "/recap",
  sponsors: "/sponsors",
  tickets: "/tickets",
};

const enItems: NavItem[] = [
  { label: "Speakers", href: hrefList.speakers },
  { label: "Schedule", href: hrefList.schedule },
  { label: "Side Events", href: hrefList.sideEvents },
  { label: "Lightning Market", href: hrefList.lightningMarket },
  { label: "2025 Recap", href: hrefList.recap },
  { label: "Sponsors", href: hrefList.sponsors },
] as const;

const koItems: NavItem[] = [
  { label: "연사 소개", href: hrefList.speakers },
  { label: "일정", href: hrefList.schedule },
  { label: "사이드 이벤트", href: hrefList.sideEvents },
  { label: "라이트닝 마켓", href: hrefList.lightningMarket },
  { label: "2025 리캡", href: hrefList.recap },
  { label: "스폰서", href: hrefList.sponsors },
] as const;

export const ticketCta: Record<string, NavItem> = {
  en: { label: "Get Tickets", href: hrefList.tickets },
  ko: { label: "티켓 구매", href: hrefList.tickets },
};

const navItems = {
  en: enItems,
  ko: koItems,
};

export default navItems;
