/**
 * Format compliance records for HTML/PDF export
 */

import type { ComplianceRecord } from '../../types';

/**
 * Format compliance records for HTML/PDF export
 *
 * @param {ComplianceRecord[]} records - Compliance records to format
 * @returns {string} HTML content
 */
export function formatComplianceRecordsForExport(records: ComplianceRecord[]): string {
  // Group by compliance type
  const recordsByType = records.reduce(
    (acc, record) => {
      const typeName = record.compliance_types.name;
      if (!acc[typeName]) {
        acc[typeName] = [];
      }
      acc[typeName].push(record);
      return acc;
    },
    {} as Record<string, ComplianceRecord[]>,
  );

  return Object.entries(recordsByType)
    .map(
      ([typeName, typeRecords]) => `
      <div style="margin-bottom: 32px; page-break-inside: avoid;">
        <h3 style="font-size: 20px; font-weight: 600; color: #ffffff; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(42, 42, 42, 0.8);">
          ${typeName}
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
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
                const statusColor =
                  record.status === 'active'
                    ? '#29E7CD'
                    : record.status === 'expired'
                      ? '#D925C7'
                      : '#FF6B00';

                return `
                  <tr style="border-bottom: 1px solid rgba(42, 42, 42, 0.5);">
                    <td style="padding: 10px; color: rgba(255, 255, 255, 0.9); font-weight: 500;">${record.document_name}</td>
                    <td style="padding: 10px; color: rgba(255, 255, 255, 0.8);">${issueDate}</td>
                    <td style="padding: 10px; color: rgba(255, 255, 255, 0.8);">${expiryDate}</td>
                    <td style="text-align: center; padding: 10px;">
                      <span style="color: ${statusColor}; font-weight: 600;">${record.status}</span>
                    </td>
                  </tr>
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
