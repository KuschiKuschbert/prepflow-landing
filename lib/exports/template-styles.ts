/**
 * Shared Cyber Carrot print/export styles
 * Provides consistent styling across all print and export templates
 */

/**
 * Get Cyber Carrot background elements CSS
 *
 * @returns {string} CSS for background elements
 */
export function getBackgroundElementsCSS(): string {
  return `
    /* Background Elements */
    .background-grid {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background-image:
        linear-gradient(rgba(41,231,205,0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(59,130,246,0.06) 1px, transparent 1px);
      background-size: 48px 48px;
      background-position: 0px 0px, 0px 0px;
      opacity: 0.6;
    }

    .corner-glow-cyan {
      position: fixed;
      left: 0;
      top: 0;
      width: 420px;
      height: 420px;
      pointer-events: none;
      z-index: 0;
      background: radial-gradient(closest-side, rgba(41,231,205,0.18), transparent 70%);
      opacity: 0.5;
    }

    .corner-glow-magenta {
      position: fixed;
      right: 0;
      top: 120px;
      width: 400px;
      height: 400px;
      pointer-events: none;
      z-index: 0;
      background: radial-gradient(closest-side, rgba(217,37,199,0.16), transparent 70%);
      opacity: 0.5;
    }

    .concentric-circles {
      position: fixed;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 400px;
      height: 400px;
      pointer-events: none;
      z-index: 0;
      opacity: 0.3;
    }

    .circle {
      position: absolute;
      border-radius: 50%;
      border: 1.5px solid rgba(41, 231, 205, 0.08);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .circle-1 { width: 80px; height: 80px; }
    .circle-2 { width: 130px; height: 130px; border-color: rgba(41, 231, 205, 0.06); }
    .circle-3 { width: 180px; height: 180px; border-color: rgba(41, 231, 205, 0.05); }
    .circle-4 { width: 230px; height: 230px; border-color: rgba(41, 231, 205, 0.04); }
  `;
}

/**
 * Get Cyber Carrot content wrapper CSS
 *
 * @returns {string} CSS for content wrapper
 */
export function getContentWrapperCSS(): string {
  return `
    /* Content Container */
    .content-wrapper {
      position: relative;
      z-index: 1;
      max-width: 1200px;
      margin: 0 auto;
      background: rgba(31, 31, 31, 0.95);
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }
  `;
}

/**
 * Get Cyber Carrot header CSS
 *
 * @returns {string} CSS for header
 */
export function getHeaderCSS(): string {
  return `
    /* Header */
    .header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 2px solid rgba(42, 42, 42, 0.8);
    }

    .logo {
      width: 120px;
      height: auto;
      flex-shrink: 0;
      object-fit: contain;
    }

    .header-content h1 {
      font-size: 32px;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
      background: linear-gradient(135deg, #29E7CD 0%, #D925C7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .header-content h2 {
      font-size: 18px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.8);
      margin: 4px 0 0 0;
    }

    .header-meta {
      margin-left: auto;
      text-align: right;
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
    }
  `;
}

/**
 * Get Cyber Carrot footer CSS
 *
 * @returns {string} CSS for footer
 */
export function getFooterCSS(): string {
  return `
    /* Footer */
    .footer {
      margin-top: 40px;
      padding-top: 24px;
      border-top: 2px solid rgba(42, 42, 42, 0.8);
      text-align: center;
      color: rgba(255, 255, 255, 0.5);
      font-size: 12px;
    }
  `;
}

/**
 * Get print-optimized styles (@media print)
 *
 * @returns {string} CSS for print media
 */
export function getPrintMediaCSS(): string {
  return `
    /* Print Styles */
    @media print {
      body {
        background: #ffffff;
        padding: 0;
      }

      .background-grid,
      .corner-glow-cyan,
      .corner-glow-magenta,
      .concentric-circles {
        opacity: 0.15;
      }

      .content-wrapper {
        background: #ffffff;
        box-shadow: none;
        padding: 20px;
      }

      .header-content h1 {
        -webkit-text-fill-color: #000000;
        background: none;
        color: #000000;
      }

      .header-content h2 {
        color: #333333;
      }

      .header-meta {
        color: #666666;
      }

      .footer {
        color: #666666;
        border-color: #e0e0e0;
      }

      @page {
        margin: 1.5cm;
      }
    }
  `;
}

/**
 * Get base styles (reset, typography, page setup)
 *
 * @returns {string} CSS for base styles
 */
export function getBaseStylesCSS(): string {
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    @page {
      margin: 1.5cm;
      size: A4;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(180deg, rgba(10,10,10,1) 0%, rgba(8,8,10,1) 100%);
      color: #ffffff;
      min-height: 100vh;
      position: relative;
      padding: 40px 20px;
    }

    /* Content Area */
    .export-content {
      margin-top: 32px;
    }
  `;
}

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

/**
 * Get compliance variant styles (audit-ready, formal layout, detailed tables)
 *
 * @returns {string} CSS for compliance variant
 */
export function getComplianceVariantCSS(): string {
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

    /* Compliance Report Specific Styles */
    .compliance-report-section {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }

    .compliance-report-section h3 {
      font-size: 16px;
      font-weight: 700;
      color: #000000;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #000000;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .compliance-report-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      border: 1px solid #000000;
      font-size: 11px;
    }

    .compliance-report-table thead {
      background-color: #000000;
    }

    .compliance-report-table th {
      padding: 10px 8px;
      text-align: left;
      font-weight: 700;
      color: #ffffff;
      border: 1px solid #000000;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-size: 10px;
    }

    .compliance-report-table td {
      padding: 8px;
      border: 1px solid #cccccc;
      color: #000000;
      font-size: 11px;
      vertical-align: top;
    }

    .compliance-report-table tbody tr:nth-child(even) {
      background-color: #f9f9f9;
    }

    .compliance-report-summary {
      margin-top: 32px;
      padding: 20px;
      background-color: #f5f5f5;
      border: 2px solid #000000;
    }

    .compliance-report-summary h3 {
      margin-top: 0;
      border-bottom: 2px solid #000000;
    }

    .compliance-report-summary ul {
      margin: 12px 0;
      padding-left: 24px;
      color: #000000;
      font-size: 11px;
      line-height: 1.8;
    }

    .compliance-report-summary li {
      margin-bottom: 8px;
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

      .compliance-report-section {
        page-break-inside: avoid;
      }

      .compliance-report-table {
        border-color: #000000;
      }

      .compliance-report-table th {
        background-color: #000000 !important;
        color: #ffffff !important;
        border-color: #000000 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .compliance-report-table td {
        border-color: #000000 !important;
      }

      .compliance-report-table tbody tr:nth-child(even) {
        background-color: #f5f5f5 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .compliance-report-summary {
        background-color: #f5f5f5 !important;
        border-color: #000000 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      @page {
        margin: 1.5cm;
      }
    }
  `;
}

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

/**
 * Get all Cyber Carrot template styles
 *
 * @param {string} variant - Template variant ('default' | 'kitchen' | 'customer' | 'supplier' | 'compliance' | 'compact')
 * @returns {string} Complete CSS for print/export templates
 */
export function getAllTemplateStyles(variant: string = 'default'): string {
  const baseStyles = `
    ${getBaseStylesCSS()}
    ${getContentWrapperCSS()}
    ${getHeaderCSS()}
    ${getFooterCSS()}
    ${getPrintMediaCSS()}
  `;

  // Customer variant: polished, marketing-focused, photo-ready
  if (variant === 'customer') {
    return `
      ${baseStyles}
      ${getCustomerVariantCSS()}
    `;
  }

  // Compliance variant: audit-ready, formal layout
  if (variant === 'compliance') {
    return `
      ${baseStyles}
      ${getComplianceVariantCSS()}
    `;
  }

  // Supplier variant: purchase order format, formal layout
  if (variant === 'supplier') {
    return `
      ${baseStyles}
      ${getSupplierVariantCSS()}
    `;
  }

  // Compact variant: compact layout, minimal spacing
  if (variant === 'compact') {
    return `
      ${baseStyles}
      ${getCompactVariantCSS()}
    `;
  }

  // Kitchen variant: minimal branding, no background elements
  if (variant === 'kitchen') {
    return `
      ${baseStyles}
      ${getKitchenVariantCSS()}
    `;
  }

  // Default variant: full branding with background elements
  return `
    ${baseStyles}
    ${getBackgroundElementsCSS()}
  `;
}
