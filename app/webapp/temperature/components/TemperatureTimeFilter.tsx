'use client';

import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useTranslation } from '@/lib/useTranslation';

interface TemperatureTimeFilterProps {
  timeFilter: '24h' | '7d' | '30d' | 'all';
  isLoaded: boolean;
  onTimeFilterChange: (filter: '24h' | '7d' | '30d' | 'all') => void;
}

export function TemperatureTimeFilter({
  timeFilter,
  isLoaded,
  onTimeFilterChange,
}: TemperatureTimeFilterProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2 rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-2 shadow-lg">
      {isLoaded ? (
        ['24h', '7d', '30d', 'all'].map(filter => {
          const isActive = timeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => {
                onTimeFilterChange(filter as '24h' | '7d' | '30d' | 'all');
              }}
              className={`group text-fluid-sm relative min-h-[44px] rounded-2xl px-5 py-2.5 font-semibold transition-all duration-300 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none ${
                isActive
                  ? 'scale-[1.02] bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black shadow-xl'
                  : 'bg-transparent text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
              }`}
            >
              {t(
                `timeFilter.${filter}`,
                filter === '24h'
                  ? 'Last 24h'
                  : filter === '7d'
                    ? 'Last 7 Days'
                    : filter === '30d'
                      ? 'Last 30 Days'
                      : 'All Time',
              )}
              {isActive && (
                <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#29E7CD]/20 to-[#D925C7]/20 blur-xl" />
              )}
            </button>
          );
        })
      ) : (
        <LoadingSkeleton variant="button" count={4} />
      )}
    </div>
  );
}

