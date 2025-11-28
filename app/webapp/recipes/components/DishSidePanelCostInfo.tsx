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
    <div className="rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon icon={Calculator} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
        <h3 className="text-sm font-semibold text-white">Cost Information</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-gray-400">Recommended Price</div>
          <div className="text-lg font-semibold text-white">
            ${costData.recommendedPrice.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Total Cost</div>
          <div className="text-lg font-semibold text-white">${costData.total_cost.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Gross Profit</div>
          <div className="text-lg font-semibold text-green-400">
            ${recommendedGrossProfit.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Profit Margin</div>
          <div
            className={`text-lg font-semibold ${
              recommendedGrossProfitMargin >= 30 ? 'text-green-400' : 'text-yellow-400'
            }`}
          >
            {recommendedGrossProfitMargin.toFixed(1)}%
          </div>
        </div>
        <div className="col-span-2">
          <div className="text-xs text-gray-400">Contributing Margin</div>
          <div className="flex items-baseline gap-2">
            <div className="text-lg font-semibold text-[#D925C7]">
              ${recommendedContributingMargin.toFixed(2)}
            </div>
            <div className="text-sm text-gray-400">
              ({recommendedContributingMarginPercent.toFixed(1)}%)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
