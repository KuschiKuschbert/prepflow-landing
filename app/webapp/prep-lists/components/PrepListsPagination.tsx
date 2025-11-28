/**
 * Pagination component for prep lists page.
 */

interface PrepListsPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export function PrepListsPagination({
  page,
  totalPages,
  total,
  onPreviousPage,
  onNextPage,
}: PrepListsPaginationProps) {
  return (
    <div className="mt-4 flex items-center justify-between">
      <span className="text-sm text-gray-400">
        Page {page} of {totalPages} ({total} items)
      </span>
      <div className="space-x-2">
        <button
          onClick={onPreviousPage}
          disabled={page <= 1}
          className="rounded-lg bg-[#2a2a2a] px-3 py-2 text-sm text-white disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={onNextPage}
          disabled={page >= totalPages}
          className="rounded-lg bg-[#2a2a2a] px-3 py-2 text-sm text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
