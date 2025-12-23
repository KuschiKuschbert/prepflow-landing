/**
 * Get kitchen variant styles (compact, minimal branding)
 *
 * @returns {string} CSS for kitchen variant
 */
export function getKitchenVariantCSS(): string {
  return `
    /* Kitchen Variant - Compact, Minimal Branding */
    body.variant-kitchen {
      background: #ffffff;
      padding: 10px;
    }

    .variant-kitchen .content-wrapper {
      background: #ffffff;
      box-shadow: none;
      padding: 16px;
      max-width: 100%;
      border-radius: 0;
    }

    .variant-kitchen .header {
      padding-bottom: 12px;
      margin-bottom: 16px;
      border-bottom: 1px solid #e0e0e0;
    }

    .variant-kitchen .header-content h1 {
      font-size: 20px;
      font-weight: 600;
      color: #000000;
      background: none;
      -webkit-text-fill-color: #000000;
      margin: 0;
    }

    .variant-kitchen .header-content h2 {
      font-size: 14px;
      color: #666666;
      margin: 4px 0 0 0;
    }

    .variant-kitchen .header-meta {
      color: #666666;
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
      border: 2px solid #333;
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
      background: #29E7CD;
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

