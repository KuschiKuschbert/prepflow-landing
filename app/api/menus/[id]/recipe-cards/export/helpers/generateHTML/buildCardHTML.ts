/**
 * Build HTML for a single recipe card
 */

import { escapeHtml } from '@/lib/exports/pdf-template';

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

/**
 * Build HTML for a single recipe card
 */
export function buildCardHTML(card: RecipeCardData): string {
  let html = `
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
    html += `
      <li>${escapeHtml(ingredient.name)}: ${ingredient.quantity} ${escapeHtml(ingredient.unit)}</li>
    `;
  });

  html += `
        </ul>
      </div>
  `;

  if (card.methodSteps && card.methodSteps.length > 0) {
    html += `
      <div class="recipe-card-section">
        <h4 class="recipe-card-section-title">Method</h4>
        <ol class="recipe-card-method">
    `;

    card.methodSteps.forEach(step => {
      html += `
        <li>${escapeHtml(step)}</li>
      `;
    });

    html += `
        </ol>
      </div>
    `;
  }

  if (card.notes && card.notes.length > 0) {
    html += `
      <div class="recipe-card-section">
        <h4 class="recipe-card-section-title">Notes</h4>
        <ul class="recipe-card-notes">
    `;

    card.notes.forEach(note => {
      html += `
        <li>${escapeHtml(note)}</li>
      `;
    });

    html += `
        </ul>
      </div>
    `;
  }

  html += `
    </div>
  `;

  return html;
}

