/**
 * Get supplier variant styles (purchase order format, formal layout)
 *
 * @returns {string} CSS for supplier variant
 */
export function getSupplierVariantCSS(): string {
  return `
    /* Supplier Variant - Purchase Order Styles */

    .supplier-variant .purchase-order-items {
      margin-top: 2rem;
    }

    .supplier-variant .purchase-order-items-header {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--pf-color-primary);
      margin-bottom: 1.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid var(--pf-color-border);
      text-transform: uppercase;
      letter-spacing: -0.01em;
    }

    /* Modern Table Styles for Orders */
    .supplier-variant .purchase-order-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 2rem;
      border-radius: var(--pf-border-radius);
      overflow: hidden;
      box-shadow: var(--pf-shadow-content);
    }

    .supplier-variant .purchase-order-table thead {
      background: var(--pf-color-bg-header);
    }

    .supplier-variant .purchase-order-table th {
      padding: 1rem;
      text-align: left;
      font-weight: 700;
      font-size: 0.85rem;
      color: var(--pf-color-primary);
      border-bottom: 1px solid var(--pf-color-border);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .supplier-variant .purchase-order-table th.col-qty,
    .supplier-variant .purchase-order-table th.col-unit-price,
    .supplier-variant .purchase-order-table th.col-total {
      text-align: right;
    }

    .supplier-variant .purchase-order-table td {
      padding: 1rem;
      border-bottom: 1px solid var(--pf-color-border);
      color: var(--pf-color-text-main);
      font-size: 0.95rem;
      vertical-align: middle;
    }

    .supplier-variant .purchase-order-table td.col-qty,
    .supplier-variant .purchase-order-table td.col-unit-price,
    .supplier-variant .purchase-order-table td.col-total {
      text-align: right;
      font-family: var(--pf-font-family-header);
      font-variant-numeric: tabular-nums;
    }

    .supplier-variant .purchase-order-table td.col-qty {
      font-weight: 700;
      color: var(--pf-color-text-header);
    }

    .supplier-variant .purchase-order-table tbody tr:nth-child(even) {
       background: color-mix(in srgb, var(--pf-color-text-main), transparent 97%);
    }

    .supplier-variant .purchase-order-table tbody tr:hover {
       background: color-mix(in srgb, var(--pf-color-primary), transparent 90%);
    }

    /* Footer Totals */
    .supplier-variant .purchase-order-table tfoot {
      background: var(--pf-color-bg-header);
      border-top: 2px solid var(--pf-color-primary);
    }

    .supplier-variant .purchase-order-table tfoot td {
      padding: 1.5rem 1rem;
      font-weight: 700;
      color: var(--pf-color-text-header);
      border: none;
    }

    .supplier-variant .purchase-order-table tfoot .totals-label {
      text-align: right;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 0.9rem;
    }

    .supplier-variant .purchase-order-table tfoot .totals-value {
      text-align: right;
      font-size: 1.25rem;
      color: var(--pf-color-primary);
      font-family: var(--pf-font-family-header);
    }

    /* Terms Box */
    .supplier-variant .purchase-order-terms {
      margin-top: 3rem;
      padding: 2rem;
      background: var(--pf-color-bg-content);
      border: 1px solid var(--pf-color-border);
      border-radius: var(--pf-border-radius);
    }

    .supplier-variant .purchase-order-terms h3 {
      font-size: 1rem;
      font-weight: 700;
      color: var(--pf-color-text-muted);
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--pf-color-border);
      padding-bottom: 0.5rem;
    }

    .supplier-variant .purchase-order-terms ul {
      margin: 0;
      padding-left: 1.5rem;
      color: var(--pf-color-text-main);
      font-size: 0.9rem;
      line-height: 1.8;
    }

    @media print {
      /* Print overrides removed to allow theme colors */
      .supplier-variant .purchase-order-table th {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  `;
}
