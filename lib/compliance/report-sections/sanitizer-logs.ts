/**
 * generate Sanitizer Logs
 * Extracted from report-generator.ts
 */

import { formatAustralianDate, getDaysUntilExpiry, getExpiryStatus, formatAUD } from '../australian-standards';
import type { ReportData, StatusColors, StatusLabels } from '../report-types';

export function generateSanitizerLogs(logs: ReportData['sanitizer_logs']): string {
  if (!logs || logs.total_logs === 0) {
    return `
      <div class="section">
        <div class="section-title">Sanitizer Logs</div>
        <p>No sanitizer logs found for the selected period.</p>
      </div>
    `;
  }

  return `
    <div class="section">
      <div class="section-title">Sanitizer Concentration Logs</div>
      <p><strong>Total Logs:</strong> ${logs.total_logs}</p>
      ${
        logs.out_of_range.length > 0
          ? `
        <div class="alert alert-danger">
          <strong>${logs.out_of_range.length} Out of Range Reading(s):</strong>
          Sanitizer concentration outside acceptable range detected.
        </div>
      `
          : ''
      }
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Type</th>
            <th>Concentration (ppm)</th>
            <th>Location</th>
            <th>Status</th>
            <th>Tested By</th>
          </tr>
        </thead>
        <tbody>
          ${logs.logs
            .slice(0, 50)
            .map(log => {
              const statusColor = log.is_within_range ? '#10b981' : '#ef4444';
              return `
              <tr>
                <td>${formatAustralianDate(log.log_date)}</td>
                <td>${log.log_time || 'N/A'}</td>
                <td>${log.sanitizer_type || 'N/A'}</td>
                <td>${log.concentration_ppm || 'N/A'}</td>
                <td>${log.location || 'N/A'}</td>
                <td>
                  <span class="status-badge" style="background-color: ${statusColor}20; color: ${statusColor};">
                    ${log.is_within_range ? 'In Range' : 'Out of Range'}
                  </span>
                </td>
                <td>${log.tested_by || 'N/A'}</td>
              </tr>
            `;
            })
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}

