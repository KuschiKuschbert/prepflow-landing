/**
 * Generate combined HTML export (menu display + allergen matrix + recipe cards)
 */

import { NextResponse } from 'next/server';
import { generateExportTemplate } from '@/lib/exports/pdf-template';
import { COMBINED_EXPORT_STYLES } from './combinedExportStyles';
import { generateMenuDisplayHTML, type MenuDisplayData } from './generateMenuDisplayHTML';
import { generateAllergenMatrixHTML, type AllergenMatrixData } from './generateAllergenMatrixHTML';
import { generateRecipeCardsHTML, type RecipeCardData } from './generateRecipeCardsHTML';

/**
 * Generate combined HTML export (menu display + allergen matrix + recipe cards)
 *
 * @param {string} menuName - Menu name
 * @param {MenuDisplayData[]} menuData - Menu items data
 * @param {AllergenMatrixData[]} matrixData - Allergen matrix data
 * @param {RecipeCardData[]} recipeCardsData - Recipe cards data
 * @param {boolean} includeMenu - Whether to include menu display
 * @param {boolean} includeMatrix - Whether to include allergen matrix
 * @param {boolean} includeRecipes - Whether to include recipe cards
 * @param {boolean} forPDF - Whether this is for PDF export
 * @returns {NextResponse} HTML response
 */
export function generateCombinedHTML(
  menuName: string,
  menuData: MenuDisplayData[],
  matrixData: AllergenMatrixData[],
  recipeCardsData: RecipeCardData[],
  includeMenu: boolean,
  includeMatrix: boolean,
  includeRecipes: boolean,
  forPDF: boolean,
): NextResponse {
  const parts: string[] = [];

  // Generate menu display HTML (if included)
  if (includeMenu) {
    parts.push(generateMenuDisplayHTML(menuData));
  }

  // Generate allergen matrix HTML (if included)
  if (includeMatrix) {
    parts.push(generateAllergenMatrixHTML(matrixData));
  }

  // Generate recipe cards HTML (if included)
  if (includeRecipes) {
    parts.push(generateRecipeCardsHTML(recipeCardsData));
  }

  // Build subtitle based on what's included
  const subtitleParts: string[] = [];
  if (includeMenu) subtitleParts.push('Menu');
  if (includeMatrix) subtitleParts.push('Allergen Matrix');
  if (includeRecipes) subtitleParts.push('Recipe Cards');
  const subtitle = subtitleParts.join(' + ') || 'Menu';

  // Combine content with styles
  const menuContent = `
    <style>
      ${COMBINED_EXPORT_STYLES}
    </style>
    ${parts.join('')}
  `;

  const totalItems = Math.max(menuData.length, matrixData.length, recipeCardsData.length);

  // Use shared template
  const htmlContent = generateExportTemplate({
    title: 'Complete Menu Export',
    subtitle: `${subtitle} - ${menuName}`,
    content: menuContent,
    forPDF,
    totalItems,
    customMeta: `Menu: ${menuName} | Items: ${totalItems}`,
  });

  return new NextResponse(htmlContent, {
    headers: {
      'Content-Type': 'text/html',
      'Content-Disposition': forPDF
        ? `inline; filename="${menuName.replace(/[^a-z0-9]/gi, '_')}_complete.html"`
        : `inline; filename="${menuName.replace(/[^a-z0-9]/gi, '_')}_complete.html"`,
    },
  });
}
