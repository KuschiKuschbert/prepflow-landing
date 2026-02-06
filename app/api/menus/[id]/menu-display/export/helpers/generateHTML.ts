import { generatePDF } from '@/lib/exports/generate-pdf';
import { escapeHtml, generateExportTemplate } from '@/lib/exports/pdf-template';
import { getAllTemplateStyles } from '@/lib/exports/template-styles/index';
import { type ExportTheme } from '@/lib/exports/themes';
import { NextResponse } from 'next/server';

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
 * @param {ExportTheme} theme - Aesthetic theme
 * @returns {Promise<NextResponse>} Response
 */
export async function generateHTML(
  menuName: string,
  menuData: MenuDisplayData[],
  forPDF: boolean,
  theme: ExportTheme = 'cyber-carrot',
): Promise<NextResponse> {
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

  // Determine density class
  const totalItems = menuData.length;
  let densityClass = '';

  if (totalItems > 40) {
    densityClass = 'density-ultra-compact';
  } else if (totalItems > 20) {
    densityClass = 'density-compact';
  }

  // Generate menu content HTML
  let menuContent = `
    <style>
      ${getAllTemplateStyles('menu', theme)}
    </style>
    <div class="menu-display ${densityClass}">
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

  if (forPDF) {
    const pdfBuffer = await generatePDF(htmlContent);
    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${menuName.replace(/[^a-z0-9]/gi, '_')}_menu_display.pdf"`,
      },
    });
  }

  return new NextResponse(htmlContent, {
    headers: {
      'Content-Type': 'text/html',
      'Content-Disposition': `attachment; filename="${menuName.replace(/[^a-z0-9]/gi, '_')}_menu_display.html"`,
    },
  });
}
