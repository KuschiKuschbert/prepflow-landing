/** Matrix variant CSS (allergen matrix & complex grids). Data file for filesize limit. */
export const MATRIX_VARIANT_CSS = `
    /* Matrix Variant - Allergen Matrix & Complex Grids */

    .table-container {
      overflow-x: auto;
      margin-top: 2rem;
      border-radius: var(--pf-border-radius);
      box-shadow: var(--pf-shadow-content);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: var(--pf-color-bg-content);
      font-size: 0.85rem; /* Smaller font for matrix */
      table-layout: fixed; /* Better control */
    }

    thead {
      background: var(--pf-color-bg-header);
    }

    th {
      padding: 0.75rem 0.5rem;
      text-align: left;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 0.75rem;
      color: var(--pf-color-primary);
      border: 1px solid var(--pf-color-border);
      border-bottom: 2px solid var(--pf-color-secondary);
      vertical-align: bottom;
    }

    th.allergen-header {
      text-align: center;
      writing-mode: vertical-rl;
      text-orientation: mixed;
      width: 40px; /* Fixed width for allergen columns */
      letter-spacing: 0.05em;
      transform: rotate(180deg); /* If needed for some renders, but usually vertical-rl is enough */
      max-height: 150px;
    }

    tbody tr {
      border-bottom: 1px solid var(--pf-color-border);
    }

    tbody tr:nth-child(even) {
      background: rgba(255, 255, 255, 0.02);
    }

    tbody tr:hover {
      background: var(--pf-color-primary);
      opacity: 0.1; /* Use opacity instead of hardcoded RGBA */
    }

    td {
      border: 1px solid var(--pf-color-border);
      padding: 0.5rem;
      text-align: center;
      color: var(--pf-color-text-main);
      vertical-align: middle;
    }

    td.item-name {
      text-align: left;
      font-weight: 600;
      color: var(--pf-color-text-header);
      width: 20%;
    }

    td.type {
      text-align: left;
      color: var(--pf-color-text-muted);
      width: 10%;
    }

    /* Markers */
    .has-allergen {
      color: #ef4444; /* Red warning */
      font-weight: 900;
      font-size: 1.1rem;
    }

    .dietary-badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 600;
      margin-right: 4px;
    }

    .vegetarian {
      background: rgba(34, 197, 94, 0.15);
      color: #4ade80;
      border: 1px solid rgba(34, 197, 94, 0.3);
    }

    .vegan {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: var(--pf-color-text-muted);
      font-style: italic;
    }

    @media print {
      table {
        font-size: 8pt;
      }

      th {
        -webkit-print-color-adjust: exact;
      }

      tbody tr:nth-child(even) {
        -webkit-print-color-adjust: exact;
      }

      .vegetarian {
        background: transparent;
      }

      .vegan {
        background: transparent;
      }

      thead {
        display: table-header-group;
      }

      tbody tr {
        page-break-inside: avoid;
      }
    }
  `;
