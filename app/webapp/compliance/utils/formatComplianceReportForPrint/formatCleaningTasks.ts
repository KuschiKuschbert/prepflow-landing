/**
 * Format cleaning tasks section for compliance report
 */

import { escapeHtml } from '@/lib/exports/template-utils';
import { formatDate } from './formatDate';
import type { TaskWithCompletions } from '@/lib/cleaning/completion-logic';

/**
 * Format cleaning tasks section
 *
 * @param {TaskWithCompletions[]} cleaningTasks - Array of cleaning tasks
 * @returns {string} HTML for cleaning tasks section
 */
export function formatCleaningTasksSection(cleaningTasks: TaskWithCompletions[]): string {
  let html = `
    <div class="compliance-report-section">
      <h3>Cleaning Schedule Compliance</h3>
      <table class="compliance-report-table">
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Area</th>
            <th>Frequency</th>
            <th>Last Completed</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
  `;

  cleaningTasks.forEach(task => {
    const areaName = task.cleaning_areas?.area_name || 'N/A';
    const frequency = task.frequency_type || 'N/A';
    const lastCompletion =
      task.completions && task.completions.length > 0
        ? formatDate(task.completions[0].completion_date)
        : 'Never';

    let status = 'Pending';
    let statusColor = '#f59e0b';
    if (task.completions && task.completions.length > 0) {
      const latestCompletion = task.completions[0];
      const completionDate = new Date(latestCompletion.completion_date);
      const daysSince = Math.floor((Date.now() - completionDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysSince <= 7) {
        status = 'Current';
        statusColor = '#10b981';
      } else if (daysSince <= 30) {
        status = 'Due Soon';
        statusColor = '#f59e0b';
      } else {
        status = 'Overdue';
        statusColor = '#ef4444';
      }
    }

    html += `
      <tr>
        <td><strong>${escapeHtml(task.task_name || 'Unnamed Task')}</strong></td>
        <td>${escapeHtml(areaName)}</td>
        <td>${escapeHtml(frequency)}</td>
        <td>${lastCompletion}</td>
        <td style="color: ${statusColor}; font-weight: 600;">${status}</td>
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
