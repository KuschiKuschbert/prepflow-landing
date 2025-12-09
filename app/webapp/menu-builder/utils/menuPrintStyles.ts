/**
 * CSS styles for menu printing
 *
 * Menu-specific print styles
 *
 * Global styles (body, @page, etc.) are handled by the export template.
 * These styles focus on menu item layout, allergen icons, and matrix table.
 */

import { getCustomerVariantStyles } from './menuPrintStyles/customerVariant';
import { getDefaultStyles } from './menuPrintStyles/defaultStyles';

/**
 * Get menu print styles based on variant
 *
 * @param {('default' | 'customer')} variant - Style variant (default: 'default')
 * @returns {string} CSS styles for menu printing
 */
export function getMenuPrintStyles(variant: 'default' | 'customer' = 'default'): string {
  const defaultStyles = getDefaultStyles();
  const customerVariantStyles = variant === 'customer' ? getCustomerVariantStyles() : '';

  return `${defaultStyles}${customerVariantStyles}`;
}
