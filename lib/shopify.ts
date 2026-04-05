import crypto from "crypto";
import { TICKET_VARIANT_IDS, AFTER_PARTY_VARIANT_ID, DISCOUNT_CODES } from "./shopify-config";
import { signPayload } from "./qr";
import type { TierKey, PricingPhase } from "@/app/[locale]/(2026)/_types/tickets";
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

export async function createCheckoutCart(
  seats: SeatHoldRequest[],
  tier: TierKey,
  phase: PricingPhase,
  locale?: string,
): Promise<{ cartId: string; checkoutUrl: string }> {
  // 1. Ticket line items (one per seat) with QR token for check-in
  const checkoutId = crypto.randomUUID().slice(0, 8);
  const ticketLines = seats.map((seat) => ({
    merchandiseId: TICKET_VARIANT_IDS[tier],
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
  const apLines = seats
    .filter((seat) => seat.afterParty && tier !== "vip")
    .map((seat) => ({
      merchandiseId: AFTER_PARTY_VARIANT_ID,
      quantity: 1,
      attributes: [
        { key: "seat_section", value: seat.section },
        { key: "seat_number", value: seat.seat.toString() },
      ],
    }));

  const lines = [...ticketLines, ...apLines];

  // 3. Create cart with lang attribute for bilingual email notifications
  const cartAttributes = [
    { key: "lang", value: locale ?? "ko" },
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
