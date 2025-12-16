'use client';

interface ItemsPerPageSelectorProps {
  itemsPerPage: number;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

export function ItemsPerPageSelector({
  itemsPerPage,
  onItemsPerPageChange,
}: ItemsPerPageSelectorProps) {
  return (
    <div className="flex items-center gap-1.5">
      <label htmlFor="items-per-page" className="text-xs whitespace-nowrap text-[var(--foreground-muted)]">
        Per page:
      </label>
      <select
        id="items-per-page"
        value={itemsPerPage}
        onChange={e => onItemsPerPageChange(Number(e.target.value))}
        className="rounded-lg border border-[var(--border)] bg-[var(--background)]/80 px-2.5 py-2 text-sm font-medium text-[var(--foreground-secondary)] transition-all duration-200 hover:border-[var(--border)] hover:bg-[var(--surface)] focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none"
        title="Items per page"
      >
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
        <option value="200">200</option>
      </select>
    </div>
  );
}
