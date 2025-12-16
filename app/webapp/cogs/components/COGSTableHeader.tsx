'use client';

interface COGSTableHeaderProps {
  onSortChange?: (
    field: 'ingredient_name' | 'quantity' | 'cost',
    direction: 'asc' | 'desc',
  ) => void;
  handleColumnSort: (field: 'ingredient_name' | 'quantity' | 'cost') => void;
  getSortIcon: (field: 'ingredient_name' | 'quantity' | 'cost') => React.ReactNode;
}

export function COGSTableHeader({
  onSortChange,
  handleColumnSort,
  getSortIcon,
}: COGSTableHeaderProps) {
  return (
    <thead className="sticky top-0 z-10 bg-gradient-to-r from-[var(--muted)]/50 to-[var(--muted)]/20">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
          {onSortChange ? (
            <button
              onClick={() => handleColumnSort('ingredient_name')}
              className="flex items-center gap-1 transition-colors hover:text-[var(--primary)]"
              aria-label="Sort by ingredient name"
            >
              Ingredient
              {getSortIcon('ingredient_name')}
            </button>
          ) : (
            'Ingredient'
          )}
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
          {onSortChange ? (
            <button
              onClick={() => handleColumnSort('quantity')}
              className="flex items-center gap-1 transition-colors hover:text-[var(--primary)]"
              aria-label="Sort by quantity"
            >
              Qty
              {getSortIcon('quantity')}
            </button>
          ) : (
            'Qty'
          )}
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
          {onSortChange ? (
            <button
              onClick={() => handleColumnSort('cost')}
              className="flex items-center gap-1 transition-colors hover:text-[var(--primary)]"
              aria-label="Sort by cost"
            >
              Cost
              {getSortIcon('cost')}
            </button>
          ) : (
            'Cost'
          )}
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
          Actions
        </th>
      </tr>
    </thead>
  );
}
