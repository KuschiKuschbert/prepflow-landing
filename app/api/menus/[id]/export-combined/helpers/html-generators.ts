import { escapeHtml } from '@/lib/exports/pdf-template';
import { RecipeCardData } from './types';

export function renderIngredients(ingredients: RecipeCardData['ingredients']): string {
  if (ingredients.length === 0) return '';

  let html = `
    <div class="recipe-card-section">
      <h4 class="recipe-card-section-title">Ingredients</h4>
      <ul class="recipe-card-ingredients">
  `;

  ingredients.forEach(ingredient => {
    html += `
        <li>${escapeHtml(ingredient.name)}: ${ingredient.quantity ?? ''} ${escapeHtml(ingredient.unit ?? '')}${ingredient.notes ? ` (${escapeHtml(ingredient.notes)})` : ''}</li>
    `;
  });

  html += `
      </ul>
    </div>
  `;
  return html;
}

export function renderMethod(methodSteps: RecipeCardData['methodSteps']): string {
  if (!methodSteps || methodSteps.length === 0) return '';

  let html = `
    <div class="recipe-card-section">
      <h4 class="recipe-card-section-title">Method</h4>
      <ol class="recipe-card-method">
  `;

  methodSteps.forEach(step => {
    html += `
        <li>${escapeHtml(step.instruction)}</li>
    `;
  });

  html += `
      </ol>
    </div>
  `;
  return html;
}

export function renderNotes(notes: string[]): string {
  if (!notes || notes.length === 0) return '';

  let html = `
    <div class="recipe-card-section">
      <h4 class="recipe-card-section-title">Notes</h4>
      <ul class="recipe-card-notes">
  `;

  notes.forEach(note => {
    html += `
        <li>${escapeHtml(note)}</li>
    `;
  });

  html += `
      </ul>
    </div>
  `;
  return html;
}

export function renderRecipeCard(card: RecipeCardData): string {
  return `
    <div class="recipe-card">
      <div class="recipe-card-header">
        <h3 class="recipe-card-title">${escapeHtml(card.title)}</h3>
        <div class="recipe-card-yield">Base Yield: ${card.baseYield} serving${card.baseYield !== 1 ? 's' : ''}</div>
      </div>

      ${renderIngredients(card.ingredients)}
      ${renderMethod(card.methodSteps)}
      ${renderNotes(card.notes)}
    </div>
  `;
}
