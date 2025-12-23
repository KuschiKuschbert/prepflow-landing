/**
 * Get customer variant styles (polished, marketing-focused, photo-ready)
 *
 * @returns {string} CSS for customer variant
 */
export function getCustomerVariantCSS(): string {
  return `
    /* Customer Variant - Polished, Marketing-Focused, Photo-Ready */
    body.variant-customer {
      background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
      padding: 40px 20px;
    }

    .variant-customer .content-wrapper {
      background: #ffffff;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      padding: 48px;
      max-width: 1000px;
      border-radius: 0;
      border: 1px solid #e8e8e8;
    }

    .variant-customer .header {
      padding-bottom: 32px;
      margin-bottom: 40px;
      border-bottom: 3px solid #f0f0f0;
    }

    .variant-customer .header-content h1 {
      font-size: 42px;
      font-weight: 300;
      color: #1a1a1a;
      background: none;
      -webkit-text-fill-color: #1a1a1a;
      margin: 0;
      letter-spacing: -0.5px;
      font-family: Georgia, 'Times New Roman', serif;
    }

    .variant-customer .header-content h2 {
      font-size: 18px;
      color: #666666;
      margin: 8px 0 0 0;
      font-weight: 400;
      font-style: italic;
    }

    .variant-customer .header-meta {
      color: #999999;
      font-size: 12px;
      font-weight: 300;
    }

    .variant-customer .export-content {
      margin-top: 0;
    }

    @media print {
      body.variant-customer {
        background: #ffffff;
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
        border-bottom-color: #e0e0e0;
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

