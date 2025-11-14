'use client';

import { useEffect, useState } from 'react';
import { PerformanceMetadata as PerformanceMetadataType } from '../types';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface PerformanceMetadataProps {
  metadata: PerformanceMetadataType | null;
}

export default function PerformanceMetadata({ metadata }: PerformanceMetadataProps) {
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by only rendering after mount
  if (!mounted || !metadata) return null;

      return (
        <div className="mb-3 rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] overflow-hidden tablet:mb-4 tablet:p-4 desktop:mb-6 desktop:p-6">
          {/* Always visible summary */}
          <div className="p-3 tablet:p-4 desktop:p-6">
            <div className="mb-2 flex items-center justify-between tablet:mb-3">
              <div className="flex items-center gap-2">
                <Icon icon={Info} size="sm" className="text-[#29E7CD]" />
                <h3 className="text-base font-semibold text-white">Methodology</h3>
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1.5 rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] px-2.5 py-1 text-xs text-gray-300 transition-colors hover:border-[#29E7CD]/50 hover:text-[#29E7CD]"
              >
                <span>{isExpanded ? 'Hide' : 'Show'} Details</span>
                <Icon icon={isExpanded ? ChevronUp : ChevronDown} size="xs" />
              </button>
            </div>

            {/* Key metrics - always visible */}
            <div className="grid grid-cols-2 gap-3 tablet:grid-cols-4">
          <div className="text-center">
            <div className="mb-1 text-xs text-gray-400">Methodology</div>
            <div className="text-base font-semibold text-[#29E7CD]">{metadata.methodology}</div>
          </div>
          <div className="text-center">
            <div className="mb-1 text-xs text-gray-400">Avg Profit Margin</div>
            <div className="text-base font-semibold text-white">
              {metadata.averageProfitMargin?.toFixed(1)}%
            </div>
          </div>
          <div className="text-center">
            <div className="mb-1 text-xs text-gray-400">Avg Popularity</div>
            <div className="text-base font-semibold text-white">
              {metadata.averagePopularity?.toFixed(1)}%
            </div>
          </div>
          <div className="text-center">
            <div className="mb-1 text-xs text-gray-400">Popularity Threshold</div>
            <div className="text-base font-semibold text-[#D925C7]">
              {metadata.popularityThreshold?.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

          {/* Expandable details */}
          {isExpanded && (
            <div className="border-t border-[#2a2a2a] bg-[#2a2a2a]/30 p-3 tablet:p-4 desktop:p-6">
              <div className="space-y-1.5 text-xs text-gray-300">
            <p>
              <strong className="text-white">Profit Check:</strong> HIGH if above menu average (
              {metadata.averageProfitMargin?.toFixed(1)}%), LOW if below
            </p>
            <p>
              <strong className="text-white">Popularity Check:</strong> HIGH if ≥ 80% of average popularity (
              {metadata.popularityThreshold?.toFixed(1)}%), LOW if below
            </p>
            <p className="mt-4 text-xs text-gray-400">
              The PrepFlow COGS Dynamic methodology automatically adapts thresholds based on your menu&apos;s actual
              performance, ensuring accurate categorization that reflects your business reality.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
