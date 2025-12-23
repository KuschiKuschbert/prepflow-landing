/**
 * Print utility for temperature logs
 * Formats temperature logs with charts and data tables
 * Uses unified print template with Cyber Carrot branding
 */

import { printWithTemplate } from '@/lib/exports/print-template';
import type { TemperatureLog, TemperatureEquipment } from '../types';
import { buildTemperatureLogsPrintHTML } from './helpers/buildTemperatureLogsPrintHTML';

export interface PrintTemperatureLogsOptions {
  logs: TemperatureLog[];
  equipment: TemperatureEquipment[];
  dateRange?: {
    start: string;
    end: string;
  };
  equipmentFilter?: string;
}

/**
 * Format temperature logs for printing
 *
 * @param {PrintTemperatureLogsOptions} options - Temperature logs print options
 * @returns {void} Opens print dialog
 */
export function printTemperatureLogs({
  logs,
  equipment,
  dateRange,
  equipmentFilter,
}: PrintTemperatureLogsOptions): void {
  // Group logs by equipment
  const logsByEquipment = logs.reduce(
    (acc, log) => {
      const eq = equipment.find(e => e.name === log.location || e.id === log.location);
      const key = eq?.name || log.location || 'Unknown';
      if (!acc[key]) {
        acc[key] = {
          equipment: eq,
          logs: [],
        };
      }
      acc[key].logs.push(log);
      return acc;
    },
    {} as Record<string, { equipment?: TemperatureEquipment; logs: TemperatureLog[] }>,
  );

  const content = buildTemperatureLogsPrintHTML({ logs, logsByEquipment, dateRange });

  const subtitle = equipmentFilter
    ? `Temperature Logs - ${equipmentFilter}`
    : dateRange
      ? `Temperature Logs - ${new Date(dateRange.start).toLocaleDateString('en-AU')} to ${new Date(dateRange.end).toLocaleDateString('en-AU')}`
      : 'Temperature Logs';

  printWithTemplate({
    title: 'Temperature Logs',
    subtitle,
    content,
    totalItems: logs.length,
  });
}
