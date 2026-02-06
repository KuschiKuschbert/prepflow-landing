/**
 * Get customer variant styles (polished, marketing-focused, photo-ready)
 *
 * @returns {string} CSS for customer variant
 */
export function getCustomerVariantCSS(): string {
  return `
    /* Customer Variant - Polished, Marketing-Focused, Photo-Ready */
    body.variant-customer {
      background: linear-gradient(180deg, var(--pf-color-bg-page) 0%, var(--pf-color-bg-page) 100%);
      padding: 40px 20px;
    }

    .variant-customer .content-wrapper {
      background: var(--pf-color-bg-content);
      box-shadow: var(--pf-shadow-content);
      padding: 48px;
      max-width: 1000px;
      border-radius: var(--pf-border-radius);
      border: var(--pf-border-width) solid var(--pf-color-border);
    }

    .variant-customer .header {
      padding-bottom: 32px;
      margin-bottom: 40px;
      border-bottom: 3px solid var(--pf-color-border);
    }

    .variant-customer .header-content h1 {
      font-size: 42px;
      font-weight: 300;
      color: var(--pf-color-text-header);
      background: none;
      -webkit-text-fill-color: var(--pf-color-text-header);
      margin: 0;
      letter-spacing: -0.5px;
      font-family: var(--pf-font-family-header);
    }

    .variant-customer .header-content h2 {
      font-size: 18px;
      color: var(--pf-color-text-muted);
      margin: 8px 0 0 0;
      font-weight: 400;
      font-style: italic;
    }

    .variant-customer .header-meta {
      color: var(--pf-color-text-muted);
      font-size: 12px;
      font-weight: 300;
    }

    .variant-customer .export-content {
      margin-top: 0;
    }

    @media print {
      body.variant-customer {
        /* background: #ffffff; -- Removed */
        padding: 0;
      }

      .variant-customer .content-wrapper {
        padding: 30px;
        box-shadow: none;
        border: none;
      }

      .variant-customer .header {
        padding-bottom: 24px;
        margin-bottom: 32px;
        /* border-bottom-color: #e0e0e0; -- Removed */
      }

      .variant-customer .header-content h1 {
        font-size: 36px;
      }

      .variant-customer .header-content h2 {
        font-size: 16px;
      }

      @page {
        margin: 2cm;
      }
    }
  `;
}
