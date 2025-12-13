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
        <h2 className="text-2xl font-semibold text-white">Cleaning Grid</h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['today', 'next2days', 'week', 'all'] as const).map(filterOption => (
          <button
            key={filterOption}
            onClick={() => onFilterChange(filterOption)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
              gridFilter === filterOption
                ? 'bg-[#29E7CD] text-black shadow-lg'
                : 'bg-[#2a2a2a] text-gray-400 hover:text-white'
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
