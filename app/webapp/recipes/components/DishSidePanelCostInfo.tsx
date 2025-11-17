'use client';

import { Icon } from '@/components/ui/Icon';
import { Calculator } from 'lucide-react';
import { DishCostData } from '../types';

interface DishSidePanelCostInfoProps {
  costData: DishCostData;
}

export function DishSidePanelCostInfo({ costData }: DishSidePanelCostInfoProps) {
  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon icon={Calculator} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
        <h3 className="text-sm font-semibold text-white">Cost Information</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
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
