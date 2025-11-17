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
      <label htmlFor="items-per-page" className="text-xs whitespace-nowrap text-gray-400">
        Per page:
      </label>
      <select
        id="items-per-page"
        value={itemsPerPage}
        onChange={e => onItemsPerPageChange(Number(e.target.value))}
        className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/80 px-2.5 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-[#2a2a2a] hover:bg-[#1f1f1f] focus:border-[#29E7CD]/50 focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
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
