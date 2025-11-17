/**
 * Health Inspector Report Generator
 * Generates HTML and PDF reports for Australian health inspector compliance
 */

import {
  formatAustralianDate,
  getDaysUntilExpiry,
  getExpiryStatus,
  formatAUD,
} from './australian-standards';

export interface ReportData {
  generated_at: string;
  report_period: {
    start_date: string;
    end_date: string;
  };
  business_info?: {
    active_licenses: any[];
    total_compliance_records: number;
  };
  employees?: any[];
  qualifications?: {
    all_qualifications: any[];
    expiring_soon: any[];
    expired: any[];
  };
  compliance_records?: {
    all_records: any[];
    active: any[];
    expiring_soon: any[];
    expired: any[];
  };
  temperature_logs?: {
    logs: any[];
    total_logs: number;
    date_range: {
      start: string;
      end: string;
    };
  };
  temperature_violations?: {
    total_violations: number;
    out_of_range: any[];
    danger_zone: any[];
    violation_summary: {
      below_minimum: number;
      above_maximum: number;
      danger_zone_count: number;
    };
  };
  cleaning_records?: {
    tasks: any[];
    completed: any[];
    pending: any[];
    overdue: any[];
    total_tasks: number;
    date_range: {
      start: string;
      end: string;
    };
  };
  sanitizer_logs?: {
    logs: any[];
    total_logs: number;
    out_of_range: any[];
    date_range: {
      start: string;
      end: string;
    };
  };
  staff_health?: {
    declarations: any[];
    total_declarations: number;
    unhealthy_count: number;
    excluded_count: number;
    date_range: {
      start: string;
      end: string;
    };
  };
  incidents?: {
    incidents: any[];
    total_incidents: number;
    by_severity: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
    by_status: {
      open: number;
      investigating: number;
      resolved: number;
      closed: number;
    };
    unresolved: any[];
  };
  haccp?: {
    records: any[];
    total_records: number;
    out_of_limit: any[];
    by_step: Record<string, number>;
  };
  allergens?: {
    records: any[];
    total_records: number;
    inaccurate_declarations: any[];
    high_risk_items: any[];
  };
  equipment_maintenance?: {
    records: any[];
    total_records: number;
    critical_equipment: any[];
    overdue_maintenance: any[];
  };
  waste_management?: {
    logs: any[];
    total_logs: number;
    by_type: Record<string, number>;
  };
  procedures?: {
    procedures: any[];
    total_procedures: number;
    overdue_reviews: any[];
    by_type: Record<string, number>;
  };
  supplier_verification?: {
    verifications: any[];
    total_verifications: number;
    invalid_certificates: any[];
    expired_certificates: any[];
  };
  compliance_gaps?: {
    gaps: any[];
    total_gaps: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  executive_summary?: {
    overall_status: 'compliant' | 'attention_required' | 'non_compliant';
    total_employees: number;
    total_qualifications: number;
    expiring_qualifications: number;
    expired_qualifications: number;
    total_compliance_records: number;
    expiring_compliance: number;
    expired_compliance: number;
    temperature_logs_count: number;
    temperature_violations_count?: number;
    cleaning_tasks_count: number;
    sanitizer_logs_count?: number;
    staff_health_declarations_count?: number;
    incidents_count?: number;
    haccp_records_count?: number;
    compliance_gaps_count?: number;
    alerts: string[];
  };
}

/**
 * Generate HTML report from report data
 *
 * @param {ReportData} data - Report data from API
 * @returns {string} HTML string
 */
export function generateHTMLReport(data: ReportData): string {
  const statusColors = {
    compliant: '#10b981', // green
    attention_required: '#f59e0b', // yellow
    non_compliant: '#ef4444', // red
  };

  const statusLabels = {
    compliant: 'Compliant',
    attention_required: 'Attention Required',
    non_compliant: 'Non-Compliant',
  };

  return `
<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Health Inspector Compliance Report</title>
  <style>
    @media print {
      .no-print { display: none; }
      body { margin: 0; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: #ffffff;
    }
    .header {
      border-bottom: 3px solid #29e7cd;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #0a0a0a;
      margin: 0;
      font-size: 28px;
    }
    .header .meta {
      color: #6b7280;
      font-size: 14px;
      margin-top: 10px;
    }
    .section {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 20px;
      font-weight: 600;
      color: #0a0a0a;
      border-bottom: 2px solid #29e7cd;
      padding-bottom: 8px;
      margin-bottom: 20px;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
      font-size: 14px;
    }
    th {
      background-color: #f3f4f6;
      text-align: left;
      padding: 12px;
      font-weight: 600;
      border-bottom: 2px solid #29e7cd;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    tr:hover {
      background-color: #f9fafb;
    }
    .alert {
      padding: 12px;
      border-radius: 8px;
      margin: 10px 0;
    }
    .alert-warning {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      color: #92400e;
    }
    .alert-danger {
      background-color: #fee2e2;
      border-left: 4px solid #ef4444;
      color: #991b1b;
    }
    .alert-success {
      background-color: #d1fae5;
      border-left: 4px solid #10b981;
      color: #065f46;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 20px;
    }
    .summary-card {
      background-color: #f9fafb;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #29e7cd;
    }
    .summary-card .label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    .summary-card .value {
      font-size: 24px;
      font-weight: 600;
      color: #0a0a0a;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Health Inspector Compliance Report</h1>
    <div class="meta">
      Generated: ${formatAustralianDate(data.generated_at)}<br>
      Report Period: ${formatAustralianDate(data.report_period.start_date)} - ${formatAustralianDate(data.report_period.end_date)}
    </div>
  </div>

  ${data.executive_summary ? generateExecutiveSummary(data.executive_summary, statusColors, statusLabels) : ''}

  ${data.business_info ? generateBusinessInfo(data.business_info) : ''}

  ${data.employees ? generateEmployeeRoster(data.employees) : ''}

  ${data.qualifications ? generateQualificationSummary(data.qualifications) : ''}

  ${data.compliance_records ? generateComplianceRecords(data.compliance_records) : ''}

  ${data.temperature_logs ? generateTemperatureLogs(data.temperature_logs) : ''}

  ${data.temperature_violations ? generateTemperatureViolations(data.temperature_violations) : ''}

  ${data.cleaning_records ? generateCleaningRecords(data.cleaning_records) : ''}

  ${data.sanitizer_logs ? generateSanitizerLogs(data.sanitizer_logs) : ''}

  ${data.staff_health ? generateStaffHealth(data.staff_health) : ''}

  ${data.incidents ? generateIncidents(data.incidents) : ''}

  ${data.haccp ? generateHACCP(data.haccp) : ''}

  ${data.allergens ? generateAllergens(data.allergens) : ''}

  ${data.equipment_maintenance ? generateEquipmentMaintenance(data.equipment_maintenance) : ''}

  ${data.waste_management ? generateWasteManagement(data.waste_management) : ''}

  ${data.procedures ? generateProcedures(data.procedures) : ''}

  ${data.supplier_verification ? generateSupplierVerification(data.supplier_verification) : ''}

  ${data.compliance_gaps ? generateComplianceGaps(data.compliance_gaps) : ''}

</body>
</html>
  `.trim();
}

function generateExecutiveSummary(
  summary: ReportData['executive_summary'],
  statusColors: any,
  statusLabels: any,
): string {
  if (!summary) return '';

  const statusColor = statusColors[summary.overall_status] || '#6b7280';
  const statusLabel = statusLabels[summary.overall_status] || 'Unknown';

  return `
    <div class="section">
      <div class="section-title">Executive Summary</div>
      <div style="margin-bottom: 20px;">
        <span class="status-badge" style="background-color: ${statusColor}20; color: ${statusColor};">
          ${statusLabel}
        </span>
      </div>
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
      ${
        summary.alerts.length > 0
          ? `
        <div style="margin-top: 20px;">
          ${summary.alerts
            .map(
              alert => `
            <div class="alert ${alert.includes('expired') ? 'alert-danger' : 'alert-warning'}">
              ${alert}
            </div>
          `,
            )
            .join('')}
        </div>
      `
          : ''
      }
    </div>
  `;
}

function generateBusinessInfo(businessInfo: ReportData['business_info']): string {
  if (!businessInfo) return '';

  return `
    <div class="section">
      <div class="section-title">Business Information</div>
      <p><strong>Active Licenses:</strong> ${businessInfo.active_licenses.length}</p>
      <p><strong>Total Compliance Records:</strong> ${businessInfo.total_compliance_records}</p>
    </div>
  `;
}

function generateEmployeeRoster(employees: any[]): string {
  if (!employees || employees.length === 0) {
    return `
      <div class="section">
        <div class="section-title">Employee Roster</div>
        <p>No active employees found.</p>
      </div>
    `;
  }

  return `
    <div class="section">
      <div class="section-title">Employee Roster (${employees.length} active employees)</div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Employment Start</th>
            <th>Qualifications</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${employees
            .map(emp => {
              const qualifications = emp.employee_qualifications || [];
              const expiringQuals = qualifications.filter((q: any) => {
                const days = getDaysUntilExpiry(q.expiry_date);
                return days !== null && days > 0 && days <= 90;
              });
              const expiredQuals = qualifications.filter((q: any) => {
                const days = getDaysUntilExpiry(q.expiry_date);
                return days !== null && days < 0;
              });

              return `
              <tr>
                <td><strong>${emp.full_name}</strong></td>
                <td>${emp.role || 'N/A'}</td>
                <td>${formatAustralianDate(emp.employment_start_date)}</td>
                <td>
                  ${qualifications.length} total
                  ${expiredQuals.length > 0 ? `<span style="color: #ef4444;">(${expiredQuals.length} expired)</span>` : ''}
                  ${expiringQuals.length > 0 ? `<span style="color: #f59e0b;">(${expiringQuals.length} expiring)</span>` : ''}
                </td>
                <td>
                  <span class="status-badge" style="background-color: #10b98120; color: #10b981;">
                    ${emp.status}
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

function generateQualificationSummary(qualifications: ReportData['qualifications']): string {
  if (!qualifications) return '';

  return `
    <div class="section">
      <div class="section-title">Qualification Summary</div>
      <p><strong>Total Qualifications:</strong> ${qualifications.all_qualifications.length}</p>
      ${
        qualifications.expired.length > 0
          ? `
        <div class="alert alert-danger">
          <strong>${qualifications.expired.length} Expired Qualification(s):</strong>
          <ul style="margin: 10px 0 0 20px;">
            ${qualifications.expired
              .map(
                q => `
              <li>${q.employee_name} - ${q.qualification_types?.name || 'Unknown'} (Expired: ${formatAustralianDate(q.expiry_date)})</li>
            `,
              )
              .join('')}
          </ul>
        </div>
      `
          : ''
      }
      ${
        qualifications.expiring_soon.length > 0
          ? `
        <div class="alert alert-warning">
          <strong>${qualifications.expiring_soon.length} Qualification(s) Expiring Soon:</strong>
          <ul style="margin: 10px 0 0 20px;">
            ${qualifications.expiring_soon
              .map(q => {
                const days = getDaysUntilExpiry(q.expiry_date);
                return `
                <li>${q.employee_name} - ${q.qualification_types?.name || 'Unknown'} (Expires: ${formatAustralianDate(q.expiry_date)}, ${days} days)</li>
              `;
              })
              .join('')}
          </ul>
        </div>
      `
          : ''
      }
    </div>
  `;
}

function generateComplianceRecords(records: ReportData['compliance_records']): string {
  if (!records || records.all_records.length === 0) {
    return `
      <div class="section">
        <div class="section-title">Compliance Records</div>
        <p>No compliance records found.</p>
      </div>
    `;
  }

  return `
    <div class="section">
      <div class="section-title">Compliance Records</div>
      ${
        records.expired.length > 0
          ? `
        <div class="alert alert-danger">
          <strong>${records.expired.length} Expired Record(s):</strong>
          <ul style="margin: 10px 0 0 20px;">
            ${records.expired
              .map(r => {
                const typeName =
                  r.compliance_types?.type_name || r.compliance_types?.name || 'Unknown';
                return `
              <li>${r.document_name} - ${typeName} (Expired: ${formatAustralianDate(r.expiry_date)})</li>
            `;
              })
              .join('')}
          </ul>
        </div>
      `
          : ''
      }
      ${
        records.expiring_soon.length > 0
          ? `
        <div class="alert alert-warning">
          <strong>${records.expiring_soon.length} Record(s) Expiring Soon:</strong>
          <ul style="margin: 10px 0 0 20px;">
            ${records.expiring_soon
              .map(r => {
                const days = getDaysUntilExpiry(r.expiry_date);
                const typeName =
                  r.compliance_types?.type_name || r.compliance_types?.name || 'Unknown';
                return `
                <li>${r.document_name} - ${typeName} (Expires: ${formatAustralianDate(r.expiry_date)}, ${days} days)</li>
              `;
              })
              .join('')}
          </ul>
        </div>
      `
          : ''
      }
      <table>
        <thead>
          <tr>
            <th>Document Name</th>
            <th>Type</th>
            <th>Issue Date</th>
            <th>Expiry Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${records.active
            .map(r => {
              const status = getExpiryStatus(r.expiry_date);
              const statusColor =
                status === 'expired'
                  ? '#ef4444'
                  : status === 'expiring_soon'
                    ? '#f59e0b'
                    : '#10b981';
              return `
              <tr>
                <td>${r.document_name}</td>
                <td>${r.compliance_types?.type_name || r.compliance_types?.name || 'Unknown'}</td>
                <td>${formatAustralianDate(r.issue_date)}</td>
                <td>${formatAustralianDate(r.expiry_date)}</td>
                <td>
                  <span class="status-badge" style="background-color: ${statusColor}20; color: ${statusColor};">
                    ${status === 'expired' ? 'Expired' : status === 'expiring_soon' ? 'Expiring Soon' : 'Active'}
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

function generateTemperatureLogs(logs: ReportData['temperature_logs']): string {
  if (!logs || logs.logs.length === 0) {
    return `
      <div class="section">
        <div class="section-title">Temperature Monitoring</div>
        <p>No temperature logs found for the selected period.</p>
        <p><strong>Date Range:</strong> ${formatAustralianDate(logs.date_range.start)} - ${formatAustralianDate(logs.date_range.end)}</p>
      </div>
    `;
  }

  // Show summary and recent logs
  const recentLogs = logs.logs.slice(0, 50); // Show most recent 50

  return `
    <div class="section">
      <div class="section-title">Temperature Monitoring</div>
      <p><strong>Total Logs:</strong> ${logs.total_logs}</p>
      <p><strong>Date Range:</strong> ${formatAustralianDate(logs.date_range.start)} - ${formatAustralianDate(logs.date_range.end)}</p>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Location/Type</th>
            <th>Temperature</th>
            <th>Logged By</th>
          </tr>
        </thead>
        <tbody>
          ${recentLogs
            .map(
              log => `
            <tr>
              <td>${formatAustralianDate(log.log_date)}</td>
              <td>${log.log_time || 'N/A'}</td>
              <td>${log.location || log.temperature_type || 'N/A'}</td>
              <td>${log.temperature_celsius}°C</td>
              <td>${log.logged_by || 'N/A'}</td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
      </table>
      ${logs.logs.length > 50 ? `<p style="margin-top: 10px; color: #6b7280; font-size: 12px;">Showing most recent 50 of ${logs.total_logs} logs</p>` : ''}
    </div>
  `;
}

function generateCleaningRecords(records: ReportData['cleaning_records']): string {
  if (!records || records.tasks.length === 0) {
    return `
      <div class="section">
        <div class="section-title">Cleaning Records</div>
        <p>No cleaning tasks found for the selected period.</p>
        <p><strong>Date Range:</strong> ${formatAustralianDate(records.date_range.start)} - ${formatAustralianDate(records.date_range.end)}</p>
      </div>
    `;
  }

  const recentTasks = records.tasks.slice(0, 50); // Show most recent 50

  return `
    <div class="section">
      <div class="section-title">Cleaning Records</div>
      <p><strong>Total Tasks:</strong> ${records.total_tasks}</p>
      <p><strong>Completed:</strong> ${records.completed.length} | <strong>Pending:</strong> ${records.pending.length} | <strong>Overdue:</strong> ${records.overdue.length}</p>
      <p><strong>Date Range:</strong> ${formatAustralianDate(records.date_range.start)} - ${formatAustralianDate(records.date_range.end)}</p>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Area</th>
            <th>Status</th>
            <th>Completed Date</th>
          </tr>
        </thead>
        <tbody>
          ${recentTasks
            .map(task => {
              const statusColor =
                task.status === 'completed'
                  ? '#10b981'
                  : task.status === 'overdue'
                    ? '#ef4444'
                    : '#f59e0b';
              return `
              <tr>
                <td>${formatAustralianDate(task.assigned_date)}</td>
                <td>${task.cleaning_areas?.name || 'Unknown'}</td>
                <td>
                  <span class="status-badge" style="background-color: ${statusColor}20; color: ${statusColor};">
                    ${task.status}
                  </span>
                </td>
                <td>${task.completed_date ? formatAustralianDate(task.completed_date) : 'N/A'}</td>
              </tr>
            `;
            })
            .join('')}
        </tbody>
      </table>
      ${records.tasks.length > 50 ? `<p style="margin-top: 10px; color: #6b7280; font-size: 12px;">Showing most recent 50 of ${records.total_tasks} tasks</p>` : ''}
    </div>
  `;
}

function generateTemperatureViolations(violations: ReportData['temperature_violations']): string {
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

function generateSanitizerLogs(logs: ReportData['sanitizer_logs']): string {
  if (!logs || logs.total_logs === 0) {
    return `
      <div class="section">
        <div class="section-title">Sanitizer Logs</div>
        <p>No sanitizer logs found for the selected period.</p>
      </div>
    `;
  }

  return `
    <div class="section">
      <div class="section-title">Sanitizer Concentration Logs</div>
      <p><strong>Total Logs:</strong> ${logs.total_logs}</p>
      ${
        logs.out_of_range.length > 0
          ? `
        <div class="alert alert-danger">
          <strong>${logs.out_of_range.length} Out of Range Reading(s):</strong>
          Sanitizer concentration outside acceptable range detected.
        </div>
      `
          : ''
      }
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Type</th>
            <th>Concentration (ppm)</th>
            <th>Location</th>
            <th>Status</th>
            <th>Tested By</th>
          </tr>
        </thead>
        <tbody>
          ${logs.logs
            .slice(0, 50)
            .map(log => {
              const statusColor = log.is_within_range ? '#10b981' : '#ef4444';
              return `
              <tr>
                <td>${formatAustralianDate(log.log_date)}</td>
                <td>${log.log_time || 'N/A'}</td>
                <td>${log.sanitizer_type || 'N/A'}</td>
                <td>${log.concentration_ppm || 'N/A'}</td>
                <td>${log.location || 'N/A'}</td>
                <td>
                  <span class="status-badge" style="background-color: ${statusColor}20; color: ${statusColor};">
                    ${log.is_within_range ? 'In Range' : 'Out of Range'}
                  </span>
                </td>
                <td>${log.tested_by || 'N/A'}</td>
              </tr>
            `;
            })
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}

function generateStaffHealth(health: ReportData['staff_health']): string {
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

function generateIncidents(incidents: ReportData['incidents']): string {
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

function generateHACCP(haccp: ReportData['haccp']): string {
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

function generateAllergens(allergens: ReportData['allergens']): string {
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

function generateEquipmentMaintenance(maintenance: ReportData['equipment_maintenance']): string {
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

function generateWasteManagement(waste: ReportData['waste_management']): string {
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

function generateProcedures(procedures: ReportData['procedures']): string {
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

function generateSupplierVerification(verification: ReportData['supplier_verification']): string {
  if (!verification || verification.total_verifications === 0) {
    return `
      <div class="section">
        <div class="section-title">Supplier Verification</div>
        <p>No supplier verification records found for the selected period.</p>
      </div>
    `;
  }

  return `
    <div class="section">
      <div class="section-title">Supplier Verification Records</div>
      <p><strong>Total Verifications:</strong> ${verification.total_verifications}</p>
      ${
        verification.invalid_certificates.length > 0
          ? `
        <div class="alert alert-danger">
          <strong>${verification.invalid_certificates.length} Invalid Certificate(s):</strong>
          Supplier certificates found to be invalid.
        </div>
      `
          : ''
      }
      ${
        verification.expired_certificates.length > 0
          ? `
        <div class="alert alert-warning">
          <strong>${verification.expired_certificates.length} Expired Certificate(s):</strong>
          Supplier certificates have expired and require renewal.
        </div>
      `
          : ''
      }
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Supplier</th>
            <th>Verification Type</th>
            <th>Certificate Type</th>
            <th>Certificate Number</th>
            <th>Expiry Date</th>
            <th>Valid</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          ${verification.verifications
            .slice(0, 50)
            .map(ver => {
              const validColor = ver.is_valid ? '#10b981' : '#ef4444';
              const resultColor =
                ver.verification_result === 'approved'
                  ? '#10b981'
                  : ver.verification_result === 'rejected'
                    ? '#ef4444'
                    : '#f59e0b';
              return `
              <tr>
                <td>${formatAustralianDate(ver.verification_date)}</td>
                <td>${ver.suppliers?.supplier_name || 'N/A'}</td>
                <td>${ver.verification_type || 'N/A'}</td>
                <td>${ver.certificate_type || 'N/A'}</td>
                <td>${ver.certificate_number || 'N/A'}</td>
                <td>${ver.expiry_date ? formatAustralianDate(ver.expiry_date) : 'N/A'}</td>
                <td>
                  <span class="status-badge" style="background-color: ${validColor}20; color: ${validColor};">
                    ${ver.is_valid ? 'Yes' : 'No'}
                  </span>
                </td>
                <td>
                  <span class="status-badge" style="background-color: ${resultColor}20; color: ${resultColor};">
                    ${ver.verification_result || 'N/A'}
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

function generateComplianceGaps(gaps: ReportData['compliance_gaps']): string {
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

/**
 * Generate PDF report (placeholder - would use @react-pdf/renderer or jspdf)
 *
 * @param {ReportData} data - Report data from API
 * @returns {Promise<Blob>} PDF blob
 */
export async function generatePDFReport(data: ReportData): Promise<Blob> {
  // For now, return HTML as PDF would require additional library setup
  // In production, use @react-pdf/renderer or jspdf
  const html = generateHTMLReport(data);
  // This is a placeholder - actual PDF generation would go here
  throw new Error('PDF generation not yet implemented. Use HTML export instead.');
}
