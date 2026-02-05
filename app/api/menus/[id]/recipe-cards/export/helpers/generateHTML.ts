import { generatePDF } from '@/lib/exports/generate-pdf';
import { generateExportTemplate } from '@/lib/exports/pdf-template';
import { type ExportTheme } from '@/lib/exports/themes';
import { NextResponse } from 'next/server';
import { buildCategoryHTML } from './generateHTML/buildCategoryHTML';

import { RecipeCardData } from './generateCSV';

import { getAllTemplateStyles } from '@/lib/exports/template-styles/index';

/**
 * Generate HTML export for recipe cards
 *
 * @param {string} menuName - Menu name
 * @param {RecipeCardData[]} cards - Recipe cards data
 * @param {boolean} forPDF - Whether this is for PDF export
 * @param {ExportTheme} theme - Aesthetic theme
 * @returns {Promise<NextResponse>} HTML response
 */
export async function generateHTML(
  menuName: string,
  cards: RecipeCardData[],
  forPDF: boolean,
  theme: ExportTheme = 'cyber-carrot',
): Promise<NextResponse> {
  const recipeCardStyles = getAllTemplateStyles('recipe', theme);
  // Group cards by category
  const cardsByCategory = new Map<string, RecipeCardData[]>();
  cards.forEach(card => {
    const category = card.category || 'Uncategorized';
    if (!cardsByCategory.has(category)) {
      cardsByCategory.set(category, []);
    }
    cardsByCategory.get(category)!.push(card);
  });

  // Sort categories alphabetically
  const sortedCategories = Array.from(cardsByCategory.keys()).sort();

  let cardsContent = `<style>${recipeCardStyles}</style><div class="recipe-cards">`;
  sortedCategories.forEach(category => {
    const categoryCards = cardsByCategory.get(category)!;
    cardsContent += buildCategoryHTML(category, categoryCards);
  });
  cardsContent += `</div>`;

  // Use shared template
  const htmlContent = generateExportTemplate({
    title: 'Recipe Cards',
    subtitle: `Menu - ${menuName}`,
    content: cardsContent,
    forPDF,
    totalItems: cards.length,
    customMeta: `Menu: ${menuName}`,
  });

  const filename = `${menuName.replace(/[^a-z0-9]/gi, '_')}_recipe_cards`;

  if (forPDF) {
    const pdfBuffer = await generatePDF(htmlContent);
    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}.pdf"`,
      },
    });
  }

  return new NextResponse(htmlContent, {
    headers: {
      'Content-Type': 'text/html',
      'Content-Disposition': `inline; filename="${filename}.html"`,
    },
  });
}
