/**
 * generate Allergens
 * Extracted from report-generator.ts
 */

import { formatAustralianDate, getDaysUntilExpiry, getExpiryStatus, formatAUD } from '../australian-standards';
import type { ReportData, StatusColors, StatusLabels } from '../report-types';

export function generateAllergens(allergens: ReportData['allergens']): string {
  if (!allergens || allergens.total_records === 0) {
    return `
      <div class="section">
        <div class="section-title">Allergen Management</div>
        <p>No allergen records found for the selected period.</p>
      </div>
    `;
  }

  return `
    <div class="section">
      <div class="section-title">Allergen Management Records</div>
      <p><strong>Total Records:</strong> ${allergens.total_records}</p>
      ${
        allergens.inaccurate_declarations.length > 0
          ? `
        <div class="alert alert-danger">
          <strong>${allergens.inaccurate_declarations.length} Inaccurate Declaration(s):</strong>
          Allergen declarations found to be inaccurate.
        </div>
      `
          : ''
      }
      ${
        allergens.high_risk_items.length > 0
          ? `
        <div class="alert alert-warning">
          <strong>${allergens.high_risk_items.length} High Cross-Contamination Risk Item(s):</strong>
          Items identified with high risk of allergen cross-contamination.
        </div>
      `
          : ''
      }
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Record Type</th>
            <th>Item Name</th>
            <th>Allergens Present</th>
            <th>Allergens Declared</th>
            <th>Accurate</th>
            <th>Cross-Contamination Risk</th>
          </tr>
        </thead>
        <tbody>
          ${allergens.records
            .slice(0, 50)
            .map(record => {
              const accurateColor = record.is_accurate ? '#10b981' : '#ef4444';
              const riskColor =
                record.cross_contamination_risk === 'high'
                  ? '#ef4444'
                  : record.cross_contamination_risk === 'medium'
                    ? '#f59e0b'
                    : '#10b981';
              return `
              <tr>
                <td>${formatAustralianDate(record.record_date)}</td>
                <td>${record.record_type || 'N/A'}</td>
                <td>${record.item_name || 'N/A'}</td>
                <td>${Array.isArray(record.allergens_present) ? record.allergens_present.join(', ') : 'N/A'}</td>
                <td>${Array.isArray(record.allergens_declared) ? record.allergens_declared.join(', ') : 'N/A'}</td>
                <td>
                  <span class="status-badge" style="background-color: ${accurateColor}20; color: ${accurateColor};">
                    ${record.is_accurate ? 'Yes' : 'No'}
                  </span>
                </td>
                <td>
                  <span class="status-badge" style="background-color: ${riskColor}20; color: ${riskColor};">
                    ${record.cross_contamination_risk || 'N/A'}
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

