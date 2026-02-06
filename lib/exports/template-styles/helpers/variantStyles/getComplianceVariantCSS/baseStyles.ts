/**
 * Base compliance variant styles (body, wrapper, header)
 *
 * @returns {string} CSS for base compliance variant
 */
export function getComplianceBaseStyles(): string {
  return `
    /* Compliance Variant - Audit-Ready, Formal Layout */
    body.variant-compliance {
      background: var(--pf-color-bg-page);
      padding: 20px;
    }

    .variant-compliance .content-wrapper {
      background: var(--pf-color-bg-content);
      box-shadow: var(--pf-shadow-content);
      padding: 40px;
      max-width: 1000px;
      border-radius: var(--pf-border-radius);
      border: 1px solid var(--pf-color-border);
    }

    .variant-compliance .header {
      padding-bottom: 24px;
      margin-bottom: 32px;
      border-bottom: 3px solid var(--pf-color-text-main);
    }

    .variant-compliance .header-content h1 {
      font-size: 28px;
      font-weight: 700;
      color: var(--pf-color-text-header);
      background: none;
      -webkit-text-fill-color: var(--pf-color-text-header);
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-family: var(--pf-font-family-header);
    }

    .variant-compliance .header-content h2 {
      font-size: 16px;
      color: var(--pf-color-text-muted);
      margin: 8px 0 0 0;
      font-weight: 400;
      text-transform: none;
    }

    .variant-compliance .header-meta {
      color: var(--pf-color-text-muted);
      font-size: 11px;
      font-weight: 500;
      font-family: var(--pf-font-family-body);
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
        border: 1px solid var(--pf-color-border);
      }

      .variant-compliance .header {
        border-bottom-color: var(--pf-color-border);
      }

      @page {
        margin: 1.5cm;
      }
    }
  `;
}
