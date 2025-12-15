import type { ExportFormat } from '@/components/ui/ExportButton';
import { useNotification } from '@/contexts/NotificationContext';
import { useState } from 'react';
import type { TemperatureEquipment, TemperatureLog } from '../../../types';
import { calculateDateRange } from '../utils/calculateDateRange';
import { handlePrintHelper } from './useTemperatureExport/helpers/handlePrint';
import { handleExportHelper } from './useTemperatureExport/helpers/handleExport';

interface UseTemperatureExportProps {
  logs: TemperatureLog[];
  allLogs: TemperatureLog[];
  equipment: TemperatureEquipment[];
  selectedDate: string;
}

/**
 * Hook for handling temperature logs export and print
 */
export function useTemperatureExport({
  logs,
  allLogs,
  equipment,
  selectedDate,
}: UseTemperatureExportProps) {
  const { showSuccess, showError } = useNotification();
  const [exportLoading, setExportLoading] = useState<ExportFormat | null>(null);

  const handlePrint = () => {
    const logsToExport = logs.length > 0 ? logs : allLogs;
    const dateRange = calculateDateRange(logsToExport, selectedDate);
    handlePrintHelper(logsToExport, equipment, dateRange, showSuccess, showError);
  };

  const handleExport = async (format: ExportFormat) => {
    const logsToExport = logs.length > 0 ? logs : allLogs;
    const dateRange = calculateDateRange(logsToExport, selectedDate);
    await handleExportHelper(format, logsToExport, equipment, dateRange, setExportLoading, showSuccess, showError);
  };

  return {
    exportLoading,
    handlePrint,
    handleExport,
  };
}
