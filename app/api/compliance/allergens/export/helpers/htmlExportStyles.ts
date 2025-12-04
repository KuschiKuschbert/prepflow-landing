/**
 * CSS styles for HTML allergen export
 */

export const ALLERGEN_EXPORT_STYLES = `
  .table-container {
    overflow-x: auto;
    margin-top: 32px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: rgba(26, 26, 26, 0.8);
    border-radius: 16px;
    overflow: hidden;
  }

  thead {
    background: linear-gradient(135deg, rgba(42, 42, 42, 0.9) 0%, rgba(42, 42, 42, 0.7) 100%);
  }

  th {
    padding: 16px 20px;
    text-align: left;
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(42, 42, 42, 0.8);
    border-bottom: 2px solid rgba(41, 231, 205, 0.3);
  }

  tbody tr {
    border-bottom: 1px solid rgba(42, 42, 42, 0.6);
    transition: background-color 0.2s;
  }

  tbody tr:nth-child(even) {
    background: rgba(26, 26, 26, 0.4);
  }

  tbody tr:hover {
    background: rgba(41, 231, 205, 0.05);
  }

  td {
    padding: 16px 20px;
    border: 1px solid rgba(42, 42, 42, 0.6);
    color: rgba(255, 255, 255, 0.9);
    font-size: 14px;
    vertical-align: top;
  }

  .item-name {
    font-weight: 600;
    color: #ffffff;
  }

  .allergens-list {
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.6;
  }

  .ingredients-list {
    color: rgba(255, 255, 255, 0.8);
    font-size: 13px;
    line-height: 1.6;
  }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: rgba(255, 255, 255, 0.5);
  }

  .empty-state h3 {
    font-size: 20px;
    margin-bottom: 8px;
    color: rgba(255, 255, 255, 0.7);
  }

  @media print {
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

    .item-name {
      color: #000000;
    }

    .allergens-list,
    .ingredients-list {
      color: #000000;
    }

    thead {
      display: table-header-group;
    }

    tbody tr {
      page-break-inside: avoid;
    }
  }
`;
