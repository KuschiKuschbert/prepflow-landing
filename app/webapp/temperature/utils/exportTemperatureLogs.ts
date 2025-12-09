/**
 * Export utilities for temperature logs
 * Supports CSV, PDF, HTML export formats
 */

import { exportToCSV } from '@/lib/csv/csv-utils';
import { generatePrintTemplate } from '@/lib/exports/print-template';
import type { TemperatureLog, TemperatureEquipment } from '../types';

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
 * Format temperature logs for HTML/PDF export
 *
 * @param {TemperatureLog[]} logs - Temperature logs to format
 * @param {TemperatureEquipment[]} equipment - Equipment list for lookup
 * @returns {string} HTML content
 */
function formatTemperatureLogsForExport(
  logs: TemperatureLog[],
  equipment: TemperatureEquipment[],
): string {
  // Group by equipment
  const logsByEquipment = logs.reduce(
    (acc, log) => {
      const eq = equipment.find(e => e.name === log.location || e.id === log.location);
      const key = eq?.name || log.location || 'Unknown';
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(log);
      return acc;
    },
    {} as Record<string, TemperatureLog[]>,
  );

  return Object.entries(logsByEquipment)
    .map(
      ([equipmentName, equipmentLogs]) => `
      <div style="margin-bottom: 32px; page-break-inside: avoid;">
        <h3 style="font-size: 20px; font-weight: 600; color: #ffffff; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(42, 42, 42, 0.8);">
          ${equipmentName}
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: rgba(42, 42, 42, 0.5);">
              <th style="text-align: left; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Date</th>
              <th style="text-align: left; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Time</th>
              <th style="text-align: left; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Type</th>
              <th style="text-align: right; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Temperature</th>
            </tr>
          </thead>
          <tbody>
            ${equipmentLogs
              .sort((a, b) => {
                const dateCompare = a.log_date.localeCompare(b.log_date);
                return dateCompare !== 0 ? dateCompare : a.log_time.localeCompare(b.log_time);
              })
              .map(
                log => `
                <tr style="border-bottom: 1px solid rgba(42, 42, 42, 0.5);">
                  <td style="padding: 10px; color: rgba(255, 255, 255, 0.9);">${new Date(log.log_date).toLocaleDateString('en-AU')}</td>
                  <td style="padding: 10px; color: rgba(255, 255, 255, 0.8);">${log.log_time}</td>
                  <td style="padding: 10px; color: rgba(255, 255, 255, 0.8);">${log.temperature_type}</td>
                  <td style="text-align: right; padding: 10px; color: rgba(255, 255, 255, 0.9); font-weight: 600;">${log.temperature_celsius.toFixed(1)}°C</td>
                </tr>
              `,
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `,
    )
    .join('');
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
