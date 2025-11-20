/**
 * generate Temperature Logs
 * Extracted from report-generator.ts
 */

import {
  formatAustralianDate,
  getDaysUntilExpiry,
  getExpiryStatus,
  formatAUD,
} from '../australian-standards';
import type { ReportData, StatusColors, StatusLabels } from '../report-types';

export function generateTemperatureLogs(logs: ReportData['temperature_logs']): string {
  if (!logs || logs.logs.length === 0) {
    const dateRange = logs?.date_range || { start: '', end: '' };
    return `
      <div class="section">
        <div class="section-title">Temperature Monitoring</div>
        <p>No temperature logs found for the selected period.</p>
        <p><strong>Date Range:</strong> ${dateRange.start ? formatAustralianDate(dateRange.start) : 'N/A'} - ${dateRange.end ? formatAustralianDate(dateRange.end) : 'N/A'}</p>
      </div>
    `;
  }

  // Show summary and recent logs
  const recentLogs = logs.logs.slice(0, 50); // Show most recent 50

  return `
    <div class="section">
      <div class="section-title">Temperature Monitoring</div>
      <p><strong>Total Logs:</strong> ${logs.total_logs}</p>
      <p><strong>Date Range:</strong> ${formatAustralianDate(logs.date_range.start)} - ${formatAustralianDate(logs.date_range.end)}</p>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Location/Type</th>
            <th>Temperature</th>
            <th>Logged By</th>
          </tr>
        </thead>
        <tbody>
          ${recentLogs
            .map(
              log => `
            <tr>
              <td>${formatAustralianDate(log.log_date)}</td>
              <td>${log.log_time || 'N/A'}</td>
              <td>${log.location || log.temperature_type || 'N/A'}</td>
              <td>${log.temperature_celsius}°C</td>
              <td>${log.logged_by || 'N/A'}</td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
      </table>
      ${logs.logs.length > 50 ? `<p style="margin-top: 10px; color: #6b7280; font-size: 12px;">Showing most recent 50 of ${logs.total_logs} logs</p>` : ''}
    </div>
  `;
}
