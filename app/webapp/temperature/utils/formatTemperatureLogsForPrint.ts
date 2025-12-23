/**
 * Format temperature logs data for print/export
 * Converts temperature logs into HTML table format with compliance status
 */

import { escapeHtml } from '@/lib/exports/template-utils';
import type { TemperatureLog, TemperatureEquipment } from '../types';
import { buildTemperatureLogsTableHTML } from './helpers/buildTemperatureLogsTableHTML';

export interface TemperatureLogExportData {
  logs: TemperatureLog[];
  equipment: TemperatureEquipment[];
  dateRange?: {
    start: string;
    end: string;
  };
}


/**
 * Format temperature logs data as HTML for print/export
 *
 * @param {TemperatureLogExportData} data - Temperature logs data
 * @returns {string} HTML content for temperature logs
 */
export function formatTemperatureLogsForPrint(data: TemperatureLogExportData): string {
  const { logs, equipment, dateRange } = data;

  if (logs.length === 0) {
    return `
      <div class="temperature-logs-empty">
        <p>No temperature logs found for the selected period.</p>
        ${dateRange ? `<p><strong>Date Range:</strong> ${dateRange.start} - ${dateRange.end}</p>` : ''}
      </div>
    `;
  }

  let html = '<div class="temperature-logs-content">';

  // Date range info if provided
  if (dateRange) {
    html += `
      <div class="temperature-logs-meta">
        <p><strong>Date Range:</strong> ${escapeHtml(dateRange.start)} - ${escapeHtml(dateRange.end)}</p>
        <p><strong>Total Logs:</strong> ${logs.length}</p>
      </div>
    `;
  }

  html += buildTemperatureLogsTableHTML(logs, equipment);
  html += '</div>';

  return html;
}
