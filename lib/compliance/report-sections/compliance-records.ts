/**
 * generate Compliance Records
 * Extracted from report-generator.ts
 */

import { formatAustralianDate, getDaysUntilExpiry, getExpiryStatus } from '../australian-standards';
import type { ReportData } from '../report-types';

export function generateComplianceRecords(records: ReportData['compliance_records']): string {
  if (!records || records.all_records.length === 0) {
    return `
      <div class="section">
        <div class="section-title">Compliance Records</div>
        <p>No compliance records found.</p>
      </div>
    `;
  }

  return `
    <div class="section">
      <div class="section-title">Compliance Records</div>
      ${
        records.expired.length > 0
          ? `
        <div class="alert alert-danger">
          <strong>${records.expired.length} Expired Record(s):</strong>
          <ul style="margin: 10px 0 0 20px;">
            ${records.expired
              .map(r => {
                const typeName =
                  r.compliance_types?.type_name || r.compliance_types?.name || 'Unknown';
                return `
              <li>${r.document_name} - ${typeName} (Expired: ${formatAustralianDate(r.expiry_date)})</li>
            `;
              })
              .join('')}
          </ul>
        </div>
      `
          : ''
      }
      ${
        records.expiring_soon.length > 0
          ? `
        <div class="alert alert-warning">
          <strong>${records.expiring_soon.length} Record(s) Expiring Soon:</strong>
          <ul style="margin: 10px 0 0 20px;">
            ${records.expiring_soon
              .map(r => {
                const days = getDaysUntilExpiry(r.expiry_date);
                const typeName =
                  r.compliance_types?.type_name || r.compliance_types?.name || 'Unknown';
                return `
                <li>${r.document_name} - ${typeName} (Expires: ${formatAustralianDate(r.expiry_date)}, ${days} days)</li>
              `;
              })
              .join('')}
          </ul>
        </div>
      `
          : ''
      }
      <table>
        <thead>
          <tr>
            <th>Document Name</th>
            <th>Type</th>
            <th>Issue Date</th>
            <th>Expiry Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${records.active
            .map(r => {
              const status = getExpiryStatus(r.expiry_date);
              const statusColor =
                status === 'expired'
                  ? '#ef4444'
                  : status === 'expiring_soon'
                    ? '#f59e0b'
                    : '#10b981';
              return `
              <tr>
                <td>${r.document_name}</td>
                <td>${r.compliance_types?.type_name || r.compliance_types?.name || 'Unknown'}</td>
                <td>${formatAustralianDate(r.issue_date)}</td>
                <td>${formatAustralianDate(r.expiry_date)}</td>
                <td>
                  <span class="status-badge" style="background-color: ${statusColor}20; color: ${statusColor};">
                    ${status === 'expired' ? 'Expired' : status === 'expiring_soon' ? 'Expiring Soon' : 'Active'}
                  </span>
                </td>
              </tr>
            `;
            })
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}
