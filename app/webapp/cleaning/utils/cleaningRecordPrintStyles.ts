/**
 * Print styles for cleaning records
 * Compliance-focused styling for cleaning record exports
 */

export function getCleaningRecordPrintStyles(): string {
  return `
    .cleaning-records-content {
      width: 100%;
    }

    .cleaning-records-empty {
      padding: 2rem;
      text-align: center;
      color: #666;
    }

    .cleaning-records-meta {
      margin-bottom: 1.5rem;
      padding: 1rem;
      background-color: #f5f5f5;
      border-radius: 8px;
    }

    .cleaning-records-meta p {
      margin: 0.25rem 0;
      color: #333;
      font-size: 0.875rem;
    }

    .cleaning-records-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1rem;
    }

    .cleaning-records-table thead {
      background-color: #f5f5f5;
    }

    .cleaning-records-table th {
      padding: 0.75rem;
      text-align: left;
      font-weight: 600;
      font-size: 0.875rem;
      color: #333;
      border-bottom: 2px solid #e0e0e0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .cleaning-records-table td {
      padding: 0.75rem;
      border-bottom: 1px solid #e0e0e0;
      color: #333;
      font-size: 0.875rem;
    }

    .cleaning-records-table tbody tr:hover {
      background-color: #f9f9f9;
    }

    .area-name {
      font-weight: 500;
      color: #000;
    }

    .task-name {
      font-weight: 500;
      color: #000;
    }

    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    @media print {
      .cleaning-records-table {
        font-size: 0.75rem;
      }

      .cleaning-records-table th,
      .cleaning-records-table td {
        padding: 0.5rem;
      }

      .cleaning-records-meta {
        page-break-inside: avoid;
      }

      .cleaning-records-table tbody tr {
        page-break-inside: avoid;
      }
    }
  `;
}

