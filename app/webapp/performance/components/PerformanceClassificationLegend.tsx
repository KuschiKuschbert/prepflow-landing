'use client';

import { HelpTooltip } from '@/components/ui/HelpTooltip';

export function PerformanceClassificationLegend() {
  return (
    <div className="border-b border-[#2a2a2a] bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20 p-3 tablet:p-4 desktop:p-6">
      <div className="mb-1.5 flex items-center gap-2 tablet:mb-2">
        <h3 className="text-xs font-semibold text-white tablet:text-sm">Menu Item Classifications</h3>
        <HelpTooltip
          content="Dishes are categorized based on profit and popularity. Chef's Kiss: High profit AND high sales - your stars. Hidden Gem: High profit but low sales - market these better. Bargain Bucket: Popular but low profit - consider raising price. Burnt Toast: Low profit AND low sales - consider removing."
          title="Understanding Classifications"
        />
      </div>
      <div className="flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 rounded-full border border-green-500/30 bg-green-500/20"></span>
          <span className="text-gray-300">Chef&apos;s Kiss: High profit & high popularity</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 rounded-full border border-blue-500/30 bg-blue-500/20"></span>
          <span className="text-gray-300">Hidden Gem: High profit, low sales</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 rounded-full border border-yellow-500/30 bg-yellow-500/20"></span>
          <span className="text-gray-300">Bargain Bucket: Popular, low profit</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 rounded-full border border-red-500/30 bg-red-500/20"></span>
          <span className="text-gray-300">Burnt Toast: Low profit & low sales</span>
        </div>
      </div>
    </div>
  );
}
