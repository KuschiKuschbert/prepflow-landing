/**
 * Get supplier variant styles (purchase order format, formal layout)
 *
 * @returns {string} CSS for supplier variant
 */
export function getSupplierVariantCSS(): string {
  return `
    /* Supplier Variant - Purchase Order Format, Formal Layout */
    body.variant-supplier {
      background: #ffffff;
      padding: 20px;
    }

    .variant-supplier .content-wrapper {
      background: #ffffff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 40px;
      max-width: 900px;
      border-radius: 0;
      border: 2px solid #333333;
    }

    .variant-supplier .header {
      padding-bottom: 24px;
      margin-bottom: 32px;
      border-bottom: 3px solid #333333;
    }

    .variant-supplier .header-content h1 {
      font-size: 32px;
      font-weight: 700;
      color: #000000;
      background: none;
      -webkit-text-fill-color: #000000;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .variant-supplier .header-content h2 {
      font-size: 16px;
      color: #333333;
      margin: 8px 0 0 0;
      font-weight: 400;
    }

    .variant-supplier .header-meta {
      color: #666666;
      font-size: 12px;
      font-weight: 500;
    }

    .variant-supplier .export-content {
      margin-top: 0;
    }

    /* Purchase Order Specific Styles */
    .purchase-order-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-bottom: 32px;
      padding: 20px;
      background: #f8f8f8;
      border: 1px solid #e0e0e0;
    }

    .purchase-order-info-section h3 {
      font-size: 14px;
      font-weight: 700;
      color: #000000;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #333333;
      padding-bottom: 4px;
    }

    .purchase-order-info-section p {
      margin: 4px 0;
      color: #333333;
      font-size: 13px;
      line-height: 1.6;
    }

    .purchase-order-info-section strong {
      font-weight: 600;
      color: #000000;
    }

    @media print {
      body.variant-supplier {
        padding: 0;
      }

      .variant-supplier .content-wrapper {
        padding: 30px;
        box-shadow: none;
        border: 2px solid #000000;
      }

      .variant-supplier .header {
        padding-bottom: 20px;
        margin-bottom: 24px;
        border-bottom-color: #000000;
      }

      .variant-supplier .header-content h1 {
        font-size: 28px;
      }

      .variant-supplier .header-content h2 {
        font-size: 14px;
      }

      .purchase-order-info {
        background: #ffffff;
        border-color: #000000;
      }

      .purchase-order-info-section h3 {
        border-bottom-color: #000000;
      }

      @page {
        margin: 1.5cm;
      }
    }
  `;
}
