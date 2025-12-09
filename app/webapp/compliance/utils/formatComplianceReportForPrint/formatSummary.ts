/**
 * Format summary section for compliance report
 */

import type { ComplianceRecord } from '../../types';
import type { TemperatureLog } from '@/app/webapp/temperature/types';
import type { TaskWithCompletions } from '@/lib/cleaning/completion-logic';

/**
 * Format summary section
 *
 * @param {Object} data - Compliance report data
 * @param {ComplianceRecord[]} data.complianceRecords - Array of compliance records
 * @param {TemperatureLog[]} data.temperatureLogs - Array of temperature logs
 * @param {TaskWithCompletions[]} data.cleaningTasks - Array of cleaning tasks
 * @returns {string} HTML for summary section
 */
export function formatSummarySection(data: {
  complianceRecords?: ComplianceRecord[];
  temperatureLogs?: TemperatureLog[];
  cleaningTasks?: TaskWithCompletions[];
}): string {
  const { complianceRecords, temperatureLogs, cleaningTasks } = data;

  return `
    <div class="compliance-report-summary">
      <h3>Report Summary</h3>
      <ul>
        ${
          complianceRecords && complianceRecords.length > 0
            ? `<li><strong>Compliance Records:</strong> ${complianceRecords.length} total
              (${complianceRecords.filter(r => r.status === 'active').length} active,
              ${complianceRecords.filter(r => r.status === 'expired').length} expired)</li>`
            : ''
        }
        ${
          temperatureLogs && temperatureLogs.length > 0
            ? `<li><strong>Temperature Logs:</strong> ${temperatureLogs.length} entries recorded</li>`
            : ''
        }
        ${
          cleaningTasks && cleaningTasks.length > 0
            ? `<li><strong>Cleaning Tasks:</strong> ${cleaningTasks.length} tasks tracked</li>`
            : ''
        }
        <li><strong>Report Generated:</strong> ${new Date().toLocaleDateString('en-AU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}</li>
      </ul>
    </div>
  `;
}
