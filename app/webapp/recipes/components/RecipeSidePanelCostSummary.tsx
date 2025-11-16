'use client';

import { Icon } from '@/components/ui/Icon';
import { Calculator } from 'lucide-react';
import { COGSCalculation } from '../../cogs/types';

interface RecipeSidePanelCostSummaryProps {
  calculations: COGSCalculation[];
  totalCOGS: number;
  costPerPortion: number;
}

export function RecipeSidePanelCostSummary({
  calculations,
  totalCOGS,
  costPerPortion,
}: RecipeSidePanelCostSummaryProps) {
  if (calculations.length === 0) return null;

  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon icon={Calculator} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
        <h3 className="text-sm font-semibold text-white">Cost Summary</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-gray-400">Total Cost</div>
          <div className="text-lg font-semibold text-white">${totalCOGS.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Cost per Portion</div>
          <div className="text-lg font-semibold text-[#29E7CD]">${costPerPortion.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
