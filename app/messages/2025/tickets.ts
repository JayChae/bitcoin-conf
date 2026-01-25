export type TicketButton = {
  name: string;
  url: string;
  color: string;
};

const urlList = {
  btc: "https://store.btcmap.kr/meetup/Bitcoin_Mini_Conference/22/",
  krw: "https://smartstore.naver.com/promenadecastle/products/12591151124",
};

const koTickets: TicketButton[] = [
  {
    name: "₿ 티켓 구매 (비트코인)",
    url: urlList.btc,
    color: "orange",
  },
  {
    name: "₩ 티켓 구매 (원화)",
    url: urlList.krw,
    color: "cyan",
  },
] as const;

const enTickets: TicketButton[] = [
  {
    name: "₿ Tickets (BTC) ",
    url: urlList.btc,
    color: "orange",
  },
  {
    name: "₩ Tickets (KRW) ",
    url: urlList.krw,
    color: "cyan",
  },
] as const;

const tickets = {
  ko: koTickets,
  en: enTickets,
};

export default tickets;
