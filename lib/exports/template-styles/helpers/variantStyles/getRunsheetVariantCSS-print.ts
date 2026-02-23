/**
 * Print media styles for runsheet variant
 */
export function getRunsheetPrintCSS(): string {
  return `
    @media print {
      body.variant-runsheet {
        padding: 0;
      }

      .variant-runsheet .content-wrapper {
        padding: 10px;
      }

      .variant-runsheet .header {
        padding-bottom: 8px;
        margin-bottom: 12px;
      }

      .variant-runsheet .header-content h1 {
        font-size: 18px;
      }

      .variant-runsheet .header-content h2 {
        font-size: 12px;
      }

      .runsheet-event-info-grid {
        gap: 12px 24px;
        margin-bottom: 12px;
      }

      .runsheet-table {
        page-break-inside: avoid;
      }

      .runsheet-table tr {
        page-break-inside: avoid;
      }

      .runsheet-table thead,
      .runsheet-table th {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .runsheet-table tbody tr:nth-child(even) {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .runsheet-event-info {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .runsheet-table tr.runsheet-row-meal,
      .runsheet-table tr.runsheet-row-setup {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .runsheet-type-badge {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      @page {
        margin: 0.8cm;
      }
    }
  `;
}
