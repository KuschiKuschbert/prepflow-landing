/**
 * generate Waste Management
 * Extracted from report-generator.ts
 */

import { formatAustralianDate } from '../australian-standards';
import type { ReportData } from '../report-types';

export function generateWasteManagement(waste: ReportData['waste_management']): string {
  if (!waste || waste.total_logs === 0) {
    return `
      <div class="section">
        <div class="section-title">Waste Management</div>
        <p>No waste management logs found for the selected period.</p>
      </div>
    `;
  }

  return `
    <div class="section">
      <div class="section-title">Waste Management Logs</div>
      <p><strong>Total Logs:</strong> ${waste.total_logs}</p>
      <p><strong>By Type:</strong></p>
      <ul style="margin: 10px 0 0 20px;">
        ${Object.entries(waste.by_type)
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
            <th>Date</th>
            <th>Waste Type</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Disposal Method</th>
            <th>Contractor</th>
            <th>Logged By</th>
          </tr>
        </thead>
        <tbody>
          ${waste.logs
            .slice(0, 50)
            .map(
              log => `
            <tr>
              <td>${formatAustralianDate(log.log_date)}</td>
              <td>${log.waste_type || 'N/A'}</td>
              <td>${log.quantity || 'N/A'}</td>
              <td>${log.unit || 'N/A'}</td>
              <td>${log.disposal_method || 'N/A'}</td>
              <td>${log.contractor_name || 'N/A'}</td>
              <td>${log.logged_by || 'N/A'}</td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}
