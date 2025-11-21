/**
 * Print utilities for menus
 *
 * Uses professional export template with PrepFlow logo and background elements
 * Follows the same synchronous pattern as prep-lists print utility for instant printing
 */

import { formatMenuForPrint } from './formatMenuForPrint';
import { getMenuPrintStyles } from './menuPrintStyles';
import { generateMenuPrintTemplate } from './menuPrintTemplate';
import type { Menu, MenuItem } from '../types';

/**
 * Print menu with all items, descriptions, prices, allergens, and allergen matrix.
 *
 * Uses existing descriptions only - no AI generation (for instant printing).
 * Uses professional export template with PrepFlow branding (logo, background elements).
 * Follows prep-lists pattern: synchronous, instant print.
 *
 * @param {Menu} menu - Menu object
 * @param {MenuItem[]} menuItems - Array of menu items (must already include descriptions if available)
 * @returns {void} Prints immediately
 */
export function printMenu(menu: Menu, menuItems: MenuItem[]): void {
  // Format menu content HTML (content only, no header/footer - template provides those)
  const contentHtml = formatMenuForPrint(menu, menuItems);

  // Get menu-specific styles (template handles global styles)
  const menuStyles = getMenuPrintStyles();

  // Build custom meta info for header
  const customMeta: string[] = [];
  if (menu.locked_at) {
    customMeta.push(`Locked: ${new Date(menu.locked_at).toLocaleDateString('en-AU')}`);
  }
  if (menu.locked_by) {
    customMeta.push(`By: ${menu.locked_by}`);
  }

  // Generate full HTML using client-side compatible template (includes logo, background elements, branding)
  const fullHtml = generateMenuPrintTemplate({
    title: menu.menu_name,
    subtitle: menu.description || 'Menu',
    content: `<style>${menuStyles}</style>${contentHtml}`,
    totalItems: menuItems.length,
    customMeta: customMeta.length > 0 ? customMeta.join(' | ') : undefined,
  });

  // Open print window - same pattern as prep-lists
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(fullHtml);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 250);
}
