/**
 * generate Procedures
 * Extracted from report-generator.ts
 */

import {
  formatAustralianDate,
  getDaysUntilExpiry,
  getExpiryStatus,
  formatAUD,
} from '../australian-standards';
import type { ReportData, StatusColors, StatusLabels } from '../report-types';

export function generateProcedures(procedures: ReportData['procedures']): string {
  if (!procedures || procedures.total_procedures === 0) {
    return `
      <div class="section">
        <div class="section-title">Food Safety Procedures</div>
        <p>No food safety procedures documented.</p>
      </div>
    `;
  }

  return `
    <div class="section">
      <div class="section-title">Food Safety Procedures Documentation</div>
      <p><strong>Total Procedures:</strong> ${procedures.total_procedures}</p>
      ${
        procedures.overdue_reviews.length > 0
          ? `
        <div class="alert alert-warning">
          <strong>${procedures.overdue_reviews.length} Procedure(s) Overdue for Review:</strong>
          <ul style="margin: 10px 0 0 20px;">
            ${procedures.overdue_reviews
              .map(
                p => `
              <li>${p.procedure_name} - Last reviewed: ${p.last_reviewed_date ? formatAustralianDate(p.last_reviewed_date) : 'Never'}</li>
            `,
              )
              .join('')}
          </ul>
        </div>
      `
          : ''
      }
      <p><strong>Procedures by Type:</strong></p>
      <ul style="margin: 10px 0 0 20px;">
        ${Object.entries(procedures.by_type)
          .map(
            ([type, count]) => `
          <li>${type}: ${count}</li>
        `,
          )
          .join('')}
      </ul>
      <table>
        <thead>
          <tr>
            <th>Procedure Name</th>
            <th>Type</th>
            <th>Last Reviewed</th>
            <th>Next Review</th>
            <th>Reviewed By</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${procedures.procedures
            .map(proc => {
              const reviewColor =
                proc.next_review_date && new Date(proc.next_review_date) < new Date()
                  ? '#ef4444'
                  : '#10b981';
              return `
              <tr>
                <td><strong>${proc.procedure_name || 'N/A'}</strong></td>
                <td>${proc.procedure_type || 'N/A'}</td>
                <td>${proc.last_reviewed_date ? formatAustralianDate(proc.last_reviewed_date) : 'Never'}</td>
                <td>${proc.next_review_date ? formatAustralianDate(proc.next_review_date) : 'N/A'}</td>
                <td>${proc.reviewed_by || 'N/A'}</td>
                <td>
                  <span class="status-badge" style="background-color: ${reviewColor}20; color: ${reviewColor};">
                    ${proc.is_active ? 'Active' : 'Inactive'}
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
