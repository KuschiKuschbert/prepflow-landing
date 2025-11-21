/**
 * CSS styles for menu printing
 */

/**
 * Menu-specific print styles
 *
 * Global styles (body, @page, etc.) are handled by the export template.
 * These styles focus on menu item layout, allergen icons, and matrix table.
 */

export function getMenuPrintStyles(): string {
  return `
    /* Menu Content Container */
    .menu-print {
      max-width: 100%;
    }

    /* Category Sections */
    .menu-category {
      page-break-inside: avoid;
      margin-bottom: 2rem;
      margin-top: 1.5rem;
    }

    .menu-category:first-of-type {
      margin-top: 0;
    }

    .menu-category h2 {
      font-size: 20pt;
      font-weight: bold;
      margin-bottom: 1rem;
      border-bottom: 2px solid rgba(255, 255, 255, 0.2);
      padding-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: rgba(255, 255, 255, 0.95);
    }

    /* Menu Items */
    .menu-item {
      page-break-inside: avoid;
      margin-bottom: 1.25rem;
      padding-bottom: 1rem;
      border-bottom: 1px dotted rgba(255, 255, 255, 0.1);
    }

    .menu-item:last-child {
      border-bottom: none;
    }

    .menu-item-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.5rem;
    }

    .menu-item-name {
      font-size: 14pt;
      font-weight: bold;
      color: rgba(255, 255, 255, 0.95);
      flex: 1;
    }

    .menu-item-price {
      font-size: 14pt;
      font-weight: bold;
      color: rgba(255, 255, 255, 0.95);
      margin-left: 1rem;
      white-space: nowrap;
    }

    .menu-item-description {
      font-size: 10pt;
      color: rgba(255, 255, 255, 0.7);
      font-style: italic;
      margin-top: 0.25rem;
      margin-bottom: 0.5rem;
      line-height: 1.5;
    }

    .menu-item-allergens {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.5rem;
      align-items: center;
    }

    .allergen-icon {
      display: inline-block;
      width: 14px;
      height: 14px;
      vertical-align: middle;
      color: rgba(255, 255, 255, 0.7);
    }

    .allergen-icon svg {
      width: 100%;
      height: 100%;
    }

    /* Allergen Matrix Page */
    .allergen-matrix-page {
      page-break-before: always;
      margin-top: 2rem;
    }

    .allergen-matrix-header {
      border-bottom: 2px solid rgba(255, 255, 255, 0.2);
      padding-bottom: 1rem;
      margin-bottom: 1.5rem;
    }

    .allergen-matrix-header h2 {
      font-size: 24pt;
      font-weight: bold;
      margin-bottom: 0.5rem;
      color: rgba(255, 255, 255, 0.95);
    }

    .allergen-matrix-header p {
      color: rgba(255, 255, 255, 0.7);
      font-size: 12pt;
    }

    /* Allergen Matrix Table */
    .allergen-matrix-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
      background: rgba(26, 26, 26, 0.8);
      border-radius: 8px;
      overflow: hidden;
    }

    .allergen-matrix-table thead {
      background: linear-gradient(135deg, rgba(42, 42, 42, 0.9) 0%, rgba(42, 42, 42, 0.7) 100%);
    }

    .allergen-matrix-table th {
      text-align: center;
      padding: 0.5rem 0.25rem;
      font-weight: bold;
      border: 1px solid rgba(42, 42, 42, 0.8);
      font-size: 8pt;
      vertical-align: bottom;
      line-height: 1.2;
      color: rgba(255, 255, 255, 0.9);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .allergen-matrix-table th.item-name {
      text-align: left;
      font-size: 10pt;
      padding: 0.75rem 0.5rem;
    }

    .allergen-matrix-table th svg {
      width: 12px;
      height: 12px;
      margin-bottom: 0.25rem;
      color: rgba(255, 255, 255, 0.9);
    }

    .allergen-matrix-table tbody tr {
      border-bottom: 1px solid rgba(42, 42, 42, 0.6);
    }

    .allergen-matrix-table tbody tr:nth-child(even) {
      background: rgba(26, 26, 26, 0.4);
    }

    .allergen-matrix-table td {
      padding: 0.5rem;
      border: 1px solid rgba(42, 42, 42, 0.6);
      text-align: center;
      font-size: 9pt;
      color: rgba(255, 255, 255, 0.9);
    }

    .allergen-matrix-table td.item-name {
      text-align: left;
      font-weight: 500;
      font-size: 10pt;
      color: rgba(255, 255, 255, 0.95);
    }

    .allergen-matrix-table .allergen-present {
      color: #ff6b6b;
      font-weight: bold;
    }

    .allergen-matrix-table .allergen-absent {
      color: rgba(255, 255, 255, 0.4);
    }

    /* Print Media Queries - Adapt colors for print */
    @media print {
      .menu-category h2 {
        border-bottom-color: #000;
        color: #000;
      }

      .menu-item {
        border-bottom-color: #ccc;
        page-break-inside: avoid;
      }

      .menu-item-name,
      .menu-item-price {
        color: #000;
      }

      .menu-item-description {
        color: #555;
      }

      .allergen-icon {
        color: #666;
      }

      .allergen-matrix-header {
        border-bottom-color: #000;
      }

      .allergen-matrix-header h2 {
        color: #000;
      }

      .allergen-matrix-header p {
        color: #333;
      }

      .allergen-matrix-table {
        background: #ffffff;
      }

      .allergen-matrix-table thead {
        background: #f0f0f0;
      }

      .allergen-matrix-table th {
        color: #000;
        border-color: #ccc;
      }

      .allergen-matrix-table th svg {
        color: #000;
      }

      .allergen-matrix-table tbody tr {
        border-bottom-color: #e0e0e0;
      }

      .allergen-matrix-table tbody tr:nth-child(even) {
        background: #f9f9f9;
      }

      .allergen-matrix-table td {
        color: #000;
        border-color: #e0e0e0;
      }

      .allergen-matrix-table td.item-name {
        color: #000;
      }

      .allergen-matrix-table .allergen-present {
        color: #d32f2f;
      }

      .allergen-matrix-table .allergen-absent {
        color: #999;
      }

      .allergen-matrix-page {
        page-break-before: always;
      }
    }
  `;
}
