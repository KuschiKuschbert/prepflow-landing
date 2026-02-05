/**
 * Get kitchen variant styles (compact, minimal branding)
 *
 * @returns {string} CSS for kitchen variant
 */
export function getKitchenVariantCSS(): string {
  return `
    /* Kitchen Variant - Compact, Minimal Branding */
    body.variant-kitchen {
      background: var(--pf-color-bg-page);
      padding: 10px;
    }

    .variant-kitchen .content-wrapper {
      background: var(--pf-color-bg-content);
      box-shadow: none;
      padding: 16px;
      max-width: 100%;
      border-radius: var(--pf-border-radius);
    }

    .variant-kitchen .header {
      padding-bottom: 12px;
      margin-bottom: 16px;
      border-bottom: 1px solid var(--pf-color-border);
    }

    .variant-kitchen .header-content h1 {
      font-size: 20px;
      font-weight: 600;
      color: var(--pf-color-text-header);
      background: none;
      -webkit-text-fill-color: var(--pf-color-text-header);
      margin: 0;
    }

    .variant-kitchen .header-content h2 {
      font-size: 14px;
      color: var(--pf-color-text-muted);
      margin: 4px 0 0 0;
    }

    .variant-kitchen .header-meta {
      color: var(--pf-color-text-muted);
      font-size: 12px;
    }

    .variant-kitchen .export-content {
      margin-top: 0;
    }

    /* Kitchen Checkbox Styles */
    .kitchen-checkbox {
      display: inline-block;
      width: 18px;
      height: 18px;
      border: 2px solid var(--pf-color-text-main);
      border-radius: 3px;
      margin-right: 8px;
      vertical-align: middle;
      position: relative;
      flex-shrink: 0;
    }

    .kitchen-checkbox::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 10px;
      height: 10px;
      background: var(--pf-color-primary);
      border-radius: 2px;
      opacity: 0;
      transition: opacity 0.1s;
    }

    @media print {
      body.variant-kitchen {
        padding: 0;
      }

      .variant-kitchen .content-wrapper {
        padding: 10px;
      }

      .variant-kitchen .header {
        padding-bottom: 8px;
        margin-bottom: 12px;
      }

      .variant-kitchen .header-content h1 {
        font-size: 18px;
      }

      .variant-kitchen .header-content h2 {
        font-size: 12px;
      }

      .kitchen-checkbox {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      @page {
        margin: 0.8cm;
      }
    }
  `;
}
