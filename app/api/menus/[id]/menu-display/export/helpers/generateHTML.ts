/**
 * Generate HTML export for menu display
 */

import { NextResponse } from 'next/server';
import { generateExportTemplate, escapeHtml } from '@/lib/exports/pdf-template';
import { menuDisplayStyles } from './menuDisplayStyles';

interface MenuDisplayData {
  name: string;
  description?: string;
  price: number;
  category: string;
}

/**
 * Generate HTML export for menu display
 *
 * @param {string} menuName - Menu name
 * @param {MenuDisplayData[]} menuData - Menu items data
 * @param {boolean} forPDF - Whether this is for PDF export
 * @returns {NextResponse} HTML response
 */
export function generateHTML(
  menuName: string,
  menuData: MenuDisplayData[],
  forPDF: boolean,
): NextResponse {
  // Group items by category
  const itemsByCategory = new Map<string, MenuDisplayData[]>();
  menuData.forEach(item => {
    const category = item.category || 'Uncategorized';
    if (!itemsByCategory.has(category)) {
      itemsByCategory.set(category, []);
    }
    itemsByCategory.get(category)!.push(item);
  });

  // Sort categories alphabetically
  const sortedCategories = Array.from(itemsByCategory.keys()).sort();

  // Generate menu content HTML
  let menuContent = `
    <style>
      ${menuDisplayStyles}
    </style>
    <div class="menu-display">
  `;

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

  menuContent += `</div>`;

  // Use shared template
  const htmlContent = generateExportTemplate({
    title: 'Menu Display',
    subtitle: `Menu - ${menuName}`,
    content: menuContent,
    forPDF,
    totalItems: menuData.length,
    customMeta: `Menu: ${menuName}`,
  });

  return new NextResponse(htmlContent, {
    headers: {
      'Content-Type': 'text/html',
      'Content-Disposition': forPDF
        ? `inline; filename="${menuName.replace(/[^a-z0-9]/gi, '_')}_menu_display.html"`
        : `inline; filename="${menuName.replace(/[^a-z0-9]/gi, '_')}_menu_display.html"`,
    },
  });
}
