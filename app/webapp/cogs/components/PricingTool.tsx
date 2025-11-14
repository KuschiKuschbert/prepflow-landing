'use client';

import React from 'react';
import { PricingCalculation } from '../types';
import { HelpTooltip } from '@/components/ui/HelpTooltip';
import { getHelpText } from '@/lib/terminology-help';
import { DollarSign, Target, BarChart3 } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface PricingToolProps {
  costPerPortion: number;
  targetGrossProfit: number;
  pricingStrategy: 'charm' | 'whole' | 'real';
  pricingCalculation: PricingCalculation | null;
  allStrategyPrices: {
    charm: PricingCalculation;
    whole: PricingCalculation;
    real: PricingCalculation;
  } | null;
  onTargetGrossProfitChange: (gp: number) => void;
  onPricingStrategyChange: (strategy: 'charm' | 'whole' | 'real') => void;
}

export const PricingTool: React.FC<PricingToolProps> = ({
  costPerPortion,
  targetGrossProfit,
  pricingStrategy,
  pricingCalculation,
  allStrategyPrices,
  onTargetGrossProfitChange,
  onPricingStrategyChange,
}) => {
  if (costPerPortion <= 0 || !pricingCalculation || !allStrategyPrices) {
    return null;
  }

  const getStrategyLabel = (strategy: 'charm' | 'whole' | 'real') => {
    switch (strategy) {
      case 'charm':
        return 'Charm';
      case 'whole':
        return 'Whole';
      case 'real':
        return 'Real';
    }
  };

  const getStrategyPrice = (strategy: 'charm' | 'whole' | 'real') => {
    return allStrategyPrices[strategy].sellPriceInclGST;
  };

  return (
    <div className="mt-6 border-t border-[#2a2a2a] pt-4">
      <div className="mb-4">
        {/* Header with Title and Target Gross Profit */}
        <div className="mb-4 flex flex-col gap-3 tablet:flex-row tablet:items-center tablet:justify-between">
          <h3 className="flex items-center text-lg font-semibold text-white">
            <Icon icon={DollarSign} size="md" className="mr-2 text-[#29E7CD]" aria-hidden={true} />
            Costing Tool
            <div className="ml-2 h-2 w-2 animate-pulse rounded-full bg-[#29E7CD]"></div>
          </h3>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1 text-sm font-medium text-gray-300">
              <Icon icon={Target} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
              Target Gross Profit %
            </label>
            <div className="flex space-x-2">
              {[60, 65, 70, 75, 80].map(gp => (
                <button
                  key={gp}
                  onClick={() => onTargetGrossProfitChange(gp)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    targetGrossProfit === gp
                      ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white shadow-lg'
                      : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a]/80'
                  }`}
                >
                  {gp}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Strategy Selector with Dynamic Prices */}
        <div className="mb-4">
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
            <Icon icon={BarChart3} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
            Pricing Strategy
            <HelpTooltip
              content="Charm: Prices ending in .95 or .99 - psychologically appealing. Whole: Round to nearest dollar - clean pricing. Real: Exact calculated price - may have cents."
              title="Pricing Strategies"
            />
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onPricingStrategyChange('charm')}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                pricingStrategy === 'charm'
                  ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white shadow-lg'
                  : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a]/80'
              }`}
            >
              <div className="font-semibold">Charm</div>
              <div className="text-xs opacity-90">${getStrategyPrice('charm').toFixed(2)}</div>
            </button>
            <button
              onClick={() => onPricingStrategyChange('whole')}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                pricingStrategy === 'whole'
                  ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white shadow-lg'
                  : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a]/80'
              }`}
            >
              <div className="font-semibold">Whole</div>
              <div className="text-xs opacity-90">${getStrategyPrice('whole').toFixed(2)}</div>
            </button>
            <button
              onClick={() => onPricingStrategyChange('real')}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                pricingStrategy === 'real'
                  ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white shadow-lg'
                  : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a]/80'
              }`}
            >
              <div className="font-semibold">Real</div>
              <div className="text-xs opacity-90">${getStrategyPrice('real').toFixed(2)}</div>
            </button>
          </div>
        </div>

        {/* Hero Selling Price Card */}
        <div className="mb-4 rounded-2xl border-2 border-[#29E7CD]/50 bg-gradient-to-br from-[#29E7CD]/20 via-[#D925C7]/20 to-[#29E7CD]/20 p-6 shadow-lg">
          <div className="mb-2 text-xs font-medium tracking-wide text-gray-400 uppercase">
            Recommended Selling Price
          </div>
          <div className="mb-1 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">
              ${pricingCalculation.sellPriceInclGST.toFixed(2)}
            </span>
            <span className="text-sm font-medium text-gray-400">incl. GST</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-full bg-[#29E7CD]/20 px-2 py-1 text-xs font-medium text-[#29E7CD]">
              {getStrategyLabel(pricingStrategy)} Pricing
            </span>
            <span className="text-xs text-gray-400">
              {pricingCalculation.actualGrossProfit.toFixed(1)}% GP
            </span>
          </div>
        </div>

        {/* Compact Metrics Grid */}
        <div className="rounded-xl border border-[#2a2a2a]/50 bg-[#1f1f1f]/50 p-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Food Cost */}
            <div className="rounded-lg border border-[#2a2a2a]/50 bg-[#2a2a2a]/30 p-2.5">
              <div className="mb-1 text-xs tracking-wide text-gray-500 uppercase">Food Cost</div>
              <div className="text-lg font-bold text-white">${costPerPortion.toFixed(2)}</div>
              <div className="text-xs text-gray-400">per portion</div>
            </div>

            {/* Gross Profit */}
            <div className="rounded-lg border border-[#2a2a2a]/50 bg-[#2a2a2a]/30 p-2.5">
              <div className="mb-1 text-xs tracking-wide text-gray-500 uppercase">Gross Profit</div>
              <div className="text-lg font-bold text-green-400">
                ${pricingCalculation.grossProfitDollar.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400">
                {pricingCalculation.actualGrossProfit.toFixed(1)}% margin
              </div>
            </div>
          </div>

          {/* Secondary Info - Less Prominent */}
          <div className="mt-3 border-t border-[#2a2a2a]/30 pt-3">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Contributing Margin:</span>
              <span className="font-medium text-gray-300">
                ${pricingCalculation.contributingMargin.toFixed(2)} (
                {pricingCalculation.contributingMarginPercent.toFixed(1)}%)
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-gray-400">
              <span>GST (10%):</span>
              <span className="font-medium text-gray-300">
                ${pricingCalculation.gstAmount.toFixed(2)}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-gray-400">
              <span>Sell Price (Excl GST):</span>
              <span className="font-medium text-gray-300">
                ${pricingCalculation.sellPriceExclGST.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
