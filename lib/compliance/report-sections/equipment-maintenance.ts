/**
 * generate Equipment Maintenance
 * Extracted from report-generator.ts
 */

import { formatAustralianDate, getDaysUntilExpiry, getExpiryStatus, formatAUD } from '../australian-standards';
import type { ReportData, StatusColors, StatusLabels } from '../report-types';

export function generateEquipmentMaintenance(maintenance: ReportData['equipment_maintenance']): string {
  if (!maintenance || maintenance.total_records === 0) {
    return `
      <div class="section">
        <div class="section-title">Equipment Maintenance</div>
        <p>No equipment maintenance records found for the selected period.</p>
      </div>
    `;
  }

  return `
    <div class="section">
      <div class="section-title">Equipment Maintenance Records</div>
      <p><strong>Total Records:</strong> ${maintenance.total_records}</p>
      <p><strong>Critical Equipment:</strong> ${maintenance.critical_equipment.length} | <strong>Overdue Maintenance:</strong> ${maintenance.overdue_maintenance.length}</p>
      ${
        maintenance.overdue_maintenance.length > 0
          ? `
        <div class="alert alert-warning">
          <strong>${maintenance.overdue_maintenance.length} Overdue Maintenance Item(s):</strong>
          Equipment requiring immediate maintenance attention.
        </div>
      `
          : ''
      }
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Equipment</th>
            <th>Type</th>
            <th>Maintenance Type</th>
            <th>Service Provider</th>
            <th>Next Maintenance</th>
            <th>Critical</th>
          </tr>
        </thead>
        <tbody>
          ${maintenance.records
            .slice(0, 50)
            .map(
              record => `
            <tr>
              <td>${formatAustralianDate(record.maintenance_date)}</td>
              <td>${record.equipment_name || 'N/A'}</td>
              <td>${record.equipment_type || 'N/A'}</td>
              <td>${record.maintenance_type || 'N/A'}</td>
              <td>${record.service_provider || 'N/A'}</td>
              <td>${record.next_maintenance_date ? formatAustralianDate(record.next_maintenance_date) : 'N/A'}</td>
              <td>
                ${
                  record.is_critical
                    ? `
                  <span class="status-badge" style="background-color: #ef444420; color: #ef4444;">
                    Critical
                  </span>
                `
                    : 'No'
                }
              </td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}

