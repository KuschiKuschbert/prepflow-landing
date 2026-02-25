'use client';

import { useNotification } from '@/contexts/NotificationContext';
import { PerformanceState } from '@/lib/types/performance';
import { exportPerformanceDataToCSV, parseCSVSalesData } from '../utils/csv-utils';
import { importPerformanceData } from '../utils/performance-api';

import { logger } from '@/lib/logger';
interface UsePerformanceImportExportProps {
  state: PerformanceState;
  setState: React.Dispatch<React.SetStateAction<PerformanceState>>;
  fetchPerformanceData: () => Promise<void>;
}

export function usePerformanceImportExport({
  state,
  setState,
  fetchPerformanceData,
}: UsePerformanceImportExportProps) {
  const { showSuccess, showError } = useNotification();

  const handleImport = async () => {
    if (!state.csvData.trim()) return;
    setState(prev => ({ ...prev, importing: true }));
    try {
      const salesData = parseCSVSalesData(state.csvData);
      const result = await importPerformanceData(salesData);
      setState(prev => ({ ...prev, csvData: '', showImportModal: false, importing: false }));
      await fetchPerformanceData();
      const msg = (result as { message?: string }).message;
      if (msg) showSuccess(msg);
    } catch (error) {
      logger.error('Error importing data:', error);
      showError('Failed to import sales data');
      setState(prev => ({
        ...prev,
        importing: false,
        performanceAlerts: [
          ...prev.performanceAlerts,
          {
            id: Date.now().toString(),
            message: 'Failed to import sales data',
            timestamp: new Date(),
          },
        ],
      }));
    }
  };

  const handleExportCSV = () => {
    exportPerformanceDataToCSV(state.performanceItems);
  };

  return {
    handleImport,
    handleExportCSV,
  };
}
