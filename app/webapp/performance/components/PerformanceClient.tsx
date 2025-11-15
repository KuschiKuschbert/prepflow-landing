'use client';

import PerformanceActions from '../components/PerformanceActions';
import PerformanceCharts from '../components/PerformanceCharts';
import PerformanceDateRange from '../components/PerformanceDateRange';
import PerformanceEmptyState from '../components/PerformanceEmptyState';
import PerformanceFilters from '../components/PerformanceFilters';
import PerformanceHeader from '../components/PerformanceHeader';
import PerformanceImportModal from '../components/PerformanceImportModal';
import PerformanceInsights from '../components/PerformanceInsights';
import PerformanceMetadata from '../components/PerformanceMetadata';
import PerformanceSummaryCards from '../components/PerformanceSummaryCards';
import PerformanceTrends from '../components/PerformanceTrends';
import { TablePagination } from '@/components/ui/TablePagination';
import PerformanceTable from '../components/PerformanceTable';
import { usePerformanceData } from '../hooks/usePerformanceData';
import { usePerformanceFilters } from '../hooks/usePerformanceFilters';
import { DateRange, DateRangePreset } from '../types';
import { useState } from 'react';

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

  const { filters, updateFilters, paginatedItems, totalPages, filteredAndSortedItems } = usePerformanceFilters(
    state.performanceItems,
  );

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

  // Handle charts toggle
  const handleToggleCharts = () => {
    updateState({ showCharts: !state.showCharts });
  };

  return (
    <>
      <PerformanceHeader
        performanceScore={state.performanceScore}
        performanceAlerts={state.performanceAlerts}
        performanceItems={state.performanceItems}
      />

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

          {/* Insights & Recommendations */}
          <PerformanceInsights
            performanceItems={state.performanceItems}
            performanceScore={state.performanceScore}
          />

          {/* Methodology Metadata - Collapsible */}
          <PerformanceMetadata metadata={state.metadata} />

          {/* Filters - Sticky on scroll */}
          <PerformanceFilters
            filters={filters}
            performanceItems={state.performanceItems}
            filteredAndSortedItems={filteredAndSortedItems}
            onFiltersChange={updateFilters}
          />

          {/* Actions */}
          <PerformanceActions
            showImportModal={state.showImportModal}
            showCharts={state.showCharts}
            onImportClick={handleImportClick}
            onExportCSV={handleExportCSV}
            onToggleCharts={handleToggleCharts}
          />

          {/* Charts - Removed for better screen space optimization */}

          {/* Table Pagination - Top */}
          <TablePagination
            page={filters.currentPage}
            totalPages={totalPages}
            total={filteredAndSortedItems.length}
            itemsPerPage={filters.itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={itemsPerPage => updateFilters({ itemsPerPage, currentPage: 1 })}
            className="mb-4"
          />

          {/* Performance Table */}
          <PerformanceTable
            performanceItems={paginatedItems}
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            onSortChange={(field, order) => updateFilters({ sortBy: field, sortOrder: order })}
          />

          {/* Table Pagination - Bottom */}
          <TablePagination
            page={filters.currentPage}
            totalPages={totalPages}
            total={filteredAndSortedItems.length}
            itemsPerPage={filters.itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={itemsPerPage => updateFilters({ itemsPerPage, currentPage: 1 })}
            className="mt-4"
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
