import { generatePDF } from '@/lib/exports/generate-pdf';
import { generateExportTemplate } from '@/lib/exports/pdf-template';
import { ExportTheme } from '@/lib/exports/themes';
import { NextResponse } from 'next/server';
import { COMBINED_EXPORT_STYLES } from './combinedExportStyles';
import { generateAllergenMatrixHTML, type AllergenMatrixData } from './generateAllergenMatrixHTML';
import { generateMenuDisplayHTML, type MenuDisplayData } from './generateMenuDisplayHTML';
import { generateRecipeCardsHTML } from './generateRecipeCardsHTML';
import { RecipeCardData } from './types';

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
 * @param {ExportTheme} theme - Selected theme
 * @returns {Promise<NextResponse>} Response
 */
export async function generateCombinedHTML(
  menuName: string,
  menuData: MenuDisplayData[],
  matrixData: AllergenMatrixData[],
  recipeCardsData: RecipeCardData[],
  includeMenu: boolean,
  includeMatrix: boolean,
  includeRecipes: boolean,
  forPDF: boolean,
  theme: ExportTheme = 'cyber-carrot',
): Promise<NextResponse> {
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
    theme,
  });

  if (forPDF) {
    const pdfBuffer = await generatePDF(htmlContent);
    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${menuName.replace(/[^a-z0-9]/gi, '_')}_complete.pdf"`,
      },
    });
  }

  return new NextResponse(htmlContent, {
    headers: {
      'Content-Type': 'text/html',
      'Content-Disposition': `attachment; filename="${menuName.replace(/[^a-z0-9]/gi, '_')}_complete.html"`,
    },
  });
}
