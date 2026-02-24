/**
 * HTML generation utilities for cleaning records formatting
 */

import { escapeHtml } from '@/lib/exports/template-utils';
import type { CleaningRecord, CleaningRecordExportData } from '../cleaning-records-export-types';
import { getAreaName, formatDate, formatFrequencyType } from './helpers';

/**
 * Generate empty state HTML
 *
 * @param {CleaningRecordExportData} data - Cleaning records data
 * @returns {string} HTML for empty state
 */
export function generateEmptyStateHTML(data: CleaningRecordExportData): string {
  const { dateRange, statusFilter } = data;

  return `
    <div class="cleaning-records-empty">
      <p>No cleaning records found for the selected period.</p>
      ${dateRange ? `<p><strong>Date Range:</strong> ${dateRange.start} - ${dateRange.end}</p>` : ''}
      ${statusFilter && statusFilter !== 'all' ? `<p><strong>Status Filter:</strong> ${statusFilter}</p>` : ''}
    </div>
  `;
}

/**
 * Generate meta information HTML
 *
 * @param {CleaningRecordExportData} data - Cleaning records data
 * @param {number} recordCount - Number of records
 * @returns {string} HTML for meta information
 */
export function generateMetaHTML(data: CleaningRecordExportData, recordCount: number): string {
  const { dateRange, statusFilter } = data;

  return `
    <div class="cleaning-records-meta">
      ${dateRange ? `<p><strong>Date Range:</strong> ${escapeHtml(dateRange.start)} - ${escapeHtml(dateRange.end)}</p>` : ''}
      <p><strong>Total Records:</strong> ${recordCount}</p>
      ${statusFilter && statusFilter !== 'all' ? `<p><strong>Status Filter:</strong> ${escapeHtml(statusFilter)}</p>` : ''}
    </div>
  `;
}

/**
 * Generate table rows HTML
 *
 * @param {CleaningRecord[]} records - Array of cleaning records
 * @returns {string} HTML for table rows
 */
export function generateTableRowsHTML(records: CleaningRecord[]): string {
  let html = '';

  records.forEach(({ task, date, status }) => {
    const areaName = getAreaName(task);
    const taskName = task.task_name || 'Unnamed Task';
    const frequency = formatFrequencyType(task.frequency_type);
    const completion = task.completions.find(c => c.completion_date === date);

    html += `
      <tr>
        <td>${escapeHtml(formatDate(date))}</td>
        <td class="area-name">${escapeHtml(areaName)}</td>
        <td class="task-name">${escapeHtml(taskName)}</td>
        <td>${escapeHtml(frequency)}</td>
        <td>
          <span class="status-badge" style="background-color: ${status.color}20; color: ${status.color};">
            ${escapeHtml(status.status)}
          </span>
        </td>
        <td>${status.completedDate ? escapeHtml(formatDate(status.completedDate)) : '-'}</td>
        <td>${escapeHtml(completion?.notes || '-')}</td>
      </tr>
    `;
  });

  return html;
}

/**
 * Generate table HTML
 *
 * @param {CleaningRecord[]} records - Array of cleaning records
 * @returns {string} HTML for table
 */
export function generateTableHTML(records: CleaningRecord[]): string {
  const tableRowsHTML = generateTableRowsHTML(records);

  return `
    <table class="cleaning-records-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Area</th>
          <th>Task</th>
          <th>Frequency</th>
          <th>Status</th>
          <th>Completed Date</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        ${tableRowsHTML}
      </tbody>
    </table>
  `;
}
