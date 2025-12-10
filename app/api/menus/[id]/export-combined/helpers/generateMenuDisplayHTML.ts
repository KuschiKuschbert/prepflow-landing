/**
 * Helper for generating menu display HTML
 */

import { escapeHtml } from '@/lib/exports/pdf-template';

export interface MenuDisplayData {
  name: string;
  description?: string;
  price: number;
  category: string;
}

/**
 * Generates menu display HTML grouped by category
 *
 * @param {MenuDisplayData[]} menuData - Menu items data
 * @returns {string} Menu display HTML
 */
export function generateMenuDisplayHTML(menuData: MenuDisplayData[]): string {
  // Group items by category
  const itemsByCategory = new Map<string, MenuDisplayData[]>();
  menuData.forEach(item => {
    const category = item.category || 'Uncategorized';
    if (!itemsByCategory.has(category)) {
      itemsByCategory.set(category, []);
    }
    itemsByCategory.get(category)!.push(item);
  });

  const sortedCategories = Array.from(itemsByCategory.keys()).sort();

  let menuContent = '<div class="menu-display">';

  // Menu display section
  sortedCategories.forEach(category => {
    const categoryItems = itemsByCategory.get(category)!;

    menuContent += `
      <div class="menu-category">
        <div class="menu-category-header">
          <h2>${escapeHtml(category)}</h2>
        </div>
        <div class="menu-items-grid">
    `;

    categoryItems.forEach(item => {
      menuContent += `
        <div class="menu-item">
          <div class="menu-item-header">
            <div class="menu-item-name">${escapeHtml(item.name)}</div>
            <div class="menu-item-price">$${item.price.toFixed(2)}</div>
          </div>
          ${item.description ? `<div class="menu-item-description">${escapeHtml(item.description)}</div>` : ''}
        </div>
      `;
    });

    menuContent += `
        </div>
      </div>
    `;
  });

  menuContent += '</div>';

  return menuContent;
}



