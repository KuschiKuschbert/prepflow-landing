/**
 * generate Qualification Summary
 * Extracted from report-generator.ts
 */

import { formatAustralianDate, getDaysUntilExpiry } from '../australian-standards';
import type { ReportData } from '../report-types';

export function generateQualificationSummary(qualifications: ReportData['qualifications']): string {
  if (!qualifications) return '';

  return `
    <div class="section">
      <div class="section-title">Qualification Summary</div>
      <p><strong>Total Qualifications:</strong> ${qualifications.all_qualifications.length}</p>
      ${
        qualifications.expired.length > 0
          ? `
        <div class="alert alert-danger">
          <strong>${qualifications.expired.length} Expired Qualification(s):</strong>
          <ul style="margin: 10px 0 0 20px;">
            ${qualifications.expired
              .map(
                q => `
              <li>${q.employee_name} - ${q.qualification_types?.name || 'Unknown'} (Expired: ${formatAustralianDate(q.expiry_date)})</li>
            `,
              )
              .join('')}
          </ul>
        </div>
      `
          : ''
      }
      ${
        qualifications.expiring_soon.length > 0
          ? `
        <div class="alert alert-warning">
          <strong>${qualifications.expiring_soon.length} Qualification(s) Expiring Soon:</strong>
          <ul style="margin: 10px 0 0 20px;">
            ${qualifications.expiring_soon
              .map(q => {
                const days = getDaysUntilExpiry(q.expiry_date);
                return `
                <li>${q.employee_name} - ${q.qualification_types?.name || 'Unknown'} (Expires: ${formatAustralianDate(q.expiry_date)}, ${days} days)</li>
              `;
              })
              .join('')}
          </ul>
        </div>
      `
          : ''
      }
    </div>
  `;
}
