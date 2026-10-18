"use client";

import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { trackTicketEvent } from "@/lib/analytics";
import type { TierKey } from "../../_types/tickets";

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
  tier: TierKey;
  unitPrice: number;
};

/** 티켓 카드의 구매 버튼. 서버 컴포넌트인 TicketCard에서 클릭 기록만 떼어낸 조각. */
export default function TicketCtaLink({
  href,
  className,
  children,
  tier,
  unitPrice,
}: Props) {
  return (
    <Link
      href={href}
      onClick={() => trackTicketEvent("select_item", { tier, price: unitPrice })}
      className={className}
    >
      {children}
    </Link>
  );
}
