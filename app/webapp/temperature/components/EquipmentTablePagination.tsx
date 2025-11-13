'use client';

import React from 'react';

interface EquipmentTablePaginationProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function EquipmentTablePagination({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  onPageChange,
}: EquipmentTablePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] px-6 py-4">
      <div className="text-sm text-gray-400">
        Showing {startIndex + 1} to {endIndex} of {totalItems} equipment
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[#2a2a2a] disabled:hover:bg-[#2a2a2a]"
        >
          Previous
        </button>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => {
              return (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              );
            })
            .map((page, index, array) => {
              const showEllipsisBefore = index > 0 && array[index - 1] < page - 1;
              return (
                <React.Fragment key={`equipment-table-page-${page}`}>
                  {showEllipsisBefore && <span className="px-2 text-sm text-gray-500">...</span>}
                  <button
                    onClick={() => onPageChange(page)}
                    className={`min-w-[40px] rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black'
                        : 'border border-[#2a2a2a] bg-[#2a2a2a] text-gray-300 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/10 hover:text-white'
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              );
            })}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[#2a2a2a] disabled:hover:bg-[#2a2a2a]"
        >
          Next
        </button>
      </div>
    </div>
  );
}
