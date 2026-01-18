/**
 * Format menu for printing
 *
 * Generates HTML structure for printable menu with items, descriptions, prices, allergens, and allergen matrix
 */

import type { Menu, MenuItem } from '../types';
import { AUSTRALIAN_ALLERGENS } from '@/lib/allergens/australian-allergens';
import { formatCategorySection } from './formatMenuForPrint/helpers/formatCategorySection';
import { generateAllergenMatrix } from './formatMenuForPrint/helpers/generateAllergenMatrix';

const _VALID_ALLERGEN_CODES = AUSTRALIAN_ALLERGENS.map(a => a.code);

/**
 * Escape HTML special characters.
 *
 * @param {string} text - Text to escape
 * @returns {string} Escaped HTML text
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Format menu for printing.
 *
 * Uses existing descriptions only - no AI generation (for instant printing).
 *
 * @param {Menu} menu - Menu object
 * @param {MenuItem[]} menuItems - Array of menu items (should include existing descriptions)
 * @returns {string} HTML string for printing
 */
export function formatMenuForPrint(
  menu: Menu,
  menuItems: MenuItem[],
  variant: 'default' | 'customer' = 'default',
): string {
  // Return content HTML only - template provides header, logo, background elements
  const variantClass = variant === 'customer' ? 'variant-customer' : '';
  let html = `<div class="menu-print ${variantClass}">`;

  // Group items by category
  const itemsByCategory = new Map<string, MenuItem[]>();
  menuItems.forEach(item => {
    const category = item.category || 'Uncategorized';
    if (!itemsByCategory.has(category)) {
      itemsByCategory.set(category, []);
    }
    itemsByCategory.get(category)!.push(item);
  });

  // Sort categories alphabetically
  const sortedCategories = Array.from(itemsByCategory.keys()).sort();

  sortedCategories.forEach(category => {
    html += formatCategorySection(category, itemsByCategory.get(category)!);
  });

  html += generateAllergenMatrix(menuItems);
  html += `</div>`;

  return html;
}
