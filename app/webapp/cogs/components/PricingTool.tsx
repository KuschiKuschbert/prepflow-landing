'use client';

import React from 'react';
import { PricingCalculation, PricingStrategy } from '../types';

interface PricingToolProps {
  costPerPortion: number;
  targetGrossProfit: number;
  pricingStrategy: 'charm' | 'whole' | 'real';
  pricingCalculation: PricingCalculation | null;
  onTargetGrossProfitChange: (gp: number) => void;
  onPricingStrategyChange: (strategy: 'charm' | 'whole' | 'real') => void;
}

export const PricingTool: React.FC<PricingToolProps> = ({
  costPerPortion,
  targetGrossProfit,
  pricingStrategy,
  pricingCalculation,
  onTargetGrossProfitChange,
  onPricingStrategyChange,
}) => {
  if (costPerPortion <= 0 || !pricingCalculation) {
    return null;
  }

  return (
    <div className="mt-6 border-t border-[#2a2a2a] pt-4">
      <div className="mb-4">
        <h3 className="mb-3 flex items-center text-lg font-semibold text-white">
          💰 Costing Tool
          <div className="ml-2 h-2 w-2 animate-pulse rounded-full bg-[#29E7CD]"></div>
        </h3>

        {/* Target Gross Profit Selector */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-300">
            🎯 Target Gross Profit %
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

        {/* Pricing Strategy Selector */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-300">
            📊 Pricing Strategy
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onPricingStrategyChange('charm')}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                pricingStrategy === 'charm'
                  ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white shadow-lg'
                  : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a]/80'
              }`}
            >
              Charm ($19.95)
            </button>
            <button
              onClick={() => onPricingStrategyChange('whole')}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                pricingStrategy === 'whole'
                  ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white shadow-lg'
                  : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a]/80'
              }`}
            >
              Whole ($20)
            </button>
            <button
              onClick={() => onPricingStrategyChange('real')}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                pricingStrategy === 'real'
                  ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white shadow-lg'
                  : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a]/80'
              }`}
            >
              Real ($19.47)
            </button>
          </div>
        </div>

        {/* Pricing Results */}
        <div className="rounded-2xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Food Cost */}
            <div className="rounded-xl border border-[#2a2a2a]/50 bg-[#2a2a2a]/30 p-3">
              <div className="mb-1 text-xs tracking-wide text-gray-500 uppercase">Food Cost</div>
              <div className="text-xl font-bold text-white">${costPerPortion.toFixed(2)}</div>
              <div className="text-xs text-gray-400">per portion</div>
            </div>

            {/* Sell Price Excl GST */}
            <div className="rounded-xl border border-[#2a2a2a]/50 bg-[#2a2a2a]/30 p-3">
              <div className="mb-1 text-xs tracking-wide text-gray-500 uppercase">
                Sell Price (Excl GST)
              </div>
              <div className="text-xl font-bold text-[#29E7CD]">
                ${pricingCalculation.sellPriceExclGST.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400">for your records</div>
            </div>

            {/* Sell Price Incl GST */}
            <div className="rounded-xl border border-[#2a2a2a]/50 bg-[#2a2a2a]/30 p-3">
              <div className="mb-1 text-xs tracking-wide text-gray-500 uppercase">
                Menu Price (Incl GST)
              </div>
              <div className="text-xl font-bold text-[#D925C7]">
                ${pricingCalculation.sellPriceInclGST.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400">what customer pays</div>
            </div>

            {/* Gross Profit */}
            <div className="rounded-xl border border-[#2a2a2a]/50 bg-[#2a2a2a]/30 p-3">
              <div className="mb-1 text-xs tracking-wide text-gray-500 uppercase">Gross Profit</div>
              <div className="text-xl font-bold text-green-400">
                ${pricingCalculation.grossProfitDollar.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400">
                {pricingCalculation.actualGrossProfit.toFixed(1)}% margin
              </div>
            </div>
          </div>

          {/* Contributing Margin Section */}
          <div className="mt-4 border-t border-[#2a2a2a]/50 pt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Contributing Margin */}
              <div className="rounded-xl border border-[#D925C7]/30 bg-gradient-to-br from-[#D925C7]/20 to-[#29E7CD]/20 p-3">
                <div className="mb-1 text-xs tracking-wide text-gray-500 uppercase">
                  Contributing Margin
                </div>
                <div className="text-xl font-bold text-[#D925C7]">
                  ${pricingCalculation.contributingMargin.toFixed(2)}
                </div>
                <div className="text-xs text-gray-400">
                  {pricingCalculation.contributingMarginPercent.toFixed(1)}% of revenue
                </div>
              </div>

              {/* Contributing Margin Explanation */}
              <div className="rounded-xl border border-[#2a2a2a]/50 bg-[#2a2a2a]/30 p-3">
                <div className="mb-1 text-xs tracking-wide text-gray-500 uppercase">Formula</div>
                <div className="text-sm text-gray-400">
                  <strong className="text-[#D925C7]">Revenue - Food Cost</strong>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Amount available to cover fixed costs and generate profit
                </div>
              </div>
            </div>
          </div>

          {/* GST Breakdown */}
          <div className="mt-4 border-t border-[#2a2a2a]/50 pt-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">GST Amount (10%):</span>
              <span className="font-medium text-white">
                ${pricingCalculation.gstAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
