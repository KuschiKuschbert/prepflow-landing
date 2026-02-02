'use client';

import { memo } from 'react';
import { usePerformanceTableSort } from '../hooks/usePerformanceTableSort';
import { PerformanceItem } from '@/lib/types/performance';
import { PerformanceClassificationLegend } from './PerformanceClassificationLegend';
import { PerformanceTableHeader } from './PerformanceTableHeader';
import { PerformanceTableMobileCard } from './PerformanceTableMobileCard';
import { PerformanceTableRow } from './PerformanceTableRow';

interface PerformanceTableProps {
  performanceItems: PerformanceItem[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (field: string, order: 'asc' | 'desc') => void;
}

function PerformanceTableComponent({
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
      <MobileView performanceItems={performanceItems} />
      <DesktopView
        performanceItems={performanceItems}
        handleColumnSort={handleColumnSort}
        getSortIcon={getSortIcon}
      />
    </>
  );
}

function MobileView({ performanceItems }: { performanceItems: PerformanceItem[] }) {
  return (
    <div className="desktop:hidden block">
      <div className="tablet:space-y-4 tablet:p-4 space-y-3 p-3">
        {performanceItems.map(item => (
          <PerformanceTableMobileCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function DesktopView({
  performanceItems,
  handleColumnSort,
  getSortIcon,
}: {
  performanceItems: PerformanceItem[];
  handleColumnSort: any;
  getSortIcon: any;
}) {
  return (
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
  );
}

// Memoize component to prevent unnecessary re-renders when props don't change
export default memo(PerformanceTableComponent);
