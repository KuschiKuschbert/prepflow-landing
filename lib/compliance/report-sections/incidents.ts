/**
 * generate Incidents
 * Extracted from report-generator.ts
 */

import { formatAustralianDate, getDaysUntilExpiry, getExpiryStatus, formatAUD } from '../australian-standards';
import type { ReportData, StatusColors, StatusLabels } from '../report-types';

export function generateIncidents(incidents: ReportData['incidents']): string {
  if (!incidents || incidents.total_incidents === 0) {
    return `
      <div class="section">
        <div class="section-title">Incident Reports</div>
        <div class="alert alert-success">
          <strong>No incidents reported</strong> during the selected period.
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
      <div class="section-title">Incident Reports</div>
      <p><strong>Total Incidents:</strong> ${incidents.total_incidents}</p>
      <p><strong>By Severity:</strong> Critical: ${incidents.by_severity.critical} | High: ${incidents.by_severity.high} | Medium: ${incidents.by_severity.medium} | Low: ${incidents.by_severity.low}</p>
      <p><strong>By Status:</strong> Open: ${incidents.by_status.open} | Investigating: ${incidents.by_status.investigating} | Resolved: ${incidents.by_status.resolved} | Closed: ${incidents.by_status.closed}</p>
      ${
        incidents.unresolved.length > 0
          ? `
        <div class="alert alert-warning">
          <strong>${incidents.unresolved.length} Unresolved Incident(s):</strong>
          <ul style="margin: 10px 0 0 20px;">
            ${incidents.unresolved
              .map(
                i => `
              <li>${i.incident_type} - ${i.description.substring(0, 100)}${i.description.length > 100 ? '...' : ''}</li>
            `,
              )
              .join('')}
          </ul>
        </div>
      `
          : ''
      }
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Severity</th>
            <th>Description</th>
            <th>Status</th>
            <th>Corrective Action</th>
          </tr>
        </thead>
        <tbody>
          ${incidents.incidents
            .slice(0, 50)
            .map(inc => {
              const severityColor = severityColors[inc.severity] || '#6b7280';
              const statusColor =
                inc.status === 'resolved' || inc.status === 'closed' ? '#10b981' : '#f59e0b';
              return `
              <tr>
                <td>${formatAustralianDate(inc.incident_date)}</td>
                <td>${inc.incident_type || 'N/A'}</td>
                <td>
                  <span class="status-badge" style="background-color: ${severityColor}20; color: ${severityColor};">
                    ${inc.severity}
                  </span>
                </td>
                <td>${inc.description.substring(0, 100)}${inc.description.length > 100 ? '...' : ''}</td>
                <td>
                  <span class="status-badge" style="background-color: ${statusColor}20; color: ${statusColor};">
                    ${inc.status}
                  </span>
                </td>
                <td>${inc.corrective_action ? inc.corrective_action.substring(0, 50) + (inc.corrective_action.length > 50 ? '...' : '') : 'N/A'}</td>
              </tr>
            `;
            })
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}

