/**
 * CSS styles for prep list printing
 */

export function getPrintStyles(): string {
  return `
    @page {
      margin: 1cm;
      size: A4;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 12pt;
      line-height: 1.5;
      color: #000;
      background: #fff;
    }

    .prep-list-print {
      max-width: 100%;
    }

    .prep-list-header {
      border-bottom: 2px solid #000;
      padding-bottom: 1rem;
      margin-bottom: 1.5rem;
    }

    .prep-list-header h1 {
      font-size: 24pt;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .prep-list-meta {
      display: flex;
      gap: 1.5rem;
      font-size: 10pt;
      color: #666;
    }

    .prep-list-notes {
      margin-bottom: 1.5rem;
      padding: 0.75rem;
      background: #f5f5f5;
      border-left: 3px solid #000;
    }

    .prep-list-section {
      page-break-inside: avoid;
      margin-bottom: 2rem;
    }

    .prep-list-section h2 {
      font-size: 18pt;
      font-weight: bold;
      margin-bottom: 1rem;
      border-bottom: 1px solid #ccc;
      padding-bottom: 0.5rem;
    }

    .prep-list-section h3 {
      font-size: 14pt;
      font-weight: bold;
      margin-top: 1rem;
      margin-bottom: 0.75rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1rem;
    }

    table thead {
      background: #f0f0f0;
    }

    table th {
      text-align: left;
      padding: 0.5rem;
      font-weight: bold;
      border-bottom: 2px solid #000;
    }

    table td {
      padding: 0.5rem;
      border-bottom: 1px solid #ddd;
    }

    table tbody tr:hover {
      background: #f9f9f9;
    }

    .prep-list-instructions {
      margin-top: 1.5rem;
    }

    .instruction-item {
      margin-bottom: 1.5rem;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      page-break-inside: avoid;
    }

    .instruction-item h4 {
      font-size: 13pt;
      font-weight: bold;
      margin-bottom: 0.5rem;
      color: #000;
    }

    .instruction-source {
      font-size: 10pt;
      color: #666;
      margin-bottom: 0.75rem;
      font-style: italic;
    }

    .instruction-content {
      white-space: pre-wrap;
      line-height: 1.6;
    }

    @media print {
      .prep-list-section {
        page-break-inside: avoid;
      }

      .instruction-item {
        page-break-inside: avoid;
      }
    }
  `;
}
