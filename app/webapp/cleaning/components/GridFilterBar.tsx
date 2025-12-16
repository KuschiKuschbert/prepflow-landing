/**
 * Filter bar component for cleaning grid
 */

interface GridFilterBarProps {
  gridFilter: 'today' | 'next2days' | 'week' | 'all';
  onFilterChange: (filter: 'today' | 'next2days' | 'week' | 'all') => void;
}

export function GridFilterBar({ gridFilter, onFilterChange }: GridFilterBarProps) {
  return (
    <div className="desktop:flex-row desktop:items-center desktop:justify-between flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-semibold text-[var(--foreground)]">Cleaning Grid</h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['today', 'next2days', 'week', 'all'] as const).map(filterOption => (
          <button
            key={filterOption}
            onClick={() => onFilterChange(filterOption)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
              gridFilter === filterOption
                ? 'bg-[var(--primary)] text-[var(--button-active-text)] shadow-lg'
                : 'bg-[var(--muted)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
            }`}
          >
            {filterOption === 'today'
              ? 'Today'
              : filterOption === 'next2days'
                ? 'Next 2 Days'
                : filterOption === 'week'
                  ? 'This Week'
                  : 'All (14 Days)'}
          </button>
        ))}
      </div>
    </div>
  );
}




