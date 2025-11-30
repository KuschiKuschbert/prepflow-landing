/**
 * Helper for generating recipe cards HTML
 */

import { escapeHtml } from '@/lib/exports/pdf-template';

export interface RecipeCardData {
  id: string;
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
  .recipe-cards-section {
    margin-top: 3rem;
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
`;

/**
 * Generates recipe cards HTML grouped by category
 *
 * @param {RecipeCardData[]} cards - Recipe cards data
 * @returns {string} Recipe cards HTML
 */
export function generateRecipeCardsHTML(cards: RecipeCardData[]): string {
  if (cards.length === 0) {
    return '';
  }

  // Group cards by category
  const cardsByCategory = new Map<string, RecipeCardData[]>();
  cards.forEach(card => {
    const category = card.category || 'Uncategorized';
    if (!cardsByCategory.has(category)) {
      cardsByCategory.set(category, []);
    }
    cardsByCategory.get(category)!.push(card);
  });

  const sortedCategories = Array.from(cardsByCategory.keys()).sort();

  let cardsContent = `
    <style>
      ${recipeCardStyles}
    </style>
    <div class="recipe-cards-section">
      <div class="recipe-cards-header">
        <h2>Recipe Cards</h2>
        <p>Detailed recipes for all menu items.</p>
      </div>
  `;

  sortedCategories.forEach(category => {
    const categoryCards = cardsByCategory.get(category)!;

    cardsContent += `
      <div class="recipe-category">
        <h3 style="color: #29E7CD; margin-top: 2rem; margin-bottom: 1rem; font-size: 1.3rem;">${escapeHtml(category)}</h3>
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

  return cardsContent;
}

