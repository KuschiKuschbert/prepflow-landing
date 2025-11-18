/**
 * generate H A C C P
 * Extracted from report-generator.ts
 */

import { formatAustralianDate, getDaysUntilExpiry, getExpiryStatus, formatAUD } from '../australian-standards';
import type { ReportData, StatusColors, StatusLabels } from '../report-types';

export function generateHACCP(haccp: ReportData['haccp']): string {
  if (!haccp || haccp.total_records === 0) {
    return `
      <div class="section">
        <div class="section-title">HACCP Records</div>
        <p>No HACCP records found for the selected period.</p>
      </div>
    `;
  }

  return `
    <div class="section">
      <div class="section-title">HACCP (Hazard Analysis Critical Control Points) Records</div>
      <p><strong>Total Records:</strong> ${haccp.total_records}</p>
      ${
        haccp.out_of_limit.length > 0
          ? `
        <div class="alert alert-danger">
          <strong>${haccp.out_of_limit.length} Out of Limit Record(s):</strong>
          Critical control points outside acceptable limits detected.
        </div>
      `
          : ''
      }
      <p><strong>Records by Step:</strong></p>
      <ul style="margin: 10px 0 0 20px;">
        ${Object.entries(haccp.by_step)
          .map(
            ([step, count]) => `
          <li>${step}: ${count}</li>
        `,
          )
          .join('')}
      </ul>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>HACCP Step</th>
            <th>Critical Control Point</th>
            <th>Hazard Type</th>
            <th>Target Value</th>
            <th>Actual Value</th>
            <th>Within Limit</th>
            <th>Monitored By</th>
          </tr>
        </thead>
        <tbody>
          ${haccp.records
            .slice(0, 50)
            .map(record => {
              const limitColor = record.is_within_limit ? '#10b981' : '#ef4444';
              return `
              <tr>
                <td>${formatAustralianDate(record.record_date)}</td>
                <td>${record.haccp_step || 'N/A'}</td>
                <td>${record.critical_control_point || 'N/A'}</td>
                <td>${record.hazard_type || 'N/A'}</td>
                <td>${record.target_value || 'N/A'}</td>
                <td>${record.actual_value || 'N/A'}</td>
                <td>
                  <span class="status-badge" style="background-color: ${limitColor}20; color: ${limitColor};">
                    ${record.is_within_limit ? 'Yes' : 'No'}
                  </span>
                </td>
                <td>${record.monitored_by || 'N/A'}</td>
              </tr>
            `;
            })
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}

