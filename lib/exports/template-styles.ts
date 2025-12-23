/**
 * Shared Cyber Carrot print/export styles
 * Provides consistent styling across all print and export templates
 */

import {
  getBackgroundElementsCSS,
  getContentWrapperCSS,
  getHeaderCSS,
  getFooterCSS,
  getPrintMediaCSS,
  getBaseStylesCSS,
} from './template-styles/helpers/baseStyles';
import {
  getCustomerVariantCSS,
  getSupplierVariantCSS,
  getComplianceVariantCSS,
  getCompactVariantCSS,
  getKitchenVariantCSS,
} from './template-styles/helpers/variantStyles';

// Re-export base styles functions
export {
  getBackgroundElementsCSS,
  getContentWrapperCSS,
  getHeaderCSS,
  getFooterCSS,
  getPrintMediaCSS,
  getBaseStylesCSS,
};

// Re-export variant styles functions
export {
  getCustomerVariantCSS,
  getSupplierVariantCSS,
  getComplianceVariantCSS,
  getCompactVariantCSS,
  getKitchenVariantCSS,
};

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
