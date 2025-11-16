'use client';

import { PerformanceItem } from '../types';
import { usePerformanceTableSort } from '../hooks/usePerformanceTableSort';
import { PerformanceClassificationLegend } from './PerformanceClassificationLegend';
import { PerformanceTableMobileCard } from './PerformanceTableMobileCard';
import { PerformanceTableHeader } from './PerformanceTableHeader';
import { PerformanceTableRow } from './PerformanceTableRow';

interface PerformanceTableProps {
  performanceItems: PerformanceItem[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (field: string, order: 'asc' | 'desc') => void;
}

export default function PerformanceTable({
  performanceItems,
  sortBy,
  sortOrder,
  onSortChange,
}: PerformanceTableProps) {
  const { handleColumnSort, getSortIcon } = usePerformanceTableSort({
    sortBy,
    sortOrder,
    onSortChange,
  });

  return (
    <div className="overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f]">
      <PerformanceClassificationLegend />

      <div className="block desktop:hidden">
        <div className="space-y-3 p-3 tablet:space-y-4 tablet:p-4">
          {performanceItems.map((item) => (
            <PerformanceTableMobileCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className="hidden overflow-x-auto desktop:block">
        <table className="min-w-full divide-y divide-[#2a2a2a]">
          <PerformanceTableHeader
            handleColumnSort={handleColumnSort}
            getSortIcon={getSortIcon}
          />
          <tbody className="divide-y divide-[#2a2a2a] bg-[#1f1f1f]">
            {performanceItems.map((item) => (
              <PerformanceTableRow key={item.id} item={item} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
