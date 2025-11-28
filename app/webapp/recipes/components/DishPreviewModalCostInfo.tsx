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
    <div className="mb-6 rounded-xl bg-[#2a2a2a]/30 p-4">
      <h3 className="mb-4 text-lg font-semibold text-white">Cost Information</h3>
      <div className="desktop:grid-cols-3 grid grid-cols-2 gap-4">
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
        <div className="desktop:col-span-1 col-span-2">
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
