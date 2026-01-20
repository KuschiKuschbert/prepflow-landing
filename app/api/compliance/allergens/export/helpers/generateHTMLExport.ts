/**
 * HTML export generator for allergen overview
 */

import { getAllergenDisplayName } from '@/lib/allergens/australian-allergens';
import { escapeHtml, generateExportTemplate } from '@/lib/exports/pdf-template';
import { NextResponse } from 'next/server';
import type { AllergenExportItem } from './fetchAllergenExportData';
import { ALLERGEN_EXPORT_STYLES } from './htmlExportStyles';

/**
 * Generates HTML export for allergen overview
 *
 * @param {AllergenExportItem[]} items - Items to export
 * @param {boolean} forPDF - Whether this is for PDF generation
 * @returns {NextResponse} HTML file response
 */
export function generateHTMLExport(items: AllergenExportItem[], forPDF: boolean): NextResponse {
  // Build ingredient list for each item
  // Build ingredient list for each item
  const itemsWithIngredients = enrichItemsWithIngredients(items);

  // Format allergens as display names
  const formatAllergens = (allergens: string[]) => {
    if (!allergens || allergens.length === 0) return 'None';
    return allergens.map(code => getAllergenDisplayName(code)).join(', ');
  };

  // Generate table content
  const tableContent = `
    <style>
      ${ALLERGEN_EXPORT_STYLES}
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
