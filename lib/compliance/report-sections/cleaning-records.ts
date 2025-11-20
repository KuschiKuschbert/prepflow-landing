/**
 * generate Cleaning Records
 * Extracted from report-generator.ts
 */

import {
  formatAustralianDate,
  getDaysUntilExpiry,
  getExpiryStatus,
  formatAUD,
} from '../australian-standards';
import type { ReportData, StatusColors, StatusLabels } from '../report-types';

export function generateCleaningRecords(records: ReportData['cleaning_records']): string {
  if (!records || records.tasks.length === 0) {
    const dateRange = records?.date_range || { start: '', end: '' };
    return `
      <div class="section">
        <div class="section-title">Cleaning Records</div>
        <p>No cleaning tasks found for the selected period.</p>
        <p><strong>Date Range:</strong> ${dateRange.start ? formatAustralianDate(dateRange.start) : 'N/A'} - ${dateRange.end ? formatAustralianDate(dateRange.end) : 'N/A'}</p>
      </div>
    `;
  }

  const recentTasks = records.tasks.slice(0, 50); // Show most recent 50

  return `
    <div class="section">
      <div class="section-title">Cleaning Records</div>
      <p><strong>Total Tasks:</strong> ${records.total_tasks}</p>
      <p><strong>Completed:</strong> ${records.completed.length} | <strong>Pending:</strong> ${records.pending.length} | <strong>Overdue:</strong> ${records.overdue.length}</p>
      <p><strong>Date Range:</strong> ${formatAustralianDate(records.date_range.start)} - ${formatAustralianDate(records.date_range.end)}</p>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Area</th>
            <th>Status</th>
            <th>Completed Date</th>
          </tr>
        </thead>
        <tbody>
          ${recentTasks
            .map(task => {
              const statusColor =
                task.status === 'completed'
                  ? '#10b981'
                  : task.status === 'overdue'
                    ? '#ef4444'
                    : '#f59e0b';
              return `
              <tr>
                <td>${formatAustralianDate(task.assigned_date)}</td>
                <td>${task.cleaning_areas?.name || 'Unknown'}</td>
                <td>
                  <span class="status-badge" style="background-color: ${statusColor}20; color: ${statusColor};">
                    ${task.status}
                  </span>
                </td>
                <td>${task.completed_date ? formatAustralianDate(task.completed_date) : 'N/A'}</td>
              </tr>
            `;
            })
            .join('')}
        </tbody>
      </table>
      ${records.tasks.length > 50 ? `<p style="margin-top: 10px; color: #6b7280; font-size: 12px;">Showing most recent 50 of ${records.total_tasks} tasks</p>` : ''}
    </div>
  `;
}
