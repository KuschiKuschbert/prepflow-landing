/**
 * Customer variant styles for menu printing
 * Polished, marketing-focused styles
 */

export function getCustomerVariantStyles(): string {
  return `
    /* Customer Variant - Polished, Marketing-Focused Styles */
    .variant-customer .menu-print {
      font-family: Georgia, 'Times New Roman', serif;
    }

    .variant-customer .menu-category {
      margin-bottom: 3rem;
    }

    .variant-customer .menu-category h2 {
      font-size: 28pt;
      font-weight: 300;
      color: #1a1a1a;
      border-bottom: 2px solid #e8e8e8;
      padding-bottom: 0.75rem;
      margin-bottom: 1.5rem;
      text-transform: none;
      letter-spacing: 0;
      font-family: Georgia, 'Times New Roman', serif;
    }

    .variant-customer .menu-item {
      margin-bottom: 1.75rem;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid #f0f0f0;
    }

    .variant-customer .menu-item-header {
      margin-bottom: 0.75rem;
    }

    .variant-customer .menu-item-name {
      font-size: 16pt;
      font-weight: 400;
      color: #1a1a1a;
      font-family: Georgia, 'Times New Roman', serif;
      letter-spacing: 0.3px;
    }

    .variant-customer .menu-item-price {
      font-size: 16pt;
      font-weight: 400;
      color: #1a1a1a;
      font-family: Georgia, 'Times New Roman', serif;
    }

    .variant-customer .menu-item-description {
      font-size: 11pt;
      color: #555555;
      font-style: italic;
      line-height: 1.7;
      margin-top: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .variant-customer .menu-item-allergens {
      margin-top: 0.75rem;
    }

    .variant-customer .allergen-icon {
      color: #888888;
    }

    .variant-customer .allergen-matrix-page {
      margin-top: 4rem;
    }

    .variant-customer .allergen-matrix-header {
      border-bottom: 2px solid #e8e8e8;
    }

    .variant-customer .allergen-matrix-header h2 {
      font-size: 24pt;
      font-weight: 300;
      color: #1a1a1a;
      font-family: Georgia, 'Times New Roman', serif;
    }

    .variant-customer .allergen-matrix-header p {
      color: #666666;
      font-size: 11pt;
      font-style: italic;
    }

    .variant-customer .allergen-matrix-table {
      background: #ffffff;
      border: 1px solid #e8e8e8;
    }

    .variant-customer .allergen-matrix-table thead {
      background: #f8f8f8;
    }

    .variant-customer .allergen-matrix-table th {
      color: #1a1a1a;
      border-color: #e8e8e8;
      font-weight: 400;
      text-transform: none;
      letter-spacing: 0;
    }

    .variant-customer .allergen-matrix-table th svg {
      color: #666666;
    }

    .variant-customer .allergen-matrix-table tbody tr {
      border-bottom-color: #f0f0f0;
    }

    .variant-customer .allergen-matrix-table tbody tr:nth-child(even) {
      background: #fafafa;
    }

    .variant-customer .allergen-matrix-table td {
      color: #333333;
      border-color: #f0f0f0;
    }

    .variant-customer .allergen-matrix-table td.item-name {
      color: #1a1a1a;
      font-weight: 400;
    }

    .variant-customer .allergen-matrix-table .allergen-present {
      color: #c62828;
    }

    .variant-customer .allergen-matrix-table .allergen-absent {
      color: #cccccc;
    }

    @media print {
      .variant-customer .menu-category h2 {
        color: #000000;
        border-bottom-color: #e0e0e0;
      }

      .variant-customer .menu-item {
        border-bottom-color: #e8e8e8;
      }

      .variant-customer .menu-item-name,
      .variant-customer .menu-item-price {
        color: #000000;
      }

      .variant-customer .menu-item-description {
        color: #333333;
      }

      .variant-customer .allergen-matrix-header {
        border-bottom-color: #e0e0e0;
      }

      .variant-customer .allergen-matrix-header h2 {
        color: #000000;
      }

      .variant-customer .allergen-matrix-header p {
        color: #333333;
      }

      .variant-customer .allergen-matrix-table {
        background: #ffffff;
        border-color: #e0e0e0;
      }

      .variant-customer .allergen-matrix-table thead {
        background: #f5f5f5;
      }

      .variant-customer .allergen-matrix-table th {
        color: #000000;
        border-color: #e0e0e0;
      }

      .variant-customer .allergen-matrix-table th svg {
        color: #000000;
      }

      .variant-customer .allergen-matrix-table tbody tr {
        border-bottom-color: #e8e8e8;
      }

      .variant-customer .allergen-matrix-table tbody tr:nth-child(even) {
        background: #f9f9f9;
      }

      .variant-customer .allergen-matrix-table td {
        color: #000000;
        border-color: #e8e8e8;
      }

      .variant-customer .allergen-matrix-table td.item-name {
        color: #000000;
      }

      .variant-customer .allergen-matrix-table .allergen-present {
        color: #c62828;
      }

      .variant-customer .allergen-matrix-table .allergen-absent {
        color: #cccccc;
      }
    }
  `;
}
