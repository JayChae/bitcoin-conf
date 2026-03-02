import { VARIANT_IDS } from "./shopify-config";
import type { TierKey } from "@/app/[locale]/(2026)/_types/tickets";
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
): Promise<{ cartId: string; checkoutUrl: string }> {
  const lines = seats.map((seat) => ({
    merchandiseId: VARIANT_IDS[tier][seat.afterParty ? "withAP" : "withoutAP"],
    quantity: 1,
    attributes: [
      { key: "seat_section", value: seat.section },
      { key: "seat_number", value: seat.seat.toString() },
      { key: "after_party", value: seat.afterParty.toString() },
    ],
  }));

  const data = await storefrontFetch<{
    cartCreate: {
      cart: { id: string; checkoutUrl: string } | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>(CART_CREATE_MUTATION, { input: { lines } });

  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(
      `Cart creation failed: ${JSON.stringify(data.cartCreate.userErrors)}`,
    );
  }

  const cart = data.cartCreate.cart!;
  return {
    cartId: cart.id,
    checkoutUrl: cart.checkoutUrl,
  };
}
