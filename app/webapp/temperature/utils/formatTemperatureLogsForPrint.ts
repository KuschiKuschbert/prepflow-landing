/**
 * Format temperature logs data for print/export
 * Converts temperature logs into HTML table format with compliance status
 */

import { escapeHtml } from '@/lib/exports/template-utils';
import type { TemperatureLog, TemperatureEquipment } from '../types';

export interface TemperatureLogExportData {
  logs: TemperatureLog[];
  equipment: TemperatureEquipment[];
  dateRange?: {
    start: string;
    end: string;
  };
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
function getComplianceStatus(
  log: TemperatureLog,
  equipment: TemperatureEquipment[],
): { status: string; color: string } {
  const matched = equipment.find(eq => eq.name === log.location || eq.location === log.location);

  if (!matched || matched.min_temp_celsius === null || matched.max_temp_celsius === null) {
    return { status: 'Unknown', color: '#666' };
  }

  const temp = log.temperature_celsius;
  const minTemp = matched.min_temp_celsius;
  const maxTemp = matched.max_temp_celsius;

  if (temp < minTemp || temp > maxTemp) {
    return { status: 'Out of Range', color: 'var(--color-error)' };
  }

  return { status: 'Compliant', color: '#10b981' };
}

/**
 * Format date and time for display
 */
function formatDateTime(logDate: string, logTime: string): string {
  try {
    const date = new Date(`${logDate}T${logTime}`);
    return date.toLocaleString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return `${logDate} ${logTime}`;
  }
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

  html += `
    <table class="temperature-logs-table">
      <thead>
        <tr>
          <th>Date & Time</th>
          <th>Equipment</th>
          <th>Type</th>
          <th>Temperature</th>
          <th>Compliance</th>
          <th>Location</th>
          <th>Logged By</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
  `;

  // Sort logs by date/time (most recent first)
  const sortedLogs = [...logs].sort((a, b) => {
    const dateA = new Date(`${a.log_date}T${a.log_time}`).getTime();
    const dateB = new Date(`${b.log_date}T${b.log_time}`).getTime();
    return dateB - dateA;
  });

  sortedLogs.forEach(log => {
    const equipmentName = getEquipmentName(log, equipment);
    const compliance = getComplianceStatus(log, equipment);
    const dateTime = formatDateTime(log.log_date, log.log_time);

    html += `
      <tr>
        <td>${escapeHtml(dateTime)}</td>
        <td class="equipment-name">${escapeHtml(equipmentName)}</td>
        <td>${escapeHtml(log.temperature_type || '-')}</td>
        <td class="temperature-value">${log.temperature_celsius.toFixed(1)}°C</td>
        <td>
          <span class="compliance-badge" style="background-color: ${compliance.color}20; color: ${compliance.color};">
            ${escapeHtml(compliance.status)}
          </span>
        </td>
        <td>${escapeHtml(log.location || '-')}</td>
        <td>${escapeHtml(log.logged_by || '-')}</td>
        <td>${escapeHtml(log.notes || '-')}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  </div>
  `;

  return html;
}



