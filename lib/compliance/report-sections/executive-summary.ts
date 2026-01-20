import type { ReportData, StatusColors, StatusLabels } from '../report-types';

export function generateExecutiveSummary(
  summary: ReportData['executive_summary'],
  statusColors: StatusColors,
  statusLabels: StatusLabels,
): string {
  if (!summary) return '';

  return `
    <div class="section">
      <div class="section-title">Executive Summary</div>
      ${renderStatusBadge(summary, statusColors, statusLabels)}
      ${renderSummaryGrid(summary)}
      ${renderAlerts(summary.alerts)}
    </div>
  `;
}

function renderStatusBadge(
  summary: NonNullable<ReportData['executive_summary']>,
  statusColors: StatusColors,
  statusLabels: StatusLabels,
): string {
  const statusColor = statusColors[summary.overall_status] || '#6b7280';
  const statusLabel = statusLabels[summary.overall_status] || 'Unknown';

  return `
      <div style="margin-bottom: 20px;">
        <span class="status-badge" style="background-color: ${statusColor}20; color: ${statusColor};">
          ${statusLabel}
        </span>
      </div>
  `;
}

function renderSummaryGrid(summary: NonNullable<ReportData['executive_summary']>): string {
  return `
      <div class="summary-grid">
        <div class="summary-card">
          <div class="label">Total Employees</div>
          <div class="value">${summary.total_employees}</div>
        </div>
        <div class="summary-card">
          <div class="label">Total Qualifications</div>
          <div class="value">${summary.total_qualifications}</div>
        </div>
        <div class="summary-card">
          <div class="label">Expiring Qualifications</div>
          <div class="value" style="color: ${summary.expiring_qualifications > 0 ? '#f59e0b' : '#10b981'}">${summary.expiring_qualifications}</div>
        </div>
        <div class="summary-card">
          <div class="label">Expired Qualifications</div>
          <div class="value" style="color: ${summary.expired_qualifications > 0 ? '#ef4444' : '#10b981'}">${summary.expired_qualifications}</div>
        </div>
        <div class="summary-card">
          <div class="label">Compliance Records</div>
          <div class="value">${summary.total_compliance_records}</div>
        </div>
        <div class="summary-card">
          <div class="label">Temperature Logs</div>
          <div class="value">${summary.temperature_logs_count}</div>
        </div>
        <div class="summary-card">
          <div class="label">Cleaning Tasks</div>
          <div class="value">${summary.cleaning_tasks_count}</div>
        </div>
        ${
          summary.temperature_violations_count !== undefined
            ? `
        <div class="summary-card">
          <div class="label">Temperature Violations</div>
          <div class="value" style="color: ${summary.temperature_violations_count > 0 ? '#ef4444' : '#10b981'}">${summary.temperature_violations_count}</div>
        </div>
        `
            : ''
        }
        ${
          summary.compliance_gaps_count !== undefined
            ? `
        <div class="summary-card">
          <div class="label">Compliance Gaps</div>
          <div class="value" style="color: ${summary.compliance_gaps_count > 0 ? '#ef4444' : '#10b981'}">${summary.compliance_gaps_count}</div>
        </div>
        `
            : ''
        }
        ${
          summary.incidents_count !== undefined
            ? `
        <div class="summary-card">
          <div class="label">Incidents</div>
          <div class="value">${summary.incidents_count}</div>
        </div>
        `
            : ''
        }
      </div>
  `;
}

function renderAlerts(alerts: string[]): string {
  if (!alerts || alerts.length === 0) return '';

  return `
        <div style="margin-top: 20px;">
          ${alerts
            .map(
              alert => `
            <div class="alert ${alert.includes('expired') ? 'alert-danger' : 'alert-warning'}">
              ${alert}
            </div>
          `,
            )
            .join('')}
        </div>
      `;
}
