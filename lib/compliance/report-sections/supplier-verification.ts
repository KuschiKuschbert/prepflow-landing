/**
 * generate Supplier Verification
 * Extracted from report-generator.ts
 */

import { formatAustralianDate } from '../australian-standards';
import type { ReportData } from '../report-types';

export function generateSupplierVerification(
  verification: ReportData['supplier_verification'],
): string {
  if (!verification || verification.total_verifications === 0) {
    return `
      <div class="section">
        <div class="section-title">Supplier Verification</div>
        <p>No supplier verification records found for the selected period.</p>
      </div>
    `;
  }

  return `
    <div class="section">
      <div class="section-title">Supplier Verification Records</div>
      <p><strong>Total Verifications:</strong> ${verification.total_verifications}</p>
      ${
        verification.invalid_certificates.length > 0
          ? `
        <div class="alert alert-danger">
          <strong>${verification.invalid_certificates.length} Invalid Certificate(s):</strong>
          Supplier certificates found to be invalid.
        </div>
      `
          : ''
      }
      ${
        verification.expired_certificates.length > 0
          ? `
        <div class="alert alert-warning">
          <strong>${verification.expired_certificates.length} Expired Certificate(s):</strong>
          Supplier certificates have expired and require renewal.
        </div>
      `
          : ''
      }
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Supplier</th>
            <th>Verification Type</th>
            <th>Certificate Type</th>
            <th>Certificate Number</th>
            <th>Expiry Date</th>
            <th>Valid</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          ${verification.verifications
            .slice(0, 50)
            .map(ver => {
              const validColor = ver.is_valid ? '#10b981' : '#ef4444';
              const resultColor =
                ver.verification_result === 'approved'
                  ? '#10b981'
                  : ver.verification_result === 'rejected'
                    ? '#ef4444'
                    : '#f59e0b';
              return `
              <tr>
                <td>${formatAustralianDate(ver.verification_date)}</td>
                <td>${ver.suppliers?.supplier_name || 'N/A'}</td>
                <td>${ver.verification_type || 'N/A'}</td>
                <td>${ver.certificate_type || 'N/A'}</td>
                <td>${ver.certificate_number || 'N/A'}</td>
                <td>${ver.expiry_date ? formatAustralianDate(ver.expiry_date) : 'N/A'}</td>
                <td>
                  <span class="status-badge" style="background-color: ${validColor}20; color: ${validColor};">
                    ${ver.is_valid ? 'Yes' : 'No'}
                  </span>
                </td>
                <td>
                  <span class="status-badge" style="background-color: ${resultColor}20; color: ${resultColor};">
                    ${ver.verification_result || 'N/A'}
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
