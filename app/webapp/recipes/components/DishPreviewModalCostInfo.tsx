'use client';

import { DishCostData } from '../types';

interface DishPreviewModalCostInfoProps {
  costData: DishCostData;
}

export function DishPreviewModalCostInfo({ costData }: DishPreviewModalCostInfoProps) {
  // Calculate profit metrics based on recommended price (GST-exclusive)
  const gstRate = 0.1; // 10% GST for Australia
  const recommendedPriceExclGST = costData.recommendedPrice / (1 + gstRate);
  const recommendedGrossProfit = recommendedPriceExclGST - costData.total_cost;
  const recommendedGrossProfitMargin =
    recommendedPriceExclGST > 0 ? (recommendedGrossProfit / recommendedPriceExclGST) * 100 : 0;
  const recommendedContributingMargin = recommendedPriceExclGST - costData.total_cost;
  const recommendedContributingMarginPercent =
    recommendedPriceExclGST > 0
      ? (recommendedContributingMargin / recommendedPriceExclGST) * 100
      : 0;

  return (
    <div className="mb-6 rounded-xl bg-[var(--muted)]/30 p-4">
      <h3 className="mb-4 text-lg font-semibold text-[var(--foreground)]">Cost Information</h3>
      <div className="desktop:grid-cols-3 grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-[var(--foreground-muted)]">Recommended Price</div>
          <div className="text-lg font-semibold text-[var(--foreground)]">
            ${costData.recommendedPrice.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-xs text-[var(--foreground-muted)]">Total Cost</div>
          <div className="text-lg font-semibold text-[var(--foreground)]">${costData.total_cost.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-xs text-[var(--foreground-muted)]">Gross Profit</div>
          <div className="text-lg font-semibold text-[var(--color-success)]">
            ${recommendedGrossProfit.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-xs text-[var(--foreground-muted)]">Profit Margin</div>
          <div
            className={`text-lg font-semibold ${
              recommendedGrossProfitMargin >= 30 ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]'
            }`}
          >
            {recommendedGrossProfitMargin.toFixed(1)}%
          </div>
        </div>
        <div className="desktop:col-span-1 col-span-2">
          <div className="text-xs text-[var(--foreground-muted)]">Contributing Margin</div>
          <div className="flex items-baseline gap-2">
            <div className="text-lg font-semibold text-[var(--accent)]">
              ${recommendedContributingMargin.toFixed(2)}
            </div>
            <div className="text-sm text-[var(--foreground-muted)]">
              ({recommendedContributingMarginPercent.toFixed(1)}%)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
