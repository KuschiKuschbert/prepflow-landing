'use client';

import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useTranslation } from '@/lib/useTranslation';

type TimeFilterOption = '24h' | '7d' | '30d' | '90d' | '1y' | 'all';

interface TemperatureTimeFilterProps {
  timeFilter: TimeFilterOption;
  isLoaded: boolean;
  onTimeFilterChange: (filter: TimeFilterOption) => void;
  /** Show extended options (90d, 1y) for the Analytics tab which supports long date ranges */
  extendedOptions?: boolean;
}

const FILTER_LABELS: Record<TimeFilterOption, string> = {
  '24h': 'Last 24h',
  '7d': 'Last 7 Days',
  '30d': 'Last 30 Days',
  '90d': 'Last 90 Days',
  '1y': 'Last Year',
  all: 'All Time',
};

const STANDARD_OPTIONS: TimeFilterOption[] = ['24h', '7d', '30d', 'all'];
const EXTENDED_OPTIONS: TimeFilterOption[] = ['24h', '7d', '30d', '90d', '1y', 'all'];

export function TemperatureTimeFilter({
  timeFilter,
  isLoaded,
  onTimeFilterChange,
  extendedOptions = false,
}: TemperatureTimeFilterProps) {
  const { t } = useTranslation();
  const options = extendedOptions ? EXTENDED_OPTIONS : STANDARD_OPTIONS;

  return (
    <div className="flex flex-wrap gap-2 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-lg">
      {isLoaded ? (
        options.map(filter => {
          const isActive = timeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => onTimeFilterChange(filter)}
              className={`group text-fluid-sm relative min-h-[44px] rounded-2xl px-5 py-2.5 font-semibold transition-all duration-300 focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)] focus:outline-none ${
                isActive
                  ? 'scale-[1.02] bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-[var(--button-active-text)] shadow-xl'
                  : 'bg-transparent text-[var(--foreground-muted)] hover:bg-[var(--muted)] hover:text-[var(--button-active-text)]'
              }`}
            >
              {t(`timeFilter.${filter}`, FILTER_LABELS[filter])}
              {isActive && (
                <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[var(--primary)]/20 to-[var(--accent)]/20 blur-xl" />
              )}
            </button>
          );
        })
      ) : (
        <LoadingSkeleton variant="button" count={options.length} />
      )}
    </div>
  );
}
