'use client';

import { ExportButton, type ExportFormat } from '@/components/ui/ExportButton';
import { PrintButton } from '@/components/ui/PrintButton';
import { useNotification } from '@/contexts/NotificationContext';
import { useState } from 'react';
import {
  DateRange,
  PerformanceFilters as PerformanceFiltersType,
  PerformanceItem,
  PerformanceMetadata,
} from '@/lib/types/performance';
import { ImportButton } from './PerformanceFilters/ImportButton';
import { MenuItemClassFilters } from './PerformanceFilters/MenuItemClassFilters';
import { handleExportHelper } from './PerformanceFilters/helpers/handleExport';
import { handlePrintHelper } from './PerformanceFilters/helpers/handlePrint';

interface PerformanceFiltersProps {
  filters: PerformanceFiltersType;
  performanceItems: PerformanceItem[];
  filteredAndSortedItems: PerformanceItem[];
  onFiltersChange: (filters: PerformanceFiltersType) => void;
  // Action buttons props
  showImportModal: boolean;
  onImportClick: () => void;
  onExportCSV: () => void;
  dateRange: DateRange;
  metadata?: PerformanceMetadata | null;
  performanceScore?: number;
}

export default function PerformanceFilters({
  filters,
  performanceItems,
  filteredAndSortedItems,
  onFiltersChange,
  showImportModal: _showImportModal,
  onImportClick,
  onExportCSV: _onExportCSV,
  dateRange,
  metadata,
  performanceScore,
}: PerformanceFiltersProps) {
  const { showSuccess, showError } = useNotification();
  const [exportLoading, setExportLoading] = useState<ExportFormat | null>(null);
  const [printLoading, setPrintLoading] = useState(false);

  const handlePrint = () =>
    handlePrintHelper(
      performanceItems,
      dateRange,
      metadata,
      performanceScore,
      showError,
      showSuccess,
      setPrintLoading,
    );
  const handleExport = async (format: ExportFormat) =>
    handleExportHelper(
      format,
      performanceItems,
      dateRange,
      metadata,
      performanceScore,
      showError,
      showSuccess,
      setExportLoading,
    );

  const handleFilterChange = (key: keyof PerformanceFiltersType, value: string | string[]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface)]/95 p-3 backdrop-blur-sm">
      {/* Single Row: Actions, Result count, Filters, Search/Sort */}
      <div className="tablet:flex-row flex flex-col items-center gap-2">
        <div className="flex items-center gap-1">
          <ImportButton onImportClick={onImportClick} />
          <PrintButton
            onClick={handlePrint}
            loading={printLoading}
            disabled={performanceItems.length === 0}
            size="sm"
            variant="secondary"
          />
          <ExportButton
            onExport={handleExport}
            loading={exportLoading}
            disabled={performanceItems.length === 0}
            availableFormats={['csv', 'pdf', 'html']}
            size="sm"
            variant="secondary"
          />
        </div>

        {/* Result count */}
        <div className="text-xs whitespace-nowrap text-[var(--foreground-muted)]">
          <span className="font-semibold text-[var(--foreground)]">
            {filteredAndSortedItems.length}
          </span>
          /<span className="font-semibold text-[var(--foreground)]">{performanceItems.length}</span>
        </div>

        <MenuItemClassFilters
          filters={filters}
          performanceItems={performanceItems}
          onFilterChange={handleFilterChange}
        />

        {/* Search and Sort Controls - Compact inline (right side, most frequently used) */}
        <div className="flex flex-1 items-center gap-1.5">
          <input
            type="text"
            placeholder="Search..."
            value={filters.searchTerm}
            onChange={e => handleFilterChange('searchTerm', e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-2 py-1 text-xs text-[var(--foreground)] placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
          />
          <select
            value={filters.sortBy}
            onChange={e => handleFilterChange('sortBy', e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--muted)] px-1.5 py-1 text-xs text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
          >
            <option value="name">Name</option>
            <option value="number_sold">Sold</option>
            <option value="popularity_percentage">Popularity</option>
            <option value="total_revenue">Revenue</option>
            <option value="total_cost">Cost</option>
            <option value="total_profit">Profit</option>
            <option value="gross_profit_percentage">Profit %</option>
            <option value="profit_category">Profit Cat</option>
            <option value="popularity_category">Popularity Cat</option>
            <option value="menu_item_class">Class</option>
          </select>
          <select
            value={filters.sortOrder}
            onChange={e => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
            className="rounded-lg border border-[var(--border)] bg-[var(--muted)] px-1.5 py-1 text-xs text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
          >
            <option value="desc">↓</option>
            <option value="asc">↑</option>
          </select>
        </div>
      </div>
    </div>
  );
}
