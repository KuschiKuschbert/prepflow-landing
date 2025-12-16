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
    <>
      <PerformanceClassificationLegend />

      <div className="desktop:hidden block">
        <div className="tablet:space-y-4 tablet:p-4 space-y-3 p-3">
          {performanceItems.map(item => (
            <PerformanceTableMobileCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className="desktop:block hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--border)]">
          <PerformanceTableHeader handleColumnSort={handleColumnSort} getSortIcon={getSortIcon} />
          <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
            {performanceItems.map(item => (
              <PerformanceTableRow key={item.id} item={item} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
