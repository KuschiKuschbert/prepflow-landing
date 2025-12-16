'use client';

import { Icon } from '@/components/ui/Icon';
import { Calculator } from 'lucide-react';
import { DishCostData } from '../types';

interface DishSidePanelCostInfoProps {
  costData: DishCostData;
}

export function DishSidePanelCostInfo({ costData }: DishSidePanelCostInfoProps) {
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
    <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon icon={Calculator} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
        <h3 className="text-sm font-semibold text-[var(--foreground)]">Cost Information</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
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
        <div className="col-span-2">
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
