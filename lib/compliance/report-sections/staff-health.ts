/**
 * generate Staff Health
 * Extracted from report-generator.ts
 */

import {
  formatAustralianDate,
  getDaysUntilExpiry,
  getExpiryStatus,
  formatAUD,
} from '../australian-standards';
import type { ReportData, StatusColors, StatusLabels } from '../report-types';

export function generateStaffHealth(health: ReportData['staff_health']): string {
  if (!health || health.total_declarations === 0) {
    return `
      <div class="section">
        <div class="section-title">Staff Health Declarations</div>
        <p>No health declarations found for the selected period.</p>
      </div>
    `;
  }

  return `
    <div class="section">
      <div class="section-title">Staff Health Declarations</div>
      <p><strong>Total Declarations:</strong> ${health.total_declarations}</p>
      <p><strong>Unhealthy Reports:</strong> ${health.unhealthy_count} | <strong>Excluded from Work:</strong> ${health.excluded_count}</p>
      ${
        health.excluded_count > 0
          ? `
        <div class="alert alert-warning">
          <strong>${health.excluded_count} staff member(s) excluded from work</strong> due to health concerns.
        </div>
      `
          : ''
      }
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Employee</th>
            <th>Healthy</th>
            <th>Symptoms</th>
            <th>Excluded</th>
            <th>Exclusion End</th>
          </tr>
        </thead>
        <tbody>
          ${health.declarations
            .slice(0, 50)
            .map(decl => {
              const healthyColor = decl.is_healthy ? '#10b981' : '#ef4444';
              return `
              <tr>
                <td>${formatAustralianDate(decl.declaration_date)}</td>
                <td>${decl.employees?.full_name || decl.declared_by || 'N/A'}</td>
                <td>
                  <span class="status-badge" style="background-color: ${healthyColor}20; color: ${healthyColor};">
                    ${decl.is_healthy ? 'Yes' : 'No'}
                  </span>
                </td>
                <td>${decl.has_symptoms ? decl.symptoms_description || 'Yes' : 'No'}</td>
                <td>${decl.excluded_from_work ? 'Yes' : 'No'}</td>
                <td>${decl.exclusion_end_date ? formatAustralianDate(decl.exclusion_end_date) : 'N/A'}</td>
              </tr>
            `;
            })
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}
