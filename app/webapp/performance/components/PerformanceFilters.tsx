'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PerformanceFilters as PerformanceFiltersType } from '../types';
import { PerformanceItem, DateRange, PerformanceMetadata } from '../types';
import { LANDING_COLORS } from '@/lib/landing-styles';
import { PrintButton } from '@/components/ui/PrintButton';
import { ExportButton, type ExportFormat } from '@/components/ui/ExportButton';
import { printPerformanceReport } from '../utils/printPerformanceReport';
import {
  exportPerformanceReportToCSV,
  exportPerformanceReportToHTML,
  exportPerformanceReportToPDF,
} from '../utils/exportPerformanceReport';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';

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

const MENU_ITEM_CLASSES = ["Chef's Kiss", 'Hidden Gem', 'Bargain Bucket', 'Burnt Toast'] as const;

export default function PerformanceFilters({
  filters,
  performanceItems,
  filteredAndSortedItems,
  onFiltersChange,
  showImportModal,
  onImportClick,
  onExportCSV,
  dateRange,
  metadata,
  performanceScore,
}: PerformanceFiltersProps) {
  const { showSuccess, showError } = useNotification();
  const [exportLoading, setExportLoading] = useState<ExportFormat | null>(null);
  const [printLoading, setPrintLoading] = useState(false);
  // Tooltip states for action buttons
  const [importTooltipVisible, setImportTooltipVisible] = useState(false);

  // Refs for button positions
  const importButtonRef = useRef<HTMLButtonElement>(null);

  // Tooltip positions
  const [importTooltipPos, setImportTooltipPos] = useState({ top: 0, left: 0 });

  // Update tooltip positions when buttons are hovered
  useEffect(() => {
    if (importTooltipVisible && importButtonRef.current) {
      const rect = importButtonRef.current.getBoundingClientRect();
      setImportTooltipPos({
        top: rect.top - 8, // Position above button
        left: rect.left + rect.width / 2, // Center horizontally
      });
    }
  }, [importTooltipVisible]);

  const handlePrint = () => {
    if (performanceItems.length === 0) {
      showError('No performance data to print');
      return;
    }

    setPrintLoading(true);
    try {
      printPerformanceReport({
        performanceItems,
        metadata,
        performanceScore,
        dateRange:
          dateRange.startDate && dateRange.endDate
            ? {
                start: dateRange.startDate,
                end: dateRange.endDate,
              }
            : undefined,
      });
      showSuccess('Performance report opened for printing');
    } catch (error) {
      logger.error('Failed to print performance report:', error);
      showError('Failed to print performance report');
    } finally {
      setPrintLoading(false);
    }
  };

  const handleExport = async (format: ExportFormat) => {
    if (performanceItems.length === 0) {
      showError('No performance data to export');
      return;
    }

    setExportLoading(format);
    try {
      switch (format) {
        case 'csv':
          exportPerformanceReportToCSV(performanceItems);
          showSuccess('Performance data exported to CSV');
          break;
        case 'html':
          exportPerformanceReportToHTML(performanceItems, dateRange, metadata, performanceScore);
          showSuccess('Performance report exported to HTML');
          break;
        case 'pdf':
          await exportPerformanceReportToPDF(
            performanceItems,
            dateRange,
            metadata,
            performanceScore,
          );
          showSuccess('Performance report exported to PDF');
          break;
      }
    } catch (error) {
      logger.error(`Failed to export performance report to ${format}:`, error);
      showError(`Failed to export performance report to ${format.toUpperCase()}`);
    } finally {
      setExportLoading(null);
    }
  };

  const handleFilterChange = (key: keyof PerformanceFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleMenuItemClassToggle = (className: string) => {
    const currentClasses = filters.menuItemClass || [];
    const newClasses = currentClasses.includes(className)
      ? currentClasses.filter(c => c !== className)
      : [...currentClasses, className];

    handleFilterChange('menuItemClass', newClasses);
  };

  // Calculate counts for each menu item class
  const classCounts = MENU_ITEM_CLASSES.reduce(
    (acc, className) => {
      acc[className] = performanceItems.filter(item => item.menu_item_class === className).length;
      return acc;
    },
    {} as Record<string, number>,
  );

  const hasActiveFilters =
    (filters.menuItemClass?.length || 0) > 0 || filters.searchTerm.length > 0;

  return (
    <div className="sticky top-0 z-30 border-b border-[#2a2a2a] bg-[#1f1f1f]/95 p-3 backdrop-blur-sm">
      {/* Single Row: Actions, Result count, Filters, Search/Sort */}
      <div className="tablet:flex-row flex flex-col items-center gap-2">
        {/* Action Buttons - Moved to left (less frequently used) */}
        <div className="flex items-center gap-1">
          {/* Import Button with Tooltip */}
          <div className="relative">
            <button
              ref={importButtonRef}
              onClick={onImportClick}
              className="flex items-center justify-center rounded-lg px-1.5 py-1 text-xs font-medium text-black transition-colors"
              style={{
                backgroundColor: LANDING_COLORS.primary,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = `${LANDING_COLORS.primary}CC`;
                setImportTooltipVisible(true);
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = LANDING_COLORS.primary;
                setImportTooltipVisible(false);
              }}
            >
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 13.293a1 1 0 011.414 0L10 15.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {importTooltipVisible &&
              typeof window !== 'undefined' &&
              createPortal(
                <div
                  className="fixed z-[100] w-48 -translate-x-1/2 rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] p-2 text-xs text-gray-300 shadow-lg"
                  style={{
                    top: `${importTooltipPos.top - 40}px`,
                    left: `${importTooltipPos.left}px`,
                  }}
                  onMouseEnter={() => setImportTooltipVisible(true)}
                  onMouseLeave={() => setImportTooltipVisible(false)}
                >
                  Import sales data from CSV file
                  <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-4 border-t-[#1f1f1f] border-r-transparent border-b-transparent border-l-transparent" />
                </div>,
                document.body,
              )}
          </div>

          {/* Print and Export Buttons */}
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
        <div className="text-xs whitespace-nowrap text-gray-400">
          <span className="font-semibold text-white">{filteredAndSortedItems.length}</span>/
          <span className="font-semibold text-white">{performanceItems.length}</span>
        </div>

        {/* Filter by Class Chips - Compact inline */}
        <div className="flex flex-wrap items-center gap-1">
          {MENU_ITEM_CLASSES.map(className => {
            const isActive = filters.menuItemClass?.includes(className) || false;
            const count = classCounts[className];
            // Shortened labels for compact display
            const shortLabel =
              className === "Chef's Kiss"
                ? 'Kiss'
                : className === 'Hidden Gem'
                  ? 'Gem'
                  : className === 'Bargain Bucket'
                    ? 'Bargain'
                    : 'Toast';

            return (
              <button
                key={className}
                onClick={() => handleMenuItemClassToggle(className)}
                className={`rounded-full px-1.5 py-0.5 text-xs font-medium transition-all ${
                  isActive
                    ? className === "Chef's Kiss"
                      ? 'border-2 border-green-500 bg-green-500/20 text-green-400'
                      : className === 'Hidden Gem'
                        ? 'border-2 border-blue-500 bg-blue-500/20 text-blue-400'
                        : className === 'Bargain Bucket'
                          ? 'border-2 border-yellow-500 bg-yellow-500/20 text-yellow-400'
                          : 'border-2 border-red-500 bg-red-500/20 text-red-400'
                    : 'border border-[#2a2a2a] bg-[#2a2a2a] text-gray-400 hover:border-[#29E7CD]/50 hover:text-[#29E7CD]'
                }`}
                title={className}
              >
                {shortLabel}
                <span className={`ml-1 ${isActive ? 'opacity-100' : 'opacity-60'}`}>({count})</span>
              </button>
            );
          })}
          {hasActiveFilters && (
            <button
              onClick={() => {
                handleFilterChange('menuItemClass', []);
                handleFilterChange('searchTerm', '');
              }}
              className="px-1 text-xs text-[#29E7CD] transition-colors hover:text-[#29E7CD]/80"
            >
              Clear
            </button>
          )}
        </div>

        {/* Search and Sort Controls - Compact inline (right side, most frequently used) */}
        <div className="flex flex-1 items-center gap-1.5">
          <input
            type="text"
            placeholder="Search..."
            value={filters.searchTerm}
            onChange={e => handleFilterChange('searchTerm', e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] px-2 py-1 text-xs text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
          />
          <select
            value={filters.sortBy}
            onChange={e => handleFilterChange('sortBy', e.target.value)}
            className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] px-1.5 py-1 text-xs text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
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
            className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] px-1.5 py-1 text-xs text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
          >
            <option value="desc">↓</option>
            <option value="asc">↑</option>
          </select>
        </div>
      </div>
    </div>
  );
}
