/**
 * Export utilities for temperature logs
 * Supports CSV, PDF, HTML export formats
 */

import { exportToCSV } from '@/lib/csv/csv-utils';
import { generatePrintTemplate } from '@/lib/exports/print-template';
import type { TemperatureLog, TemperatureEquipment } from '../types';
import { formatTemperatureLogsForExport } from './helpers/formatTemperatureLogsForExport';

const CSV_HEADERS = [
  'Date',
  'Time',
  'Equipment',
  'Location',
  'Temperature Type',
  'Temperature (°C)',
  'Logged By',
  'Notes',
];

/**
 * Map temperature log to CSV row format
 *
 * @param {TemperatureLog} log - Temperature log to map
 * @param {TemperatureEquipment[]} equipment - Equipment list for lookup
 * @returns {Record<string, any>} CSV row object
 */
function mapTemperatureLogToCSVRow(
  log: TemperatureLog,
  equipment: TemperatureEquipment[],
): Record<string, any> {
  const eq = equipment.find(e => e.name === log.location || e.id === log.location);

  return {
    Date: log.log_date ? new Date(log.log_date).toLocaleDateString('en-AU') : '',
    Time: log.log_time || '',
    Equipment: eq?.name || log.location || '',
    Location: eq?.location || '',
    'Temperature Type': log.temperature_type || '',
    'Temperature (°C)': log.temperature_celsius || 0,
    'Logged By': log.logged_by || '',
    Notes: log.notes || '',
  };
}

/**
 * Export temperature logs to CSV
 *
 * @param {TemperatureLog[]} logs - Temperature logs to export
 * @param {TemperatureEquipment[]} equipment - Equipment list for lookup
 */
export function exportTemperatureLogsToCSV(
  logs: TemperatureLog[],
  equipment: TemperatureEquipment[],
): void {
  if (!logs || logs.length === 0) {
    return;
  }

  const csvData = logs.map(log => mapTemperatureLogToCSVRow(log, equipment));
  const filename = `temperature-logs-${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(csvData, CSV_HEADERS, filename);
}

/**
 * Export temperature logs to HTML
 *
 * @param {TemperatureLog[]} logs - Temperature logs to export
 * @param {TemperatureEquipment[]} equipment - Equipment list for lookup
 * @param {Object} dateRange - Optional date range
 */
export function exportTemperatureLogsToHTML(
  logs: TemperatureLog[],
  equipment: TemperatureEquipment[],
  dateRange?: { start: string; end: string },
): void {
  if (!logs || logs.length === 0) {
    return;
  }

  const content = formatTemperatureLogsForExport(logs, equipment);
  const subtitle = dateRange
    ? `Temperature Logs - ${new Date(dateRange.start).toLocaleDateString('en-AU')} to ${new Date(dateRange.end).toLocaleDateString('en-AU')}`
    : 'Temperature Logs';
  const html = generatePrintTemplate({
    title: 'Temperature Logs',
    subtitle,
    content,
    totalItems: logs.length,
  });

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `temperature-logs-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export temperature logs to PDF (via API)
 *
 * @param {TemperatureLog[]} logs - Temperature logs to export
 * @param {TemperatureEquipment[]} equipment - Equipment list for lookup
 * @param {Object} dateRange - Optional date range
 */
export async function exportTemperatureLogsToPDF(
  logs: TemperatureLog[],
  equipment: TemperatureEquipment[],
  dateRange?: { start: string; end: string },
): Promise<void> {
  if (!logs || logs.length === 0) {
    return;
  }

  const content = formatTemperatureLogsForExport(logs, equipment);
  const subtitle = dateRange
    ? `Temperature Logs - ${new Date(dateRange.start).toLocaleDateString('en-AU')} to ${new Date(dateRange.end).toLocaleDateString('en-AU')}`
    : 'Temperature Logs';
  const response = await fetch('/api/export/pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Temperature Logs',
      subtitle,
      content,
      totalItems: logs.length,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate PDF');
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `temperature-logs-${new Date().toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
