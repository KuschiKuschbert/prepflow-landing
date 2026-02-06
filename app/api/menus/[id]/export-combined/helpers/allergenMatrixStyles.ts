/**
 * CSS styles for allergen matrix section in combined export
 */

export const allergenMatrixStyles = `
  .allergen-matrix-section {
    page-break-before: always;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: var(--pf-border-width) solid var(--pf-color-border);
  }

  .allergen-matrix-header {
    margin-bottom: 1.5rem;
  }

  .allergen-matrix-header h2 {
    font-family: var(--pf-font-family-header);
    font-size: 24px;
    font-weight: 700;
    color: var(--pf-color-text-header);
    margin: 0 0 0.5rem 0;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .allergen-matrix-header p {
    color: var(--pf-color-text-muted);
    font-size: 14px;
    margin: 0;
  }

  .table-container {
    overflow-x: auto;
    margin-top: 1rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: var(--pf-color-bg-content);
    border-radius: var(--pf-border-radius);
    overflow: hidden;
    font-size: 12px;
  }

  thead {
    background: var(--pf-color-bg-header);
    color: var(--pf-color-text-header);
  }

  th {
    padding: 12px 8px;
    text-align: left;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 11px;
    color: var(--pf-color-text-header);
    border: 1px solid var(--pf-color-border);
    border-bottom: 2px solid var(--pf-color-primary);
  }

  th.allergen-header {
    text-align: center;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    min-width: 30px;
  }

  tbody tr {
    border-bottom: 1px solid var(--pf-color-border);
  }

  tbody tr:nth-child(even) {
    background: rgba(255, 255, 255, 0.03);
  }

  td {
    border: 1px solid var(--pf-color-border);
    padding: 8px;
    text-align: center;
    color: var(--pf-color-text-main);
  }

  td.item-name {
    text-align: left;
    font-weight: 500;
    font-family: var(--pf-font-family-header);
  }

  td.type {
    text-align: left;
    color: var(--pf-color-text-muted);
  }

  .has-allergen {
    color: #ef4444;
    font-weight: bold;
  }

  .dietary-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 500;
    margin-right: 4px;
  }

  .vegetarian {
    background-color: rgba(34, 197, 94, 0.2);
    color: #86efac;
    border: 1px solid rgba(34, 197, 94, 0.3);
  }

  .vegan {
    background-color: rgba(16, 185, 129, 0.2);
    color: #6ee7b7;
    border: 1px solid rgba(16, 185, 129, 0.3);
  }

  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: var(--pf-color-text-muted);
  }

  @media print {
    .allergen-matrix-section {
      page-break-before: always;
      border-top-color: #000;
    }

    table {
      /* background: #fff; -- Removed to allow theme colors */
    }
  }
`;
