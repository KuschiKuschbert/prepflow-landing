/**
 * Helper for generating recipe cards HTML
 */

import { escapeHtml } from '@/lib/exports/pdf-template';
import { recipeCardStyles } from './recipe-card-styles';

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
