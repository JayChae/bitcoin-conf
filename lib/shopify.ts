import crypto from "crypto";
import { getTicketVariantId, getAfterPartyVariantId, DISCOUNT_CODES } from "./shopify-config";
import { signPayload } from "./qr";
import type { UtmParams } from "./utm";
import type {
  PricingPhase,
  SeatedTierKey,
  SeatlessTierKey,
} from "@/app/[locale]/(2026)/_types/tickets";
import type { SeatHoldRequest } from "@/app/[locale]/(2026)/_types/seats";

const STOREFRONT_URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-10/graphql.json`;
const ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_DISCOUNT_UPDATE_MUTATION = `
  mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]!) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

async function storefrontFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(`Shopify GraphQL error: ${JSON.stringify(json.errors)}`);
  }

  return json.data as T;
}

type CartLine = {
  merchandiseId: string;
  quantity: number;
  attributes: { key: string; value: string }[];
};

export async function createCheckoutCart(
  seats: SeatHoldRequest[],
  tier: SeatedTierKey,
  phase: PricingPhase,
  locale?: string,
  utm: UtmParams = {},
): Promise<{ cartId: string; checkoutUrl: string }> {
  // 1. Ticket line items (one per seat) with QR token for check-in
  const ticketVariantId = getTicketVariantId(tier);
  const checkoutId = crypto.randomUUID().slice(0, 8);
  const ticketLines = seats.map((seat) => ({
    merchandiseId: ticketVariantId,
    quantity: 1,
    attributes: [
      { key: "seat_section", value: seat.section },
      { key: "seat_number", value: seat.seat.toString() },
      { key: "after_party", value: seat.afterParty.toString() },
      {
        key: "_qr_token",
        value: signPayload({
          cid: checkoutId,
          sec: seat.section,
          seat: seat.seat,
          tier,
          ap: seat.afterParty,
        }),
      },
    ],
  }));

  // 2. After Party line items (separate product, VIP excluded — AP included in VIP ticket)
  const apSeats = seats.filter((seat) => seat.afterParty && tier !== "vip");
  // AP 좌석이 있을 때만 조회한다 — 없으면 미등록 환경변수로 던질 이유가 없다
  const apVariantId = apSeats.length > 0 ? getAfterPartyVariantId() : "";
  const apLines = apSeats.map((seat) => ({
      merchandiseId: apVariantId,
      quantity: 1,
      attributes: [
        { key: "seat_section", value: seat.section },
        { key: "seat_number", value: seat.seat.toString() },
      ],
  }));

  return createCart([...ticketLines, ...apLines], phase, locale, utm);
}

/**
 * 좌석 없는 티어의 카트. 매수만큼 줄을 나눠 줄마다 QR 토큰을 단다 —
 * 주문 확인 이메일이 _qr_token이 있는 줄마다 QR을 하나씩 그리기 때문이다.
 *
 * QR의 sec에는 티어 키를, seat에는 주문 안 순번(1부터)을 넣는다.
 * 체크인 도장이 cid·sec·seat로 찍히므로 같은 주문의 표끼리도 겹치지 않는다.
 * seat_section·seat_number 속성은 달지 않아 이메일에 좌석 칸이 나오지 않는다.
 */
export async function createSeatlessCheckoutCart(
  tier: SeatlessTierKey,
  quantity: number,
  phase: PricingPhase,
  locale?: string,
  utm: UtmParams = {},
): Promise<{ cartId: string; checkoutUrl: string; checkoutId: string }> {
  const variantId = getTicketVariantId(tier);
  // 좌석 티켓은 구역·좌석 번호가 표를 갈라 주지만, 여기선 cid가 주문을 가르는 유일한 값이다.
  // 판매 기록 필드와 체크인 키가 겹치지 않도록 좌석 티켓(8자)보다 길게 잡는다.
  const checkoutId = crypto.randomBytes(6).toString("hex");
  const lines: CartLine[] = Array.from({ length: quantity }, (_, i) => ({
    merchandiseId: variantId,
    quantity: 1,
    attributes: [
      {
        key: "_qr_token",
        value: signPayload({
          cid: checkoutId,
          sec: tier,
          seat: i + 1,
          tier,
          ap: false,
        }),
      },
    ],
  }));

  const cart = await createCart(lines, phase, locale, utm);
  return { ...cart, checkoutId };
}

async function createCart(
  lines: CartLine[],
  phase: PricingPhase,
  locale: string | undefined,
  utm: UtmParams,
): Promise<{ cartId: string; checkoutUrl: string }> {
  // 3. Create cart with lang attribute for bilingual email notifications
  //    광고 UTM도 함께 실어 주문 상세에서 어느 캠페인으로 들어온 구매인지 보이게 한다
  const cartAttributes = [
    { key: "lang", value: locale ?? "ko" },
    ...Object.entries(utm).map(([key, value]) => ({ key, value })),
  ];

  const data = await storefrontFetch<{
    cartCreate: {
      cart: { id: string; checkoutUrl: string } | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>(CART_CREATE_MUTATION, { input: { lines, attributes: cartAttributes } });

  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(
      `Cart creation failed: ${JSON.stringify(data.cartCreate.userErrors)}`,
    );
  }

  const cart = data.cartCreate.cart!;

  // 4. Apply discount code based on current pricing phase
  const discountCode = DISCOUNT_CODES[phase];
  if (discountCode) {
    await storefrontFetch<{
      cartDiscountCodesUpdate: {
        cart: { id: string } | null;
        userErrors: { field: string[]; message: string }[];
      };
    }>(CART_DISCOUNT_UPDATE_MUTATION, {
      cartId: cart.id,
      discountCodes: [discountCode],
    });
  }

  return {
    cartId: cart.id,
    checkoutUrl: cart.checkoutUrl,
  };
}
