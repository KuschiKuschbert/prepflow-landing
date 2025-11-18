/**
 * Health Inspector Report Generator
 * Generates HTML and PDF reports for Australian health inspector compliance
 */

import { formatAustralianDate } from './australian-standards';
import type { ReportData, StatusColors, StatusLabels } from './report-types';

// Import all section generators
import { generateExecutiveSummary } from './report-sections/executive-summary';
import { generateBusinessInfo } from './report-sections/business-info';
import { generateEmployeeRoster } from './report-sections/employee-roster';
import { generateQualificationSummary } from './report-sections/qualification-summary';
import { generateComplianceRecords } from './report-sections/compliance-records';
import { generateTemperatureLogs } from './report-sections/temperature-logs';
import { generateCleaningRecords } from './report-sections/cleaning-records';
import { generateTemperatureViolations } from './report-sections/temperature-violations';
import { generateSanitizerLogs } from './report-sections/sanitizer-logs';
import { generateStaffHealth } from './report-sections/staff-health';
import { generateIncidents } from './report-sections/incidents';
import { generateHACCP } from './report-sections/haccp';
import { generateAllergens } from './report-sections/allergens';
import { generateEquipmentMaintenance } from './report-sections/equipment-maintenance';
import { generateWasteManagement } from './report-sections/waste-management';
import { generateProcedures } from './report-sections/procedures';
import { generateSupplierVerification } from './report-sections/supplier-verification';
import { generateComplianceGaps } from './report-sections/compliance-gaps';

// Re-export ReportData for convenience
export type { ReportData } from './report-types';

/**
 * Generate HTML report from report data
 *
 * @param {ReportData} data - Report data from API
 * @returns {string} HTML string
 */
export function generateHTMLReport(data: ReportData): string {
  const statusColors: StatusColors = {
    compliant: '#10b981', // green
    attention_required: '#f59e0b', // yellow
    non_compliant: '#ef4444', // red
  };

  const statusLabels: StatusLabels = {
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
