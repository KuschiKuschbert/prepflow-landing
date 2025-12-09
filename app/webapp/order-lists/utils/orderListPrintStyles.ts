/**
 * Print styles for order lists
 * Supplier-focused styling for order list exports
 */

export function getOrderListPrintStyles(variant: 'default' | 'supplier' = 'default'): string {
  const supplierVariantStyles =
    variant === 'supplier'
      ? `
    /* Supplier Variant - Purchase Order Styles */
    .supplier-variant .purchase-order-items {
      margin-top: 32px;
    }

    .supplier-variant .purchase-order-items-header {
      font-size: 18px;
      font-weight: 700;
      color: #000000;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #333333;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .supplier-variant .purchase-order-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      border: 1px solid #333333;
    }

    .supplier-variant .purchase-order-table thead {
      background-color: #333333;
    }

    .supplier-variant .purchase-order-table th {
      padding: 12px 8px;
      text-align: left;
      font-weight: 700;
      font-size: 11px;
      color: #ffffff;
      border: 1px solid #333333;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .supplier-variant .purchase-order-table th.col-item {
      width: 30%;
    }

    .supplier-variant .purchase-order-table th.col-brand {
      width: 15%;
    }

    .supplier-variant .purchase-order-table th.col-pack {
      width: 12%;
    }

    .supplier-variant .purchase-order-table th.col-qty {
      width: 8%;
      text-align: center;
    }

    .supplier-variant .purchase-order-table th.col-unit-price,
    .supplier-variant .purchase-order-table th.col-total {
      width: 12%;
      text-align: right;
    }

    .supplier-variant .purchase-order-table td {
      padding: 10px 8px;
      border: 1px solid #e0e0e0;
      color: #333333;
      font-size: 12px;
      vertical-align: top;
    }

    .supplier-variant .purchase-order-table td.col-qty {
      text-align: center;
    }

    .supplier-variant .purchase-order-table td.col-unit-price,
    .supplier-variant .purchase-order-table td.col-total {
      text-align: right;
    }

    .supplier-variant .purchase-order-table tbody tr:nth-child(even) {
      background-color: #f9f9f9;
    }

    .supplier-variant .purchase-order-table tbody tr:hover {
      background-color: #f0f0f0;
    }

    .supplier-variant .purchase-order-table tfoot {
      background-color: #f5f5f5;
      border-top: 2px solid #333333;
    }

    .supplier-variant .purchase-order-table tfoot td {
      padding: 12px 8px;
      font-weight: 700;
      border-top: 2px solid #333333;
    }

    .supplier-variant .purchase-order-table tfoot .totals-label {
      text-align: right;
      color: #000000;
    }

    .supplier-variant .purchase-order-table tfoot .totals-value {
      text-align: right;
      color: #000000;
      font-size: 14px;
    }

    .supplier-variant .purchase-order-terms {
      margin-top: 32px;
      padding: 20px;
      background-color: #f8f8f8;
      border: 1px solid #e0e0e0;
    }

    .supplier-variant .purchase-order-terms h3 {
      font-size: 14px;
      font-weight: 700;
      color: #000000;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #333333;
      padding-bottom: 4px;
    }

    .supplier-variant .purchase-order-terms ul {
      margin: 0;
      padding-left: 20px;
      color: #333333;
      font-size: 12px;
      line-height: 1.8;
    }

    .supplier-variant .purchase-order-terms li {
      margin-bottom: 6px;
    }

    @media print {
      .supplier-variant .purchase-order-table {
        border-color: #000000;
      }

      .supplier-variant .purchase-order-table th {
        background-color: #000000 !important;
        color: #ffffff !important;
        border-color: #000000 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .supplier-variant .purchase-order-table td {
        border-color: #cccccc !important;
      }

      .supplier-variant .purchase-order-table tbody tr:nth-child(even) {
        background-color: #f5f5f5 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .supplier-variant .purchase-order-table tfoot {
        background-color: #e8e8e8 !important;
        border-top-color: #000000 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .supplier-variant .purchase-order-terms {
        background-color: #f5f5f5 !important;
        border-color: #cccccc !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  `
      : '';

  return `
    .order-list-content {
      width: 100%;
    }

    .order-list-empty {
      padding: 2rem;
      text-align: center;
      color: #666;
    }

    .order-list-group {
      margin-bottom: 2rem;
      page-break-inside: avoid;
    }

    .order-list-group-header {
      font-size: 1.1rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 0.75rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #29E7CD;
    }

    .order-list-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1rem;
    }

    .order-list-table thead {
      background-color: #f5f5f5;
    }

    .order-list-table th {
      padding: 0.75rem;
      text-align: left;
      font-weight: 600;
      font-size: 0.875rem;
      color: #333;
      border-bottom: 2px solid #e0e0e0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .order-list-table td {
      padding: 0.75rem;
      border-bottom: 1px solid #e0e0e0;
      color: #333;
      font-size: 0.875rem;
    }

    .order-list-table tbody tr:hover {
      background-color: #f9f9f9;
    }

    .ingredient-name {
      font-weight: 500;
      color: #000;
    }

    @media print {
      .order-list-group {
        page-break-inside: avoid;
        margin-bottom: 1.5rem;
      }

      .order-list-table {
        font-size: 0.8rem;
      }

      .order-list-table th,
      .order-list-table td {
        padding: 0.5rem;
      }

      .order-list-group-header {
        font-size: 1rem;
        margin-bottom: 0.5rem;
      }
    }
    ${supplierVariantStyles}
  `;
}
