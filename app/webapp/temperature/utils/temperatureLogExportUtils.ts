/**
 * Temperature log export utilities
 * Provides print and CSV export functionality for temperature logs
 */

import { exportToCSV } from '@/lib/csv/csv-utils';
import { generatePrintTemplate } from '@/lib/exports/print-template';
import { logger } from '@/lib/logger';
import type { TemperatureEquipment, TemperatureLog } from '../types';
import {
  formatTemperatureLogsForPrint,
  type TemperatureLogExportData,
} from './formatTemperatureLogsForPrint';
import { getTemperatureLogPrintStyles } from './temperatureLogPrintStyles';

/**
 * Print temperature logs using unified template
 *
 * @param {TemperatureLogExportData} data - Temperature logs data
 * @returns {void} Opens print dialog
 */
export function printTemperatureLogs(data: TemperatureLogExportData): void {
  try {
    // Format temperature logs content as HTML
    const contentHtml = formatTemperatureLogsForPrint(data);

    // Get temperature log-specific styles
    const temperatureLogStyles = getTemperatureLogPrintStyles();

    // Build subtitle with date range if available
    let subtitle = 'Temperature Logs';
    if (data.dateRange) {
      subtitle = `Temperature Logs - ${data.dateRange.start} to ${data.dateRange.end}`;
    }

    // Generate full HTML using unified template
    const fullHtml = generatePrintTemplate({
      title: 'Temperature Monitoring',
      subtitle,
      content: `<style>${temperatureLogStyles}</style>${contentHtml}`,
      totalItems: data.logs.length,
      customMeta: data.dateRange
        ? `Date Range: ${data.dateRange.start} - ${data.dateRange.end}`
        : undefined,
    });

    // Open print window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      logger.warn('[Temperature Log Export] Failed to open print window - popup blocked?');
      return;
    }

    printWindow.document.write(fullHtml); // auditor:ignore
    printWindow.document.close();
    printWindow.focus();

    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print();
    }, 250);
  } catch (err) {
    logger.error('[Temperature Log Export] Print error:', err);
    throw err;
  }
}

/**
 * Get equipment name for a log
 */
function getEquipmentName(log: TemperatureLog, equipment: TemperatureEquipment[]): string {
  const matched = equipment.find(eq => eq.name === log.location || eq.location === log.location);
  return matched?.name || log.location || 'Unknown';
}

/**
 * Get compliance status for a log
 */
function getComplianceStatus(log: TemperatureLog, equipment: TemperatureEquipment[]): string {
  const matched = equipment.find(eq => eq.name === log.location || eq.location === log.location);

  if (!matched || matched.min_temp_celsius === null || matched.max_temp_celsius === null) {
    return 'Unknown';
  }

  const temp = log.temperature_celsius;
  const minTemp = matched.min_temp_celsius;
  const maxTemp = matched.max_temp_celsius;

  if (temp < minTemp || temp > maxTemp) {
    return 'Out of Range';
  }

  return 'Compliant';
}

/**
 * Export temperature logs to CSV
 *
 * @param {TemperatureLogExportData} data - Temperature logs data
 * @returns {void} Downloads CSV file
 */
export function exportTemperatureLogsToCSV(data: TemperatureLogExportData): void {
  try {
    // Prepare CSV data
    const csvData = data.logs.map(log => {
      const equipmentName = getEquipmentName(log, data.equipment);
      const compliance = getComplianceStatus(log, data.equipment);
      const dateTime = `${log.log_date} ${log.log_time}`;

      return {
        'Date & Time': dateTime,
        Equipment: equipmentName,
        Type: log.temperature_type || '',
        'Temperature (°C)': log.temperature_celsius.toFixed(1),
        Compliance: compliance,
        Location: log.location || '',
        'Logged By': log.logged_by || '',
        Notes: log.notes || '',
      };
    });

    const headers = [
      'Date & Time',
      'Equipment',
      'Type',
      'Temperature (°C)',
      'Compliance',
      'Location',
      'Logged By',
      'Notes',
    ];

    // Generate filename with date range if available
    const dateStr = new Date().toISOString().split('T')[0];
    let filename = `temperature_logs_${dateStr}.csv`;
    if (data.dateRange) {
      const startSafe = data.dateRange.start.replace(/[^a-z0-9]/gi, '_');
      const endSafe = data.dateRange.end.replace(/[^a-z0-9]/gi, '_');
      filename = `temperature_logs_${startSafe}_to_${endSafe}.csv`;
    }

    // Export CSV
    exportToCSV(csvData, headers, filename);
  } catch (err) {
    logger.error('[Temperature Log Export] CSV export error:', err);
    throw err;
  }
}
