/**
 * HTML export generator for allergen overview
 */

import { escapeHtml, generateExportTemplate } from '@/lib/exports/pdf-template';
import { getAllTemplateStyles } from '@/lib/exports/template-styles/index';
import { ExportTheme } from '@/lib/exports/themes';
import { NextResponse } from 'next/server';
import type { AllergenExportItem } from './fetchAllergenExportData';

/**
 * Generate PDF or HTML export for allergen overview
 *
 * @param {AllergenExportItem[]} items - Allergen items
 * @param {boolean} forPDF - Whether this is for PDF export
 * @param {ExportTheme} theme - Selected theme
 * @returns {NextResponse} Response
 */
export function generateHTMLExport(
  items: AllergenExportItem[],
  forPDF: boolean,
  theme: ExportTheme = 'cyber-carrot',
): NextResponse {
  const itemsWithIngredients = enrichItemsWithIngredients(items);

  // Generate table content
  const styles = getAllTemplateStyles('compliance', theme);
  const tableContent = `
    <style>
      ${styles}
    </style>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Allergens</th>
            <th>From Ingredients</th>
          </tr>
        </thead>
        <tbody>
          ${
            itemsWithIngredients.length === 0
              ? '<tr><td colspan="3" class="empty-state"><h3>No Items Found</h3><p>No allergen data available for export.</p></td></tr>'
              : itemsWithIngredients
                  .map(
                    item => `
            <tr>
              <td>
                <div class="item-name">${escapeHtml(item.name || 'Unnamed ' + (item.type === 'recipe' ? 'Recipe' : 'Dish'))}</div>
              </td>
              <td class="allergens-list">${formatAllergens(item.allergens)}</td>
              <td class="ingredients-list">${
                item.ingredientNames.length > 0
                  ? item.ingredientNames.map((name: string) => escapeHtml(name)).join(', ')
                  : '—'
              }</td>
            </tr>
          `,
                  )
                  .join('')
          }
        </tbody>
      </table>
    </div>
  `;

  const htmlContent = generateExportTemplate({
    title: 'Allergen Overview',
    subtitle: 'Allergen Overview',
    content: tableContent,
    forPDF,
    totalItems: items.length,
    theme,
  });

  return new NextResponse(htmlContent, {
    headers: {
      'Content-Type': 'text/html',
      'Content-Disposition': forPDF
        ? 'inline; filename="allergen_overview.html"'
        : 'inline; filename="allergen_overview.html"',
    },
  });
}

function enrichItemsWithIngredients(items: AllergenExportItem[]) {
  return items.map(item => {
    const ingredientAllergenMap: Record<string, string[]> = {};
    if (item.allergenSources) {
      Object.entries(item.allergenSources).forEach(([allergen, ingredients]) => {
        const ingredientList = Array.isArray(ingredients) ? ingredients : [];
        ingredientList.forEach((ingredientName: string) => {
          if (!ingredientAllergenMap[ingredientName]) {
            ingredientAllergenMap[ingredientName] = [];
          }
          if (!ingredientAllergenMap[ingredientName].includes(allergen)) {
            ingredientAllergenMap[ingredientName].push(allergen);
          }
        });
      });
    }
    const allIngredientNames = Object.keys(ingredientAllergenMap);
    return { ...item, ingredientNames: allIngredientNames };
  });
}
function formatAllergens(allergens: string[]) {
  if (!allergens || allergens.length === 0) return '—';
  return allergens
    .map(
      allergen =>
        `<span class="allergen-tag allergen-${allergen.toLowerCase().replace(/\s+/g, '-')}">${escapeHtml(allergen)}</span>`,
    )
    .join(' ');
}
