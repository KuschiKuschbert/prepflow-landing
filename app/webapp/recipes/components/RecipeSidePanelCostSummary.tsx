'use client';

import { Icon } from '@/components/ui/Icon';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { Calculator } from 'lucide-react';
import { COGSCalculation } from '../../cogs/types';
import { RecipePriceData } from '../types';

interface RecipeSidePanelCostSummaryProps {
  calculations: COGSCalculation[];
  totalCOGS: number;
  costPerPortion: number;
  recipePrice: RecipePriceData | null;
}

export function RecipeSidePanelCostSummary({
  calculations,
  totalCOGS,
  costPerPortion,
  recipePrice,
}: RecipeSidePanelCostSummaryProps) {
  if (calculations.length === 0) return null;

  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon icon={Calculator} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
        <h3 className="text-sm font-semibold text-white">Cost Information</h3>
      </div>
      {recipePrice ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-400">Recommended Price</div>
            <div className="text-lg font-semibold text-white">
              ${recipePrice.recommendedPrice.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Total Cost</div>
            <div className="text-lg font-semibold text-white">${costPerPortion.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Gross Profit</div>
            <div className="text-lg font-semibold text-green-400">
              ${recipePrice.gross_profit.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Profit Margin</div>
            <div
              className={`text-lg font-semibold ${
                recipePrice.gross_profit_margin >= 30 ? 'text-green-400' : 'text-yellow-400'
              }`}
            >
              {recipePrice.gross_profit_margin.toFixed(1)}%
            </div>
          </div>
          <div className="col-span-2">
            <div className="text-xs text-gray-400">Contributing Margin</div>
            <div className="flex items-baseline gap-2">
              <div className="text-lg font-semibold text-[#D925C7]">
                ${recipePrice.contributingMargin.toFixed(2)}
              </div>
              <div className="text-sm text-gray-400">
                ({recipePrice.contributingMarginPercent.toFixed(1)}%)
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-400">Total Cost</div>
            <div className="text-lg font-semibold text-white">${totalCOGS.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Cost per Portion</div>
            <div className="text-lg font-semibold text-[#29E7CD]">${costPerPortion.toFixed(2)}</div>
          </div>
          <div className="col-span-2">
            <LoadingSkeleton variant="text" width="w-full" height="h-4" />
          </div>
        </div>
      )}
    </div>
  );
}
