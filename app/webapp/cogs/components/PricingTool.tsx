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
    <div className="mt-6 pt-4 border-t border-[#2a2a2a]">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          💰 Costing Tool
          <div className="ml-2 w-2 h-2 bg-[#29E7CD] rounded-full animate-pulse"></div>
        </h3>
        
        {/* Target Gross Profit Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            🎯 Target Gross Profit %
          </label>
          <div className="flex space-x-2">
            {[60, 65, 70, 75, 80].map((gp) => (
              <button
                key={gp}
                onClick={() => onTargetGrossProfitChange(gp)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
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
          <label className="block text-sm font-medium text-gray-300 mb-2">
            📊 Pricing Strategy
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onPricingStrategyChange('charm')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pricingStrategy === 'charm'
                  ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white shadow-lg'
                  : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a]/80'
              }`}
            >
              Charm ($19.95)
            </button>
            <button
              onClick={() => onPricingStrategyChange('whole')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pricingStrategy === 'whole'
                  ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white shadow-lg'
                  : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a]/80'
              }`}
            >
              Whole ($20)
            </button>
            <button
              onClick={() => onPricingStrategyChange('real')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
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
        <div className="bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 border border-[#29E7CD]/30 p-4 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Food Cost */}
            <div className="bg-[#2a2a2a]/30 p-3 rounded-xl border border-[#2a2a2a]/50">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Food Cost</div>
              <div className="text-xl font-bold text-white">
                ${costPerPortion.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400">per portion</div>
            </div>

            {/* Sell Price Excl GST */}
            <div className="bg-[#2a2a2a]/30 p-3 rounded-xl border border-[#2a2a2a]/50">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Sell Price (Excl GST)</div>
              <div className="text-xl font-bold text-[#29E7CD]">
                ${pricingCalculation.sellPriceExclGST.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400">for your records</div>
            </div>

            {/* Sell Price Incl GST */}
            <div className="bg-[#2a2a2a]/30 p-3 rounded-xl border border-[#2a2a2a]/50">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Menu Price (Incl GST)</div>
              <div className="text-xl font-bold text-[#D925C7]">
                ${pricingCalculation.sellPriceInclGST.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400">what customer pays</div>
            </div>

            {/* Gross Profit */}
            <div className="bg-[#2a2a2a]/30 p-3 rounded-xl border border-[#2a2a2a]/50">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Gross Profit</div>
              <div className="text-xl font-bold text-green-400">
                ${pricingCalculation.grossProfitDollar.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400">
                {pricingCalculation.actualGrossProfit.toFixed(1)}% margin
              </div>
            </div>
          </div>

          {/* Contributing Margin Section */}
          <div className="mt-4 pt-4 border-t border-[#2a2a2a]/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contributing Margin */}
              <div className="bg-gradient-to-br from-[#D925C7]/20 to-[#29E7CD]/20 p-3 rounded-xl border border-[#D925C7]/30">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Contributing Margin</div>
                <div className="text-xl font-bold text-[#D925C7]">
                  ${pricingCalculation.contributingMargin.toFixed(2)}
                </div>
                <div className="text-xs text-gray-400">
                  {pricingCalculation.contributingMarginPercent.toFixed(1)}% of revenue
                </div>
              </div>

              {/* Contributing Margin Explanation */}
              <div className="bg-[#2a2a2a]/30 p-3 rounded-xl border border-[#2a2a2a]/50">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Formula</div>
                <div className="text-sm text-gray-400">
                  <strong className="text-[#D925C7]">Revenue - Food Cost</strong>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Amount available to cover fixed costs and generate profit
                </div>
              </div>
            </div>
          </div>

          {/* GST Breakdown */}
          <div className="mt-4 pt-3 border-t border-[#2a2a2a]/50">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">GST Amount (10%):</span>
              <span className="text-white font-medium">
                ${pricingCalculation.gstAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
