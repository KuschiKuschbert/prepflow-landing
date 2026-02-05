/**
 * Get compact variant styles (compact layout, minimal spacing)
 *
 * @returns {string} CSS for compact variant
 */
export function getCompactVariantCSS(): string {
  return `
    /* Compact Variant - Compact Layout, Minimal Spacing */
    body.variant-compact {
      background: var(--pf-color-bg-page);
      padding: 10px;
    }

    .variant-compact .content-wrapper {
      background: var(--pf-color-bg-content);
      box-shadow: none;
      padding: 20px;
      max-width: 100%;
      border-radius: var(--pf-border-radius);
      border: 1px solid var(--pf-color-border);
    }

    .variant-compact .header {
      padding-bottom: 12px;
      margin-bottom: 16px;
      border-bottom: 1px solid var(--pf-color-border);
    }

    .variant-compact .header-content h1 {
      font-size: 18px;
      font-weight: 600;
      color: var(--pf-color-text-header);
      background: none;
      -webkit-text-fill-color: var(--pf-color-text-header);
      margin: 0;
    }

    .variant-compact .header-content h2 {
      font-size: 12px;
      color: var(--pf-color-text-muted);
      margin: 4px 0 0 0;
      font-weight: 400;
    }

    .variant-compact .header-meta {
      color: var(--pf-color-text-muted);
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
