'use client';

import { useTranslation } from '@/lib/useTranslation';

interface EquipmentDrawerTimeFilterProps {
  timeFilter: '24h' | '7d' | '30d' | 'all';
  onTimeFilterChange: (filter: '24h' | '7d' | '30d' | 'all') => void;
}

export function EquipmentDrawerTimeFilter({
  timeFilter,
  onTimeFilterChange,
}: EquipmentDrawerTimeFilterProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-4 flex flex-shrink-0 flex-wrap gap-1.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-lg">
      {(['24h', '7d', '30d', 'all'] as const).map(filter => {
        const isActive = timeFilter === filter;
        return (
          <button
            key={filter}
            onClick={() => onTimeFilterChange(filter)}
            className={`group relative min-h-[36px] rounded-xl px-3 py-1.5 text-xs font-medium transition-all duration-300 focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)] focus:outline-none ${
              isActive
                ? 'scale-[1.02] bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-[var(--button-active-text)] shadow-xl'
                : 'bg-transparent text-[var(--foreground-muted)] hover:bg-[var(--muted)] hover:text-[var(--button-active-text)]'
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
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--primary)]/20 to-[var(--accent)]/20 blur-xl" />
            )}
          </button>
        );
      })}
    </div>
  );
}
