/**
 * Print styles for compliance reports
 * Audit-ready styling for compliance report exports
 */

import { getAllTemplateStyles } from '@/lib/exports/template-styles/index';

export function getComplianceReportPrintStyles(): string {
  const baseStyles = getAllTemplateStyles('compliance');

  const complianceReportStyles = `
    /* Compliance Report Specific Styles */
    .compliance-report-content {
      width: 100%;
    }

    .compliance-report-section {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }

    .compliance-report-section h3 {
      font-size: 16px;
      font-weight: 700;
      color: #000000;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #000000;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .compliance-report-section p {
      margin: 8px 0;
      color: #333333;
      font-size: 12px;
      line-height: 1.6;
    }

    .compliance-report-section p strong {
      font-weight: 600;
      color: #000000;
    }

    .compliance-report-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      border: 1px solid #000000;
      font-size: 11px;
    }

    .compliance-report-table thead {
      background-color: #000000;
    }

    .compliance-report-table th {
      padding: 10px 8px;
      text-align: left;
      font-weight: 700;
      color: #ffffff;
      border: 1px solid #000000;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-size: 10px;
    }

    .compliance-report-table td {
      padding: 8px;
      border: 1px solid #cccccc;
      color: #000000;
      font-size: 11px;
      vertical-align: top;
    }

    .compliance-report-table tbody tr:nth-child(even) {
      background-color: #f9f9f9;
    }

    .compliance-report-summary {
      margin-top: 32px;
      padding: 20px;
      background-color: #f5f5f5;
      border: 2px solid #000000;
    }

    .compliance-report-summary h3 {
      margin-top: 0;
      border-bottom: 2px solid #000000;
    }

    .compliance-report-summary ul {
      margin: 12px 0;
      padding-left: 24px;
      color: #000000;
      font-size: 11px;
      line-height: 1.8;
    }

    .compliance-report-summary li {
      margin-bottom: 8px;
    }

    @media print {
      .compliance-report-section {
        page-break-inside: avoid;
      }

      .compliance-report-table {
        border-color: #000000;
      }

      .compliance-report-table th {
        background-color: #000000 !important;
        color: #ffffff !important;
        border-color: #000000 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .compliance-report-table td {
        border-color: #000000 !important;
      }

      .compliance-report-table tbody tr:nth-child(even) {
        background-color: #f5f5f5 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .compliance-report-summary {
        background-color: #f5f5f5 !important;
        border-color: #000000 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  `;

  return `${baseStyles}\n${complianceReportStyles}`;
}
