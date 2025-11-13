interface IngredientPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function IngredientPagination({
  page,
  totalPages,
  total,
  onPageChange,
  className = '',
}: IngredientPaginationProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <span className="text-sm text-gray-400">
        Page {page} of {totalPages} ({total} items)
      </span>
      <div className="space-x-2">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="rounded-lg bg-[#2a2a2a] px-3 py-2 text-sm text-white disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="rounded-lg bg-[#2a2a2a] px-3 py-2 text-sm text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
