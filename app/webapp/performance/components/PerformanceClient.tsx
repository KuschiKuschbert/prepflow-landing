'use client';

import { PageTipsCard } from '@/components/ui/PageTipsCard';
import { TablePagination } from '@/components/ui/TablePagination';
import { PAGE_TIPS_CONFIG } from '@/lib/page-help/page-tips-content';
import { useCallback, useRef, useState } from 'react';
import PerformanceCharts from '../components/PerformanceCharts';
import PerformanceDateRange from '../components/PerformanceDateRange';
import PerformanceMenuFilter from '../components/PerformanceMenuFilter';
import PerformanceEmptyState from '../components/PerformanceEmptyState';
import PerformanceFilters from '../components/PerformanceFilters';
import PerformanceHeader from '../components/PerformanceHeader';
import PerformanceImportModal from '../components/PerformanceImportModal';
import PerformanceInsights from '../components/PerformanceInsights';
import PerformanceSummaryCards from '../components/PerformanceSummaryCards';
import PerformanceTable from '../components/PerformanceTable';
import PerformanceTrends from '../components/PerformanceTrends';
import { PerformanceWeatherInsight } from '../components/PerformanceWeatherInsight';
import { usePerformanceData } from '../hooks/usePerformanceData';
import { usePerformanceFilters } from '../hooks/usePerformanceFilters';
import { DateRange } from '@/lib/types/performance';

export default function PerformanceClient() {
  // Menu filter state
  const [menuId, setMenuId] = useState<string | null>(null);
  const [lockedMenuOnly, setLockedMenuOnly] = useState(false);

  // Date range state
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 29); // Default to last 30 days
    startDate.setHours(0, 0, 0, 0);
    return {
      startDate,
      endDate: today,
      preset: '30d',
    };
  });

  const {
    state,
    updateState,
    handleImport,
    handleExportCSV,
    fetchPerformanceData,
    previousPeriodData,
  } = usePerformanceData(dateRange, { menuId, lockedMenuOnly });

  const { filters, updateFilters, paginatedItems, totalPages, filteredAndSortedItems } =
    usePerformanceFilters(state.performanceItems);

  const hasData = state.performanceItems.length > 0;

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const handleCategoryFilter = useCallback(
    (className: string) => {
      updateFilters({ menuItemClass: [className] });
      tableContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [updateFilters],
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    updateFilters({ currentPage: page });
  };

  // Handle CSV data change
  const handleCsvDataChange = (csvData: string) => {
    updateState({ csvData });
  };

  // Handle import modal
  const handleImportClick = () => {
    updateState({ showImportModal: true });
  };

  const handleCloseImportModal = () => {
    updateState({ showImportModal: false, csvData: '' });
  };

  return (
    <>
      <PerformanceHeader
        performanceScore={state.performanceScore}
        performanceAlerts={state.performanceAlerts}
        performanceItems={state.performanceItems}
        metadata={state.metadata}
      />

      {PAGE_TIPS_CONFIG.performance && (
        <div className="mb-6">
          <PageTipsCard config={PAGE_TIPS_CONFIG.performance} />
        </div>
      )}

      <PerformanceWeatherInsight />

      {hasData ? (
        <>
          {/* Date Range and Menu Filters */}
          <div className="desktop:flex desktop:gap-4 desktop:flex-row flex flex-col gap-3">
            <PerformanceDateRange dateRange={dateRange} onDateRangeChange={setDateRange} />
            <PerformanceMenuFilter
              menuId={menuId}
              lockedMenuOnly={lockedMenuOnly}
              onMenuIdChange={setMenuId}
              onLockedMenuOnlyChange={setLockedMenuOnly}
            />
          </div>

          {/* Trend Analysis - Compare to Previous Period */}
          {previousPeriodData && previousPeriodData.length > 0 && (
            <PerformanceTrends
              currentItems={state.performanceItems}
              previousItems={previousPeriodData}
              dateRange={dateRange}
            />
          )}

          {/* Summary Cards - Key Metrics */}
          <PerformanceSummaryCards
            performanceItems={state.performanceItems}
            onCategoryFilter={handleCategoryFilter}
          />

          {/* Performance Charts - Visualizations */}
          <PerformanceCharts
            performanceItems={state.performanceItems}
            performanceHistory={state.performanceHistory}
            weatherByDate={state.weatherByDate}
            dateRange={dateRange}
            onCategoryFilter={handleCategoryFilter}
          />

          {/* Insights & Recommendations */}
          <PerformanceInsights
            performanceItems={state.performanceItems}
            performanceScore={state.performanceScore}
          />

          {/* Table Section */}
          <div ref={tableContainerRef}>
            {/* Active filter banner */}
            {filters.menuItemClass?.length === 1 && (
              <div className="mb-3 flex items-center justify-between gap-2 rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 px-3 py-2">
                <span className="text-sm text-[var(--foreground)]">
                  Showing <strong>{filters.menuItemClass[0]}</strong> only
                </span>
                <button
                  type="button"
                  onClick={() => updateFilters({ menuItemClass: [] })}
                  className="text-xs font-medium text-[var(--primary)] transition-colors hover:text-[var(--primary)]/80 hover:underline"
                >
                  Clear filter
                </button>
              </div>
            )}

            <TablePagination
              page={filters.currentPage}
              totalPages={totalPages}
              total={filteredAndSortedItems.length}
              itemsPerPage={filters.itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={itemsPerPage => updateFilters({ itemsPerPage, currentPage: 1 })}
              className="mb-3"
            />

            {/* Table Container with Filters */}
            <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
              {/* Filters - Attached to table */}
              <PerformanceFilters
                filters={filters}
                performanceItems={state.performanceItems}
                filteredAndSortedItems={filteredAndSortedItems}
                onFiltersChange={updateFilters}
                showImportModal={state.showImportModal}
                onImportClick={handleImportClick}
                onExportCSV={handleExportCSV}
                dateRange={dateRange}
                metadata={state.metadata}
                performanceScore={state.performanceScore}
              />

              {/* Performance Table */}
              <PerformanceTable
                performanceItems={paginatedItems}
                sortBy={filters.sortBy}
                sortOrder={filters.sortOrder}
                onSortChange={(field, order) => updateFilters({ sortBy: field, sortOrder: order })}
              />
            </div>

            {/* Table Pagination - Bottom */}
            <TablePagination
              page={filters.currentPage}
              totalPages={totalPages}
              total={filteredAndSortedItems.length}
              itemsPerPage={filters.itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={itemsPerPage => updateFilters({ itemsPerPage, currentPage: 1 })}
              className="mt-3"
            />
          </div>
        </>
      ) : (
        <PerformanceEmptyState onDataGenerated={fetchPerformanceData} />
      )}

      <PerformanceImportModal
        showImportModal={state.showImportModal}
        csvData={{ csvData: state.csvData, importing: state.importing }}
        onClose={handleCloseImportModal}
        onImport={handleImport}
        onCsvDataChange={handleCsvDataChange}
      />
    </>
  );
}
