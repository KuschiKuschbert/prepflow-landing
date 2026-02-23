/**
 * Table styles for runsheet variant
 */
export function getRunsheetTableCSS(): string {
  return `
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
  `;
}
