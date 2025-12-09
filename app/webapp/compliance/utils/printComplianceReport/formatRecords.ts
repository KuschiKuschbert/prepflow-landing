/**
 * Format records by type for compliance report print
 */

import type { ComplianceRecord } from '../../types';

/**
 * Get status color for compliance record
 *
 * @param {string} status - Record status
 * @returns {string} Color hex code
 */
function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
      return '#29E7CD';
    case 'expired':
      return '#D925C7';
    case 'pending_renewal':
      return '#FF6B00';
    default:
      return 'rgba(255, 255, 255, 0.7)';
  }
}

/**
 * Get status label for compliance record
 *
 * @param {string} status - Record status
 * @returns {string} Human-readable status label
 */
function getStatusLabel(status: string): string {
  switch (status) {
    case 'active':
      return 'Active';
    case 'expired':
      return 'Expired';
    case 'pending_renewal':
      return 'Pending Renewal';
    default:
      return status;
  }
}

/**
 * Format records grouped by type
 *
 * @param {Record<string, ComplianceRecord[]>} recordsByType - Records grouped by type
 * @returns {string} HTML content for records by type
 */
export function formatComplianceRecordsByType(
  recordsByType: Record<string, ComplianceRecord[]>,
): string {
  return Object.entries(recordsByType)
    .map(
      ([typeName, typeRecords]) => `
      <div style="margin-bottom: 32px; page-break-inside: avoid;">
        <h3 style="font-size: 20px; font-weight: 600; color: #ffffff; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(42, 42, 42, 0.8);">
          ${typeName}
          <span style="font-size: 14px; font-weight: 400; color: rgba(255, 255, 255, 0.6); margin-left: 8px;">(${typeRecords.length})</span>
        </h3>

        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <thead>
            <tr style="background: rgba(42, 42, 42, 0.5);">
              <th style="text-align: left; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Document</th>
              <th style="text-align: left; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Issue Date</th>
              <th style="text-align: left; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Expiry Date</th>
              <th style="text-align: center; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Status</th>
            </tr>
          </thead>
          <tbody>
            ${typeRecords
              .sort((a, b) => {
                const dateA = a.expiry_date ? new Date(a.expiry_date).getTime() : 0;
                const dateB = b.expiry_date ? new Date(b.expiry_date).getTime() : 0;
                return dateB - dateA;
              })
              .map(record => {
                const issueDate = record.issue_date
                  ? new Date(record.issue_date).toLocaleDateString('en-AU')
                  : 'N/A';
                const expiryDate = record.expiry_date
                  ? new Date(record.expiry_date).toLocaleDateString('en-AU')
                  : 'N/A';
                const statusColor = getStatusColor(record.status);
                const statusLabel = getStatusLabel(record.status);

                return `
                  <tr style="border-bottom: 1px solid rgba(42, 42, 42, 0.5);">
                    <td style="padding: 10px; color: rgba(255, 255, 255, 0.9); font-weight: 500;">${record.document_name}</td>
                    <td style="padding: 10px; color: rgba(255, 255, 255, 0.8);">${issueDate}</td>
                    <td style="padding: 10px; color: rgba(255, 255, 255, 0.8);">${expiryDate}</td>
                    <td style="text-align: center; padding: 10px;">
                      <span style="color: ${statusColor}; font-weight: 600;">${statusLabel}</span>
                    </td>
                  </tr>
                  ${
                    record.notes
                      ? `
                    <tr>
                      <td colspan="4" style="padding: 8px 10px; padding-top: 0; color: rgba(255, 255, 255, 0.6); font-size: 13px; font-style: italic;">
                        ${record.notes}
                      </td>
                    </tr>
                  `
                      : ''
                  }
                `;
              })
              .join('')}
          </tbody>
        </table>
      </div>
    `,
    )
    .join('');
}
