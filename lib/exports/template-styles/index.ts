/**
 * Shared Cyber Carrot print/export styles
 * Provides consistent styling across all print and export templates
 */

import { getThemeCSS, type ExportTheme } from '../themes';
import {
  getBackgroundElementsCSS,
  getBaseStylesCSS,
  getContentWrapperCSS,
  getFooterCSS,
  getHeaderCSS,
  getPrintMediaCSS,
} from './helpers/baseStyles';
import { getThemeBackgroundCSS } from './helpers/getThemeBackgroundCSS';
import {
  getCompactVariantCSS,
  getComplianceVariantCSS,
  getCustomerVariantCSS,
  getKitchenVariantCSS,
  getMatrixVariantCSS,
  getMenuVariantCSS,
  getRecipeVariantCSS,
  getSupplierVariantCSS,
} from './helpers/variantStyles';

// Re-export base styles functions
export {
  getBackgroundElementsCSS,
  getBaseStylesCSS,
  getContentWrapperCSS,
  getFooterCSS,
  getHeaderCSS,
  getPrintMediaCSS,
};

// Re-export variant styles functions
export {
  getCompactVariantCSS,
  getComplianceVariantCSS,
  getCustomerVariantCSS,
  getKitchenVariantCSS,
  getMatrixVariantCSS,
  getMenuVariantCSS,
  getRecipeVariantCSS,
  getSupplierVariantCSS,
};

/**
 * Get all Cyber Carrot template styles
 *
 * @param {string} variant - Template variant ('default' | 'kitchen' | 'customer' | 'supplier' | 'compliance' | 'compact' | 'menu' | 'recipe')
 * @param {ExportTheme} theme - Aesthetic theme ('cyber-carrot' | 'electric-lemon' | 'phantom-pepper' | 'cosmic-blueberry')
 * @returns {string} Complete CSS for print/export templates
 */
export function getAllTemplateStyles(
  variant: string = 'default',
  theme: ExportTheme = 'cyber-carrot',
): string {
  const themeStyles = getThemeCSS(theme);
  const backgroundStyles = getThemeBackgroundCSS(theme);

  const baseStyles = `
    ${themeStyles}
    ${backgroundStyles}
    ${getBaseStylesCSS()}
    ${getContentWrapperCSS()}
    ${getHeaderCSS()}
    ${getFooterCSS()}
    ${getPrintMediaCSS()}
  `;

  switch (variant) {
    case 'customer':
      return `
        ${baseStyles}
        ${getCustomerVariantCSS()}
      `;
    case 'compliance':
      return `
        ${baseStyles}
        ${getComplianceVariantCSS()}
      `;
    case 'supplier':
      return `
        ${baseStyles}
        ${getSupplierVariantCSS()}
      `;
    case 'compact':
      return `
        ${baseStyles}
        ${getCompactVariantCSS()}
      `;
    case 'kitchen':
      return `
        ${baseStyles}
        ${getKitchenVariantCSS()}
      `;
    case 'menu':
      return `
        ${baseStyles}
        ${getMenuVariantCSS()}
      `;
    case 'recipe':
      return `
        ${baseStyles}
        ${getRecipeVariantCSS()}
      `;
    case 'matrix':
      return `
        ${baseStyles}
        ${getMatrixVariantCSS()}
      `;
    default:
      return `
        ${baseStyles}
        ${getBackgroundElementsCSS()}
      `;
  }
}
