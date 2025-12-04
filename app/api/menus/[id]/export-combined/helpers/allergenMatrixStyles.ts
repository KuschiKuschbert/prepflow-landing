/**
 * CSS styles for allergen matrix section in combined export
 */

export const allergenMatrixStyles = `
  .allergen-matrix-section {
    page-break-before: always;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 2px solid rgba(42, 42, 42, 0.8);
  }

  .allergen-matrix-header {
    margin-bottom: 1.5rem;
  }

  .allergen-matrix-header h2 {
    font-size: 24px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.95);
    margin: 0 0 0.5rem 0;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .allergen-matrix-header p {
    color: rgba(255, 255, 255, 0.7);
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
    background: rgba(26, 26, 26, 0.8);
    border-radius: 16px;
    overflow: hidden;
    font-size: 12px;
  }

  thead {
    background: linear-gradient(135deg, rgba(42, 42, 42, 0.9) 0%, rgba(42, 42, 42, 0.7) 100%);
  }

  th {
    padding: 12px 8px;
    text-align: left;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(42, 42, 42, 0.8);
    border-bottom: 2px solid rgba(41, 231, 205, 0.3);
  }

  th.allergen-header {
    text-align: center;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    min-width: 30px;
  }

  tbody tr {
    border-bottom: 1px solid rgba(42, 42, 42, 0.6);
  }

  tbody tr:nth-child(even) {
    background: rgba(26, 26, 26, 0.4);
  }

  td {
    border: 1px solid rgba(42, 42, 42, 0.6);
    padding: 8px;
    text-align: center;
    color: rgba(255, 255, 255, 0.9);
  }

  td.item-name {
    text-align: left;
    font-weight: 500;
  }

  td.type {
    text-align: left;
    color: rgba(255, 255, 255, 0.7);
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
    color: rgba(255, 255, 255, 0.5);
  }

  @media print {
    .allergen-matrix-section {
      border-top-color: #000;
      page-break-before: always;
    }

    .allergen-matrix-header h2 {
      color: #000;
    }

    .allergen-matrix-header p {
      color: #333;
    }

    table {
      background: #ffffff;
    }

    thead {
      background: #f5f5f5;
    }

    th {
      color: #000000;
      border-color: #cccccc;
    }

    tbody tr {
      border-color: #e0e0e0;
    }

    tbody tr:nth-child(even) {
      background: #f9f9f9;
    }

    td {
      color: #000000;
      border-color: #e0e0e0;
    }

    td.type {
      color: #666666;
    }

    .has-allergen {
      color: #dc2626;
    }

    .vegetarian {
      background-color: #dcfce7;
      color: #166534;
      border-color: #86efac;
    }

    .vegan {
      background-color: #d1fae5;
      color: #065f46;
      border-color: #6ee7b7;
    }
  }
`;
