/**
 * Base compliance variant styles (body, wrapper, header)
 *
 * @returns {string} CSS for base compliance variant
 */
export function getComplianceBaseStyles(): string {
  return `
    /* Compliance Variant - Audit-Ready, Formal Layout */
    body.variant-compliance {
      background: #ffffff;
      padding: 20px;
    }

    .variant-compliance .content-wrapper {
      background: #ffffff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 40px;
      max-width: 1000px;
      border-radius: 0;
      border: 1px solid #cccccc;
    }

    .variant-compliance .header {
      padding-bottom: 24px;
      margin-bottom: 32px;
      border-bottom: 3px solid #000000;
    }

    .variant-compliance .header-content h1 {
      font-size: 28px;
      font-weight: 700;
      color: #000000;
      background: none;
      -webkit-text-fill-color: #000000;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-family: Arial, sans-serif;
    }

    .variant-compliance .header-content h2 {
      font-size: 16px;
      color: #333333;
      margin: 8px 0 0 0;
      font-weight: 400;
      text-transform: none;
    }

    .variant-compliance .header-meta {
      color: #666666;
      font-size: 11px;
      font-weight: 500;
      font-family: 'Courier New', monospace;
    }

    .variant-compliance .export-content {
      margin-top: 0;
    }

    @media print {
      body.variant-compliance {
        padding: 0;
      }

      .variant-compliance .content-wrapper {
        padding: 30px;
        box-shadow: none;
        border: 1px solid #000000;
      }

      .variant-compliance .header {
        border-bottom-color: #000000;
      }

      @page {
        margin: 1.5cm;
      }
    }
  `;
}

