/**
 * Handle export for temperature logs.
 */
import type { ExportFormat } from '@/components/ui/ExportButton';
import { logger } from '@/lib/logger';
import {
  exportTemperatureLogsToCSV,
  printTemperatureLogs,
} from '../../../../../utils/temperatureLogExportUtils';
import type { TemperatureEquipment, TemperatureLog } from '../../../../../types';
import type { DateRange } from '../../../utils/calculateDateRange';
import { handleHTMLExportHelper } from './handleHTMLExport';

export async function handleExportHelper(
  format: ExportFormat,
  logsToExport: TemperatureLog[],
  equipment: TemperatureEquipment[],
  dateRange: DateRange | null,
  setExportLoading: (format: ExportFormat | null) => void,
  showSuccess: (message: string) => void,
  showError: (message: string) => void,
): Promise<void> {
  try {
    setExportLoading(format);
    if (format === 'csv') {
      exportTemperatureLogsToCSV({
        logs: logsToExport,
        equipment,
        dateRange: dateRange ?? undefined,
      });
      showSuccess('Temperature logs exported as CSV');
    } else if (format === 'pdf') {
      printTemperatureLogs({ logs: logsToExport, equipment, dateRange: dateRange ?? undefined });
      showSuccess(
        "Temperature logs opened for printing. Use your browser's print dialog to save as PDF.",
      );
    } else if (format === 'html') {
      await handleHTMLExportHelper(logsToExport, equipment, dateRange, showSuccess);
    }
  } catch (err) {
    logger.error('[Temperature Logs] Export error:', err);
    showError('Failed to export temperature logs. Give it another go, chef.');
  } finally {
    setExportLoading(null);
  }
}
