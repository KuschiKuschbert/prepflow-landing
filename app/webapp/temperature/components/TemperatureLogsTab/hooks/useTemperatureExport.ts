import { useState } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import type { ExportFormat } from '@/components/ui/ExportButton';
import type { TemperatureEquipment, TemperatureLog } from '../../../types';
import type { DateRange } from '../types';
import {
  printTemperatureLogs,
  exportTemperatureLogsToCSV,
} from '../../../utils/temperatureLogExportUtils';
import { calculateDateRange } from '../utils/calculateDateRange';

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
    try {
      const logsToExport = logs.length > 0 ? logs : allLogs;
      const dateRange = calculateDateRange(logsToExport, selectedDate);

      printTemperatureLogs({
        logs: logsToExport,
        equipment,
        dateRange,
      });
      showSuccess('Temperature logs opened for printing');
    } catch (err) {
      logger.error('[Temperature Logs] Print error:', err);
      showError('Failed to print temperature logs. Please try again.');
    }
  };

  const handleExport = async (format: ExportFormat) => {
    try {
      setExportLoading(format);

      const logsToExport = logs.length > 0 ? logs : allLogs;
      const dateRange = calculateDateRange(logsToExport, selectedDate);

      if (format === 'csv') {
        exportTemperatureLogsToCSV({
          logs: logsToExport,
          equipment,
          dateRange,
        });
        showSuccess('Temperature logs exported as CSV');
      } else if (format === 'pdf') {
        // PDF is handled via print dialog
        printTemperatureLogs({
          logs: logsToExport,
          equipment,
          dateRange,
        });
        showSuccess(
          "Temperature logs opened for printing. Use your browser's print dialog to save as PDF.",
        );
      } else if (format === 'html') {
        // HTML export - generate and download
        const { generatePrintTemplate } = await import('@/lib/exports/print-template');
        const { formatTemperatureLogsForPrint } =
          await import('../../../utils/formatTemperatureLogsForPrint');
        const { getTemperatureLogPrintStyles } =
          await import('../../../utils/temperatureLogPrintStyles');

        const contentHtml = formatTemperatureLogsForPrint({
          logs: logsToExport,
          equipment,
          dateRange,
        });
        const temperatureLogStyles = getTemperatureLogPrintStyles();

        let subtitle = 'Temperature Logs';
        if (dateRange) {
          subtitle = `Temperature Logs - ${dateRange.start} to ${dateRange.end}`;
        }

        const html = generatePrintTemplate({
          title: 'Temperature Monitoring',
          subtitle,
          content: `<style>${temperatureLogStyles}</style>${contentHtml}`,
          totalItems: logsToExport.length,
          customMeta: dateRange ? `Date Range: ${dateRange.start} - ${dateRange.end}` : undefined,
        });

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const dateStr = dateRange
          ? `${dateRange.start}_to_${dateRange.end}`
          : new Date().toISOString().split('T')[0];
        a.download = `temperature_logs_${dateStr}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showSuccess('Temperature logs exported as HTML');
      }
    } catch (err) {
      logger.error('[Temperature Logs] Export error:', err);
      showError('Failed to export temperature logs. Please try again.');
    } finally {
      setExportLoading(null);
    }
  };

  return {
    exportLoading,
    handlePrint,
    handleExport,
  };
}
