"use client";

import { useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  SeatlessTierKey,
  PricingPhase,
} from "@/app/[locale]/(2026)/_types/tickets";
import {
  TICKETS,
  SEATLESS_MAX_PER_ORDER,
} from "@/app/[locale]/(2026)/_constants/tickets";
import { getDiscountedPrice } from "@/app/[locale]/(2026)/_utils/tickets";
import { trackTicketEvent } from "@/lib/analytics";
import { getStoredUtm } from "@/lib/utm";
import SelectionSummary, { type HoldState } from "./SelectionSummary";

const STEP_BUTTON = cn(
  "size-11 flex items-center justify-center rounded-xl",
  "bg-white/5 text-white border border-white/15",
  "transition-colors duration-150 hover:bg-white/15 active:scale-95",
  "disabled:opacity-30 disabled:hover:bg-white/5 disabled:active:scale-100",
);

/**
 * 좌석 없는 티어의 구매 흐름. 좌석 배치도 대신 매수만 고르고 바로 결제로 넘긴다.
 * 잡아둘 좌석이 없으므로 서버도 잠금 없이 카트만 만든다.
 */
export default function QuantityPurchaseFlow({
  tier,
  locale,
  phase,
}: {
  tier: SeatlessTierKey;
  locale: string;
  phase: PricingPhase;
}) {
  const t = useTranslations("Tickets2026");

  const [quantity, setQuantity] = useState(1);
  const [holdState, setHoldState] = useState<HoldState>("idle");
  const [holdError, setHoldError] = useState<string | null>(null);

  const ticket = TICKETS.find((tk) => tk.tier === tier)!;
  const unitPrice = getDiscountedPrice(ticket.basePrice, phase);
  const isLoading = holdState === "loading";

  // 좌석 흐름은 첫 좌석을 고를 때 기록하지만 여기엔 고르는 단계가 없어 구매 버튼에서 한 번 남긴다
  const cartTrackedRef = useRef(false);
  const isSubmittingRef = useRef(false);

  const handlePurchase = useCallback(async () => {
    if (isSubmittingRef.current) return;

    if (!cartTrackedRef.current) {
      cartTrackedRef.current = true;
      trackTicketEvent("add_to_cart", { tier, price: unitPrice, quantity });
    }

    isSubmittingRef.current = true;
    setHoldState("loading");
    setHoldError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30_000);

    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, quantity, locale, utm: getStoredUtm() }),
        signal: controller.signal,
      });

      if (!res.ok) {
        setHoldState("error");
        setHoldError(t("checkoutError"));
        return;
      }

      const { checkoutUrl } = await res.json();
      // 결제는 Shopify 도메인에서 이어져 GA가 따라가지 못한다 — 여기가 사이트에서 잡히는 마지막 단계.
      trackTicketEvent("begin_checkout", { tier, price: unitPrice, quantity });
      window.location.href = checkoutUrl;
    } catch {
      setHoldState("error");
      setHoldError(t("checkoutError"));
    } finally {
      clearTimeout(timeoutId);
      isSubmittingRef.current = false;
    }
  }, [tier, quantity, locale, unitPrice, t]);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl p-5 md:p-8 bg-black/40 backdrop-blur-xl border border-white/10">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-base font-medium text-white">{t("quantity")}</p>
            <p className="mt-1 text-sm text-white/50">{t("noSeatSelection")}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              aria-label={t("decreaseQuantity")}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1 || isLoading}
              className={STEP_BUTTON}
            >
              <Minus className="size-4" />
            </button>
            <span
              aria-live="polite"
              className="w-8 text-center text-xl font-bold text-white tabular-nums"
            >
              {quantity}
            </span>
            <button
              type="button"
              aria-label={t("increaseQuantity")}
              onClick={() =>
                setQuantity((q) => Math.min(SEATLESS_MAX_PER_ORDER, q + 1))
              }
              disabled={quantity >= SEATLESS_MAX_PER_ORDER || isLoading}
              className={STEP_BUTTON}
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <SelectionSummary
        tier={tier}
        count={quantity}
        afterPartyCount={0}
        locale={locale}
        onPurchase={handlePurchase}
        holdState={holdState}
        holdError={holdError}
        phase={phase}
      />
    </div>
  );
}
