'use client';

import { useEffect } from 'react';
import PerformanceHeader from './components/PerformanceHeader';
import PerformanceMetadata from './components/PerformanceMetadata';
import PerformanceFilters from './components/PerformanceFilters';
import PerformanceActions from './components/PerformanceActions';
import PerformanceCharts from './components/PerformanceCharts';
import PerformanceTable from './components/PerformanceTable';
import PerformancePagination from './components/PerformancePagination';
import PerformanceImportModal from './components/PerformanceImportModal';
import { usePerformanceData } from './hooks/usePerformanceData';
import { usePerformanceFilters } from './hooks/usePerformanceFilters';

export default function PerformancePageContent() {
  const {
    state,
    updateState,
    setupRealtimeSubscription,
    handleImport,
    handleExportCSV,
    realtimeSubscription,
  } = usePerformanceData();

  const { filters, updateFilters, paginatedItems, totalPages } = usePerformanceFilters(
    state.performanceItems,
  );

  // Handle realtime toggle
  const handleToggleRealtime = () => {
    const newRealtimeEnabled = !state.realtimeEnabled;
    updateState({ realtimeEnabled: newRealtimeEnabled });

    if (newRealtimeEnabled) {
      setupRealtimeSubscription();
    } else {
      if (realtimeSubscription.current) {
        realtimeSubscription.current.unsubscribe();
      }
    }
  };

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
    <div className="min-h-screen bg-transparent p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <PerformanceHeader
          performanceScore={state.performanceScore}
          realtimeEnabled={state.realtimeEnabled}
          lastUpdate={state.lastUpdate}
          performanceAlerts={state.performanceAlerts}
        />

        <PerformanceMetadata metadata={state.metadata} />

        <PerformanceFilters filters={filters} onFiltersChange={updateFilters} />

        <PerformanceActions
          showImportModal={state.showImportModal}
          showCharts={state.showCharts}
          realtimeEnabled={state.realtimeEnabled}
          onImportClick={handleImportClick}
          onExportCSV={handleExportCSV}
          onToggleCharts={handleToggleCharts}
          onToggleRealtime={handleToggleRealtime}
        />

        {state.showCharts && <PerformanceCharts performanceItems={state.performanceItems} />}

        <PerformanceTable performanceItems={paginatedItems} />

        <PerformancePagination
          currentPage={filters.currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        <PerformanceImportModal
          showImportModal={state.showImportModal}
          csvData={{ csvData: state.csvData, importing: state.importing }}
          onClose={handleCloseImportModal}
          onImport={handleImport}
          onCsvDataChange={handleCsvDataChange}
        />
      </div>
    </div>
  );
}
