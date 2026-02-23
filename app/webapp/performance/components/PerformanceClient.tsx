'use client';

import { PageTipsCard } from '@/components/ui/PageTipsCard';
import { TablePagination } from '@/components/ui/TablePagination';
import { PAGE_TIPS_CONFIG } from '@/lib/page-help/page-tips-content';
import { useState } from 'react';
import PerformanceCharts from '../components/PerformanceCharts';
import PerformanceDateRange from '../components/PerformanceDateRange';
import PerformanceEmptyState from '../components/PerformanceEmptyState';
import PerformanceFilters from '../components/PerformanceFilters';
import PerformanceHeader from '../components/PerformanceHeader';
import PerformanceImportModal from '../components/PerformanceImportModal';
import PerformanceInsights from '../components/PerformanceInsights';
import PerformanceSummaryCards from '../components/PerformanceSummaryCards';
import PerformanceTable from '../components/PerformanceTable';
import PerformanceTrends from '../components/PerformanceTrends';
import { usePerformanceData } from '../hooks/usePerformanceData';
import { usePerformanceFilters } from '../hooks/usePerformanceFilters';
import { DateRange } from '@/lib/types/performance';

export default function PerformanceClient() {
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
  } = usePerformanceData(dateRange);

  const { filters, updateFilters, paginatedItems, totalPages, filteredAndSortedItems } =
    usePerformanceFilters(state.performanceItems);

  const hasData = state.performanceItems.length > 0;

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

      {hasData ? (
        <>
          {/* Date Range Selector */}
          <PerformanceDateRange dateRange={dateRange} onDateRangeChange={setDateRange} />

          {/* Trend Analysis - Compare to Previous Period */}
          {previousPeriodData && previousPeriodData.length > 0 && (
            <PerformanceTrends
              currentItems={state.performanceItems}
              previousItems={previousPeriodData}
              dateRange={dateRange}
            />
          )}

          {/* Summary Cards - Key Metrics */}
          <PerformanceSummaryCards performanceItems={state.performanceItems} />

          {/* Performance Charts - Visualizations */}
          <PerformanceCharts
            performanceItems={state.performanceItems}
            performanceHistory={state.performanceHistory}
            dateRange={dateRange}
          />

          {/* Insights & Recommendations */}
          <PerformanceInsights
            performanceItems={state.performanceItems}
            performanceScore={state.performanceScore}
          />

          {/* Table Pagination - Top */}
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
