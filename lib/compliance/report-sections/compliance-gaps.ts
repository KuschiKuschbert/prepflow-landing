/**
 * generate Compliance Gaps
 * Extracted from report-generator.ts
 */

import { formatAustralianDate, getDaysUntilExpiry, getExpiryStatus, formatAUD } from '../australian-standards';
import type { ReportData, StatusColors, StatusLabels } from '../report-types';

export function generateComplianceGaps(gaps: ReportData['compliance_gaps']): string {
  if (!gaps || gaps.total_gaps === 0) {
    return `
      <div class="section">
        <div class="section-title">Compliance Gaps Analysis</div>
        <div class="alert alert-success">
          <strong>No compliance gaps identified</strong> - All requirements are met.
        </div>
      </div>
    `;
  }

  const severityColors: Record<string, string> = {
    critical: '#ef4444',
    high: '#f59e0b',
    medium: '#3b82f6',
    low: '#6b7280',
  };

  return `
    <div class="section">
      <div class="section-title">Compliance Gaps Analysis</div>
      <div class="alert alert-danger">
        <strong>${gaps.total_gaps} Compliance Gap(s) Identified</strong>
      </div>
      <p><strong>By Severity:</strong> Critical: ${gaps.critical} | High: ${gaps.high} | Medium: ${gaps.medium} | Low: ${gaps.low}</p>
      <table>
        <thead>
          <tr>
            <th>Severity</th>
            <th>Type</th>
            <th>Description</th>
            <th>Employee/Item</th>
          </tr>
        </thead>
        <tbody>
          ${gaps.gaps
            .map(gap => {
              const severityColor = severityColors[gap.severity] || '#6b7280';
              return `
              <tr>
                <td>
                  <span class="status-badge" style="background-color: ${severityColor}20; color: ${severityColor};">
                    ${gap.severity}
                  </span>
                </td>
                <td>${gap.type || 'N/A'}</td>
                <td>${gap.description || 'N/A'}</td>
                <td>${gap.employee_name ? `${gap.employee_name} (${gap.employee_role || 'N/A'})` : gap.missing_item || 'N/A'}</td>
              </tr>
            `;
            })
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}
