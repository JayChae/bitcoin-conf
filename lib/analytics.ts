import { sendGAEvent } from "@next/third-parties/google";
import type { TierKey } from "@/app/[locale]/(2026)/_types/tickets";

// GA4 권장 전자상거래 이벤트 이름을 그대로 쓴다 — 별도 설정 없이 GA 전자상거래
// 보고서에 잡히고, 유입경로 탐색에서 단계로 바로 고를 수 있다.
//   select_item    티켓 카드의 구매 버튼 클릭
//   add_to_cart    티어 페이지에서 첫 좌석 선택
//   begin_checkout 좌석 확보 후 Shopify 결제 페이지로 이동
type TicketEvent = "select_item" | "add_to_cart" | "begin_checkout";

// Meta 픽셀(MetaPixel.tsx)에도 표준 이벤트로 같이 보낸다. 티켓 카드 클릭은 보내지 않는다.
const META_EVENTS: Partial<Record<TicketEvent, string>> = {
  add_to_cart: "AddToCart",
  begin_checkout: "InitiateCheckout",
};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackTicketEvent(
  event: TicketEvent,
  {
    tier,
    price,
    quantity = 1,
  }: { tier: TierKey; price: number; quantity?: number },
) {
  const value = price * quantity;

  sendGAEvent("event", event, {
    currency: "KRW",
    value,
    items: [{ item_id: tier, item_name: tier, price, quantity }],
  });

  const metaEvent = META_EVENTS[event];
  if (metaEvent) {
    window.fbq?.("track", metaEvent, {
      currency: "KRW",
      value,
      content_ids: [tier],
      content_type: "product",
      contents: [{ id: tier, quantity }],
      num_items: quantity,
    });
  }
}
