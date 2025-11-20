'use client';

import { Icon } from '@/components/ui/Icon';
import { Package, DollarSign, Calculator, TrendingUp } from 'lucide-react';
import { PricingCalculation } from '../../cogs/types';

interface DishSummaryCardProps {
  ingredientCount: number;
  totalCOGS: number;
  costPerPortion: number;
  pricingCalculation: PricingCalculation | null;
}

export default function DishSummaryCard({
  ingredientCount,
  totalCOGS,
  costPerPortion,
  pricingCalculation,
}: DishSummaryCardProps) {
  return (
    <div className="rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 via-[#D925C7]/10 to-[#29E7CD]/10 p-6 shadow-lg">
      <div className="tablet:grid-cols-4 grid grid-cols-2 gap-4">
        {/* Ingredient Count */}
        <div className="rounded-xl border border-[#2a2a2a]/50 bg-[#1f1f1f]/50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Icon icon={Package} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
            <span className="text-xs font-medium tracking-wide text-gray-400 uppercase">
              Ingredients
            </span>
          </div>
          <div className="text-2xl font-bold text-white">{ingredientCount}</div>
          <div className="text-xs text-gray-400">items added</div>
        </div>

        {/* Total COGS */}
        <div className="rounded-xl border border-[#2a2a2a]/50 bg-[#1f1f1f]/50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Icon icon={Calculator} size="sm" className="text-[#3B82F6]" aria-hidden={true} />
            <span className="text-xs font-medium tracking-wide text-gray-400 uppercase">
              Total COGS
            </span>
          </div>
          <div className="text-2xl font-bold text-white">${totalCOGS.toFixed(2)}</div>
          <div className="text-xs text-gray-400">total cost</div>
        </div>

        {/* Cost Per Portion */}
        <div className="rounded-xl border border-[#2a2a2a]/50 bg-[#1f1f1f]/50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Icon icon={DollarSign} size="sm" className="text-[#D925C7]" aria-hidden={true} />
            <span className="text-xs font-medium tracking-wide text-gray-400 uppercase">
              Per Portion
            </span>
          </div>
          <div className="text-2xl font-bold text-white">${costPerPortion.toFixed(2)}</div>
          <div className="text-xs text-gray-400">cost per serving</div>
        </div>

        {/* Recommended Price */}
        <div className="rounded-xl border border-[#29E7CD]/50 bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Icon icon={TrendingUp} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
            <span className="text-xs font-medium tracking-wide text-[#29E7CD] uppercase">
              Recommended
            </span>
          </div>
          {pricingCalculation ? (
            <>
              <div className="text-2xl font-bold text-white">
                ${pricingCalculation.sellPriceInclGST.toFixed(2)}
              </div>
              <div className="text-xs text-gray-300">
                {pricingCalculation.actualGrossProfit.toFixed(1)}% GP
              </div>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold text-gray-400">$0.00</div>
              <div className="text-xs text-gray-500">add ingredients</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
