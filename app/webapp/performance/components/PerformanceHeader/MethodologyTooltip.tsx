/**
 * Methodology tooltip component.
 */
'use client';

import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/components/ui/Icon';
import { Info } from 'lucide-react';
import type { PerformanceMetadata } from '../../types';

interface MethodologyTooltipProps {
  showMethodologyTooltip: boolean;
  methodologyTooltipPos: { top: number; left: number };
  metadata: PerformanceMetadata;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function MethodologyTooltip({ showMethodologyTooltip, methodologyTooltipPos, metadata, onMouseEnter, onMouseLeave }: MethodologyTooltipProps) {
  const methodologyTooltipRef = useRef<HTMLDivElement>(null);

  if (!showMethodologyTooltip || typeof window === 'undefined') return null;

  return createPortal(
    <div
      ref={methodologyTooltipRef}
      className="fixed z-[100] w-80 -translate-x-1/2 rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 text-xs text-gray-300 shadow-lg"
      style={{ top: `${methodologyTooltipPos.top - 320}px`, left: `${methodologyTooltipPos.left}px` }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="mb-3 flex items-center gap-2">
        <Icon icon={Info} size="sm" className="text-[#29E7CD]" />
        <h4 className="text-sm font-semibold text-white">Methodology</h4>
      </div>
      <div className="space-y-3">
        <div>
          <div className="mb-1 text-xs text-gray-400">Methodology</div>
          <div className="text-sm font-semibold text-[#29E7CD]">{metadata.methodology}</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="mb-1 text-xs text-gray-400">Avg Profit Margin</div>
            <div className="text-sm font-semibold text-white">{metadata.averageProfitMargin?.toFixed(1)}%</div>
          </div>
          <div>
            <div className="mb-1 text-xs text-gray-400">Avg Popularity</div>
            <div className="text-sm font-semibold text-white">{metadata.averagePopularity?.toFixed(1)}%</div>
          </div>
          <div className="col-span-2">
            <div className="mb-1 text-xs text-gray-400">Popularity Threshold</div>
            <div className="text-sm font-semibold text-[#D925C7]">{metadata.popularityThreshold?.toFixed(1)}%</div>
          </div>
        </div>
        <div className="border-t border-[#2a2a2a] pt-3">
          <div className="space-y-1.5 text-xs text-gray-300">
            <p><strong className="text-white">Profit Check:</strong> HIGH if above menu average ({metadata.averageProfitMargin?.toFixed(1)}%), LOW if below</p>
            <p><strong className="text-white">Popularity Check:</strong> HIGH if ≥ 80% of average popularity ({metadata.popularityThreshold?.toFixed(1)}%), LOW if below</p>
            <p className="mt-2 text-xs text-gray-400">The PrepFlow COGS Dynamic methodology automatically adapts thresholds based on your menu&apos;s actual performance, ensuring accurate categorization that reflects your business reality.</p>
          </div>
        </div>
      </div>
      <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-4 border-t-[#1f1f1f] border-r-transparent border-b-transparent border-l-transparent" />
    </div>,
    document.body,
  );
}
