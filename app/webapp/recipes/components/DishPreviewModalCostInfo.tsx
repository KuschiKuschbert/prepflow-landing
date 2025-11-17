'use client';

import { DishCostData } from '../types';

interface DishPreviewModalCostInfoProps {
  costData: DishCostData;
}

export function DishPreviewModalCostInfo({ costData }: DishPreviewModalCostInfoProps) {
  return (
    <div className="mb-6 rounded-xl bg-[#2a2a2a]/30 p-4">
      <h3 className="mb-4 text-lg font-semibold text-white">Cost Information</h3>
      <div className="desktop:grid-cols-4 grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-gray-400">Selling Price</div>
          <div className="text-lg font-semibold text-white">
            ${costData.selling_price.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Total Cost</div>
          <div className="text-lg font-semibold text-white">${costData.total_cost.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Gross Profit</div>
          <div className="text-lg font-semibold text-green-400">
            ${costData.gross_profit.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Profit Margin</div>
          <div
            className={`text-lg font-semibold ${
              costData.gross_profit_margin >= 30 ? 'text-green-400' : 'text-yellow-400'
            }`}
          >
            {costData.gross_profit_margin.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}
