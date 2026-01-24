"use client";

import { type Market } from "../../messages/markets";
import MarketCard from "./Card";
import ShowMoreButton, { useShowMore } from "../ShowMoreButton";

type Props = {
  markets: Market[];
  moreText: string;
  showMoreText: string;
  showCloseText: string;
};

export default function LightningMarket({
  markets,
  moreText,
  showMoreText,
  showCloseText,
}: Props) {
  const { isExpanded, displayedCount, shouldShowButton, toggle } = useShowMore(
    markets.length,
    4
  );

  // 4개까지만 표시
  const displayedMarkets = markets.slice(0, displayedCount);

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-8 w-full mb-3">
        {displayedMarkets.map((market) => (
          <MarketCard key={market.name} market={market} moreText={moreText} />
        ))}
      </div>

      {/* 더보기 버튼 */}
      {shouldShowButton && (
        <ShowMoreButton
          totalCount={markets.length}
          initialCount={4}
          moreText={showMoreText}
          closeText={showCloseText}
          isExpanded={isExpanded}
          onToggle={toggle}
        />
      )}
    </div>
  );
}
