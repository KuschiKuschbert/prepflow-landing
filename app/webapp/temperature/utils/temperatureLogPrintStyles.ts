/**
 * Print styles for temperature logs
 * Compliance-focused styling for temperature log exports
 */

export function getTemperatureLogPrintStyles(): string {
  return `
    .temperature-logs-content {
      width: 100%;
    }

    .temperature-logs-empty {
      padding: 2rem;
      text-align: center;
      color: #666;
    }

    .temperature-logs-meta {
      margin-bottom: 1.5rem;
      padding: 1rem;
      background-color: #f5f5f5;
      border-radius: 8px;
    }

    .temperature-logs-meta p {
      margin: 0.25rem 0;
      color: #333;
      font-size: 0.875rem;
    }

    .temperature-logs-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1rem;
    }

    .temperature-logs-table thead {
      background-color: #f5f5f5;
    }

    .temperature-logs-table th {
      padding: 0.75rem;
      text-align: left;
      font-weight: 600;
      font-size: 0.875rem;
      color: #333;
      border-bottom: 2px solid #e0e0e0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .temperature-logs-table td {
      padding: 0.75rem;
      border-bottom: 1px solid #e0e0e0;
      color: #333;
      font-size: 0.875rem;
    }

    .temperature-logs-table tbody tr:hover {
      background-color: #f9f9f9;
    }

    .equipment-name {
      font-weight: 500;
      color: #000;
    }

    .temperature-value {
      font-weight: 600;
      color: #333;
    }

    .compliance-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    @media print {
      .temperature-logs-table {
        font-size: 0.75rem;
      }

      .temperature-logs-table th,
      .temperature-logs-table td {
        padding: 0.5rem;
      }

      .temperature-logs-meta {
        page-break-inside: avoid;
      }

      .temperature-logs-table tbody tr {
        page-break-inside: avoid;
      }
    }
  `;
}




