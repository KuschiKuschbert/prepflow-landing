/**
 * Print styles for recipes
 * Recipe-focused styling for recipe exports
 */

export function getRecipePrintStyles(): string {
  return `
    .recipe-print-content {
      width: 100%;
    }

    .recipe-header {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 2px solid rgba(42, 42, 42, 0.8);
    }

    .recipe-title {
      font-size: 2rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 0.5rem;
    }

    .recipe-description {
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .recipe-meta {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.7);
    }

    .recipe-meta div {
      margin: 0;
    }

    .recipe-section {
      margin-bottom: 2rem;
    }

    .recipe-section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid rgba(42, 42, 42, 0.8);
    }

    .recipe-ingredients-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1rem;
    }

    .recipe-ingredients-table thead {
      background-color: rgba(42, 42, 42, 0.5);
    }

    .recipe-ingredients-table th {
      padding: 0.75rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
      border-bottom: 2px solid rgba(41, 231, 205, 0.3);
      text-align: left;
    }

    .recipe-ingredients-table th.text-right {
      text-align: right;
    }

    .recipe-ingredients-table td {
      padding: 0.75rem;
      color: rgba(255, 255, 255, 0.9);
      border-bottom: 1px solid rgba(42, 42, 42, 0.5);
    }

    .recipe-ingredients-table td.text-right {
      text-align: right;
    }

    .recipe-ingredients-table tbody tr:hover {
      background-color: rgba(42, 42, 42, 0.2);
    }

    .recipe-total-row {
      background-color: rgba(42, 42, 42, 0.3);
      font-weight: 600;
    }

    .recipe-profit {
      font-weight: 600;
    }

    .recipe-profit.profit-positive {
      color: #29E7CD;
    }

    .recipe-profit.profit-negative {
      color: #D925C7;
    }

    .recipe-instructions,
    .recipe-notes {
      white-space: pre-wrap;
      line-height: 1.8;
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.9375rem;
    }

    @media print {
      .recipe-title {
        font-size: 1.75rem;
      }

      .recipe-section-title {
        font-size: 1.25rem;
      }

      .recipe-ingredients-table {
        font-size: 0.875rem;
      }

      .recipe-ingredients-table th,
      .recipe-ingredients-table td {
        padding: 0.5rem;
      }

      .recipe-instructions,
      .recipe-notes {
        font-size: 0.875rem;
      }
    }
  `;
}

