/**
 * Get compact variant styles (compact layout, minimal spacing)
 *
 * @returns {string} CSS for compact variant
 */
export function getCompactVariantCSS(): string {
  return `
    /* Compact Variant - Compact Layout, Minimal Spacing */
    body.variant-compact {
      background: #ffffff;
      padding: 10px;
    }

    .variant-compact .content-wrapper {
      background: #ffffff;
      box-shadow: none;
      padding: 20px;
      max-width: 100%;
      border-radius: 0;
      border: 1px solid #e0e0e0;
    }

    .variant-compact .header {
      padding-bottom: 12px;
      margin-bottom: 16px;
      border-bottom: 1px solid #e0e0e0;
    }

    .variant-compact .header-content h1 {
      font-size: 18px;
      font-weight: 600;
      color: #000000;
      background: none;
      -webkit-text-fill-color: #000000;
      margin: 0;
    }

    .variant-compact .header-content h2 {
      font-size: 12px;
      color: #666666;
      margin: 4px 0 0 0;
      font-weight: 400;
    }

    .variant-compact .header-meta {
      color: #999999;
      font-size: 10px;
    }

    .variant-compact .export-content {
      margin-top: 0;
    }

    @media print {
      body.variant-compact {
        padding: 0;
      }

      .variant-compact .content-wrapper {
        padding: 15px;
        border: none;
      }

      .variant-compact .header {
        padding-bottom: 8px;
        margin-bottom: 12px;
      }

      .variant-compact .header-content h1 {
        font-size: 16px;
      }

      .variant-compact .header-content h2 {
        font-size: 11px;
      }

      @page {
        margin: 1cm;
      }
    }
  `;
}

