/**
 * Format compliance records section for compliance report
 */

import { escapeHtml } from '@/lib/exports/template-utils';
import { formatDate } from './formatDate';
import type { ComplianceRecord } from '../../types';

/**
 * Format compliance records section
 *
 * @param {ComplianceRecord[]} complianceRecords - Array of compliance records
 * @returns {string} HTML for compliance records section
 */
export function formatComplianceRecordsSection(complianceRecords: ComplianceRecord[]): string {
  let html = `
    <div class="compliance-report-section">
      <h3>Compliance Records</h3>
      <table class="compliance-report-table">
        <thead>
          <tr>
            <th>Document Name</th>
            <th>Compliance Type</th>
            <th>Issue Date</th>
            <th>Expiry Date</th>
            <th>Status</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
  `;

  complianceRecords.forEach(record => {
    const statusColor =
      record.status === 'active' ? '#10b981' : record.status === 'expired' ? '#ef4444' : '#f59e0b';

    html += `
      <tr>
        <td><strong>${escapeHtml(record.document_name)}</strong></td>
        <td>${escapeHtml(record.compliance_types.name)}</td>
        <td>${formatDate(record.issue_date)}</td>
        <td>${formatDate(record.expiry_date)}</td>
        <td style="color: ${statusColor}; font-weight: 600;">${escapeHtml(record.status.toUpperCase())}</td>
        <td>${escapeHtml(record.notes || '-')}</td>
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
