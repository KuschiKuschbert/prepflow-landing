/**
 * Helper for generating recipe cards HTML
 */

import { escapeHtml } from '@/lib/exports/pdf-template';
import { renderRecipeCard } from './html-generators';
import { recipeCardStyles } from './recipe-card-styles';
import { RecipeCardData } from './types';

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
      cardsContent += renderRecipeCard(card);
    });

    cardsContent += `
      </div>
    `;
  });

  cardsContent += `</div>`;

  return cardsContent;
}
