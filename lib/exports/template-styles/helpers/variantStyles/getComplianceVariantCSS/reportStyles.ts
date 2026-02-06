/**
 * Compliance report-specific styles (sections, tables, summaries)
 *
 * @returns {string} CSS for compliance report elements
 */
export function getComplianceReportStyles(): string {
  return `
    /* Compliance Report Specific Styles */
    .compliance-report-section {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }

    .compliance-report-section h3 {
      font-size: 16px;
      font-weight: 700;
      color: var(--pf-color-text-main);
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid var(--pf-color-text-main);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .compliance-report-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      border: 1px solid var(--pf-color-border);
      font-size: 11px;
    }

    .compliance-report-table thead {
      background-color: var(--pf-color-primary);
    }

    .compliance-report-table th {
      padding: 10px 8px;
      text-align: left;
      font-weight: 700;
      color: var(--pf-color-text-header); /* Use text header color for contrast on primary bg */
      border: 1px solid var(--pf-color-border);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-size: 10px;
    }

    .compliance-report-table td {
      padding: 8px;
      border: 1px solid var(--pf-color-border);
      color: var(--pf-color-text-main);
      font-size: 11px;
      vertical-align: top;
    }

    .compliance-report-table tbody tr:nth-child(even) {
      background-color: var(--pf-color-secondary);
    }

    .compliance-report-summary {
      margin-top: 32px;
      padding: 20px;
      background-color: var(--pf-color-secondary);
      border: 2px solid var(--pf-color-border);
    }

    .compliance-report-summary h3 {
      margin-top: 0;
      border-bottom: 2px solid var(--pf-color-text-main);
    }

    .compliance-report-summary ul {
      margin: 12px 0;
      padding-left: 24px;
      color: var(--pf-color-text-main);
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

      .compliance-report-table th {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .compliance-report-table tbody tr:nth-child(even) {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .compliance-report-summary {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  `;
}
