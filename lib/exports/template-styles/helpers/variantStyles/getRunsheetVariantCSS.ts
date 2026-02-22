/**
 * Get runsheet variant styles (restaurant/catering runsheet format)
 * Compact, professional layout for event runsheets with clear timeline
 * Theme-aware: uses primary/accent for strong visual identity across export themes
 *
 * @returns {string} CSS for runsheet variant
 */
export function getRunsheetVariantCSS(): string {
  return `
    /* Runsheet Variant - Restaurant/Catering Format */
    body.variant-runsheet {
      background: var(--pf-color-bg-page);
      padding: 10px;
      font-family: var(--pf-font-family-body);
    }

    .variant-runsheet .content-wrapper {
      background: var(--pf-color-bg-content);
      box-shadow: none;
      padding: 16px;
      max-width: 100%;
      border-radius: var(--pf-border-radius);
    }

    .variant-runsheet .header {
      padding-bottom: 12px;
      margin-bottom: 16px;
      border-bottom: 2px solid var(--pf-color-primary);
    }

    .variant-runsheet .header-content h1 {
      font-size: 20px;
      font-weight: 600;
      font-family: var(--pf-font-family-header);
      color: var(--pf-color-text-header);
      background: none;
      -webkit-text-fill-color: var(--pf-color-text-header);
      margin: 0;
    }

    .variant-runsheet .header-content h2 {
      font-size: 14px;
      font-family: var(--pf-font-family-body);
      color: var(--pf-color-text-muted);
      margin: 4px 0 0 0;
    }

    .variant-runsheet .header-meta {
      font-family: var(--pf-font-family-body);
      color: var(--pf-color-text-muted);
      font-size: 12px;
    }

    .variant-runsheet .export-content {
      margin-top: 0;
    }

    /* Runsheet event info block - theme-aware with prominent primary accent */
    .runsheet-event-info {
      margin-bottom: 20px;
      padding: 16px;
      background: color-mix(in srgb, var(--pf-color-border) 12%, transparent);
      border-left: 4px solid var(--pf-color-primary);
      border-radius: 8px;
      font-size: 13px;
      font-family: var(--pf-font-family-body);
      color: var(--pf-color-text-main);
    }

    .runsheet-event-info p {
      margin: 4px 0;
    }

    /* Event info grid - two-column layout for quick scanning */
    .runsheet-event-info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px 32px;
      margin-bottom: 16px;
    }

    .runsheet-event-info-section {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .runsheet-event-info-section-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--pf-color-primary);
      margin-bottom: 2px;
    }

    .runsheet-event-info-notes {
      grid-column: 1 / -1;
      margin-top: 4px;
      padding-top: 12px;
      border-top: 1px solid var(--pf-color-border);
    }

    /* Runsheet table */
    .runsheet-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      font-family: var(--pf-font-family-body);
    }

    .runsheet-table thead {
      background-color: var(--pf-color-primary);
    }

    .runsheet-table th {
      text-align: left;
      padding: 10px 12px;
      font-family: var(--pf-font-family-header);
      font-weight: 700;
      color: var(--pf-color-text-header);
      border: 1px solid var(--pf-color-border);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-size: 11px;
    }

    .runsheet-table td {
      padding: 10px 12px;
      border-bottom: 1px solid var(--pf-color-border);
      color: var(--pf-color-text-main);
      line-height: 1.45;
    }

    .runsheet-table tbody tr:nth-child(even) {
      background-color: color-mix(in srgb, var(--pf-color-primary) 8%, transparent);
    }

    /* Importance-based row formatting - meal (high), setup (medium), activity/other (default) */
    .runsheet-table tr.runsheet-row-meal {
      font-weight: 600;
      border-left: 3px solid var(--pf-color-primary);
    }

    .runsheet-table tr.runsheet-row-meal td {
      padding-left: 9px;
    }

    .runsheet-table tr.runsheet-row-setup {
      border-left: 2px solid var(--pf-color-accent);
    }

    .runsheet-table tr.runsheet-row-setup td {
      padding-left: 10px;
    }

    .runsheet-table .runsheet-day {
      text-align: center;
      width: 50px;
      font-weight: 500;
      color: var(--pf-color-text-muted);
    }

    .runsheet-table .runsheet-time {
      white-space: nowrap;
      font-weight: 600;
      width: 80px;
      font-size: 14px;
      font-variant-numeric: tabular-nums;
    }

    .runsheet-table .runsheet-type {
      text-align: center;
      width: 100px;
    }

    .runsheet-table .runsheet-dietary {
      text-align: center;
      width: 120px;
      font-size: 12px;
      color: var(--pf-color-text-muted);
    }

    /* Type badges - theme-aware (use theme variables for all themes) */
    .runsheet-type-badge {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 500;
    }

    .runsheet-type-badge.meal {
      background: color-mix(in srgb, var(--pf-color-primary) 25%, transparent);
      color: var(--pf-color-primary);
    }

    .runsheet-type-badge.setup {
      background: color-mix(in srgb, var(--pf-color-accent) 25%, transparent);
      color: var(--pf-color-accent);
    }

    .runsheet-type-badge.activity {
      background: color-mix(in srgb, var(--pf-color-text-muted) 30%, transparent);
      color: var(--pf-color-text-muted);
    }

    .runsheet-type-badge.other {
      background: color-mix(in srgb, var(--pf-color-text-muted) 20%, transparent);
      color: var(--pf-color-text-muted);
    }

    .runsheet-linked {
      font-size: 12px;
      color: var(--pf-color-text-muted);
      margin-top: 4px;
      line-height: 1.4;
    }

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
