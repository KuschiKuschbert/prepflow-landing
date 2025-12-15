/**
 * Handle print for temperature logs.
 */
import { logger } from '@/lib/logger';
import type { TemperatureEquipment, TemperatureLog } from '../../../../types';
import { printTemperatureLogs } from '../../../../../utils/temperatureLogExportUtils';
import type { DateRange } from '../../../utils/calculateDateRange';

export function handlePrintHelper(
  logsToExport: TemperatureLog[],
  equipment: TemperatureEquipment[],
  dateRange: DateRange | null,
  showSuccess: (message: string) => void,
  showError: (message: string) => void,
): void {
  try {
    printTemperatureLogs({ logs: logsToExport, equipment, dateRange });
    showSuccess('Temperature logs opened for printing');
  } catch (err) {
    logger.error('[Temperature Logs] Print error:', err);
    showError('Failed to print temperature logs. Give it another go, chef.');
  }
}
