/**
 * Generate HTML export for recipe cards
 */

import { NextResponse } from 'next/server';
import { generateExportTemplate, escapeHtml } from '@/lib/exports/pdf-template';

interface RecipeCardData {
  id: string;
  menuItemId: string;
  menuItemName: string;
  title: string;
  baseYield: number;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  methodSteps: string[];
  notes: string[];
  category: string;
}

const recipeCardStyles = `
  .recipe-cards {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    color: #333;
    line-height: 1.6;
  }
  .recipe-card {
    page-break-inside: avoid;
    margin-bottom: 2rem;
    padding: 1.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: #fff;
  }
  .recipe-card-header {
    border-bottom: 2px solid #29E7CD;
    padding-bottom: 0.75rem;
    margin-bottom: 1rem;
  }
  .recipe-card-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #29E7CD;
    margin: 0;
  }
  .recipe-card-yield {
    font-size: 0.9rem;
    color: #666;
    margin-top: 0.25rem;
  }
  .recipe-card-section {
    margin-bottom: 1.5rem;
  }
  .recipe-card-section-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 0.5rem;
  }
  .recipe-card-ingredients {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .recipe-card-ingredients li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #f0f0f0;
  }
  .recipe-card-ingredients li:last-child {
    border-bottom: none;
  }
  .recipe-card-method {
    list-style: decimal;
    padding-left: 1.5rem;
    margin: 0;
  }
  .recipe-card-method li {
    padding: 0.5rem 0;
  }
  .recipe-card-notes {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .recipe-card-notes li {
    padding: 0.5rem 0;
    font-style: italic;
    color: #666;
  }
  @media print {
    .recipe-card {
      page-break-inside: avoid;
    }
  }
`;

/**
 * Generate HTML export for recipe cards
 *
 * @param {string} menuName - Menu name
 * @param {RecipeCardData[]} cards - Recipe cards data
 * @param {boolean} forPDF - Whether this is for PDF export
 * @returns {NextResponse} HTML response
 */
export function generateHTML(
  menuName: string,
  cards: RecipeCardData[],
  forPDF: boolean,
): NextResponse {
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

  // Generate recipe cards content HTML
  let cardsContent = `
    <style>
      ${recipeCardStyles}
    </style>
    <div class="recipe-cards">
  `;

  sortedCategories.forEach(category => {
    const categoryCards = cardsByCategory.get(category)!;

    cardsContent += `
      <div class="recipe-category">
        <h2 style="color: #29E7CD; margin-top: 2rem; margin-bottom: 1rem; font-size: 1.5rem;">${escapeHtml(category)}</h2>
    `;

    categoryCards.forEach(card => {
      cardsContent += `
        <div class="recipe-card">
          <div class="recipe-card-header">
            <h3 class="recipe-card-title">${escapeHtml(card.title)}</h3>
            <div class="recipe-card-yield">Base Yield: ${card.baseYield} serving${card.baseYield !== 1 ? 's' : ''}</div>
          </div>

          <div class="recipe-card-section">
            <h4 class="recipe-card-section-title">Ingredients</h4>
            <ul class="recipe-card-ingredients">
      `;

      card.ingredients.forEach(ingredient => {
        cardsContent += `
              <li>${escapeHtml(ingredient.name)}: ${ingredient.quantity} ${escapeHtml(ingredient.unit)}</li>
        `;
      });

      cardsContent += `
            </ul>
          </div>
      `;

      if (card.methodSteps && card.methodSteps.length > 0) {
        cardsContent += `
          <div class="recipe-card-section">
            <h4 class="recipe-card-section-title">Method</h4>
            <ol class="recipe-card-method">
        `;

        card.methodSteps.forEach(step => {
          cardsContent += `
              <li>${escapeHtml(step)}</li>
          `;
        });

        cardsContent += `
            </ol>
          </div>
        `;
      }

      if (card.notes && card.notes.length > 0) {
        cardsContent += `
          <div class="recipe-card-section">
            <h4 class="recipe-card-section-title">Notes</h4>
            <ul class="recipe-card-notes">
        `;

        card.notes.forEach(note => {
          cardsContent += `
              <li>${escapeHtml(note)}</li>
          `;
        });

        cardsContent += `
            </ul>
          </div>
        `;
      }

      cardsContent += `
        </div>
      `;
    });

    cardsContent += `
      </div>
    `;
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

  return new NextResponse(htmlContent, {
    headers: {
      'Content-Type': 'text/html',
      'Content-Disposition': forPDF
        ? `inline; filename="${menuName.replace(/[^a-z0-9]/gi, '_')}_recipe_cards.html"`
        : `inline; filename="${menuName.replace(/[^a-z0-9]/gi, '_')}_recipe_cards.html"`,
    },
  });
}

