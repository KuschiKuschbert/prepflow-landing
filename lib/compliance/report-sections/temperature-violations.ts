/**
 * generate Temperature Violations
 * Extracted from report-generator.ts
 */

import { formatAustralianDate } from '../australian-standards';
import type { ReportData } from '../report-types';

export function generateTemperatureViolations(
  violations: ReportData['temperature_violations'],
): string {
  if (!violations || violations.total_violations === 0) {
    return `
      <div class="section">
        <div class="section-title">Temperature Violations</div>
        <div class="alert alert-success">
          <strong>No temperature violations detected</strong> - All temperature logs are within safe ranges.
        </div>
      </div>
    `;
  }

  return `
    <div class="section">
      <div class="section-title">Temperature Violations Analysis</div>
      <div class="alert alert-danger">
        <strong>${violations.total_violations} Temperature Violation(s) Detected</strong>
      </div>
      <p><strong>Summary:</strong></p>
      <ul style="margin: 10px 0 0 20px;">
        <li>Below Minimum: ${violations.violation_summary.below_minimum}</li>
        <li>Above Maximum: ${violations.violation_summary.above_maximum}</li>
        <li>Danger Zone (5°C-60°C): ${violations.violation_summary.danger_zone_count}</li>
      </ul>
      ${
        violations.out_of_range.length > 0
          ? `
        <h4 style="margin-top: 20px; margin-bottom: 10px;">Out of Range Violations</h4>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Location</th>
              <th>Temperature</th>
              <th>Threshold</th>
              <th>Deviation</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            ${violations.out_of_range
              .slice(0, 50)
              .map(
                v => `
              <tr>
                <td>${formatAustralianDate(v.log_date)}</td>
                <td>${v.log_time || 'N/A'}</td>
                <td>${v.location || v.temperature_type || 'N/A'}</td>
                <td>${v.temperature_celsius}°C</td>
                <td>${v.threshold}°C</td>
                <td>${v.deviation}°C</td>
                <td>
                  <span class="status-badge" style="background-color: #ef444420; color: #ef4444;">
                    ${v.violation_type === 'below_minimum' ? 'Below Min' : 'Above Max'}
                  </span>
                </td>
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>
      `
          : ''
      }
      ${
        violations.danger_zone.length > 0
          ? `
        <h4 style="margin-top: 20px; margin-bottom: 10px;">Danger Zone Violations (5°C-60°C)</h4>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Location</th>
              <th>Temperature</th>
              <th>Logged By</th>
            </tr>
          </thead>
          <tbody>
            ${violations.danger_zone
              .slice(0, 50)
              .map(
                v => `
              <tr>
                <td>${formatAustralianDate(v.log_date)}</td>
                <td>${v.log_time || 'N/A'}</td>
                <td>${v.location || v.temperature_type || 'N/A'}</td>
                <td>${v.temperature_celsius}°C</td>
                <td>${v.logged_by || 'N/A'}</td>
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>
      `
          : ''
      }
    </div>
  `;
}
