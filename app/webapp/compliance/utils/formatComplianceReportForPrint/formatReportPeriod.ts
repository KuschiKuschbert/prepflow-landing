/**
 * Format report period section for compliance report
 */

import { formatDate } from './formatDate';

/**
 * Format report period section
 *
 * @param {Object} reportPeriod - Report period data
 * @param {string} reportPeriod.start - Start date
 * @param {string} reportPeriod.end - End date
 * @returns {string} HTML for report period section
 */
export function formatReportPeriodSection(reportPeriod: { start: string; end: string }): string {
  return `
    <div class="compliance-report-section">
      <h3>Report Period</h3>
      <p><strong>Start Date:</strong> ${formatDate(reportPeriod.start)}</p>
      <p><strong>End Date:</strong> ${formatDate(reportPeriod.end)}</p>
    </div>
  `;
}
