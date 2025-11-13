'use client';

import PerformanceActions from '../components/PerformanceActions';
import PerformanceCharts from '../components/PerformanceCharts';
import PerformanceFilters from '../components/PerformanceFilters';
import PerformanceHeader from '../components/PerformanceHeader';
import PerformanceImportModal from '../components/PerformanceImportModal';
import PerformanceMetadata from '../components/PerformanceMetadata';
import { TablePagination } from '@/components/ui/TablePagination';
import PerformanceTable from '../components/PerformanceTable';
import { usePerformanceData } from '../hooks/usePerformanceData';
import { usePerformanceFilters } from '../hooks/usePerformanceFilters';

export default function PerformanceClient() {
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
    <>
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

      <TablePagination
        page={filters.currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className="mb-4"
      />

      <PerformanceTable performanceItems={paginatedItems} />

      <TablePagination
        page={filters.currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className="mt-4"
      />

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
