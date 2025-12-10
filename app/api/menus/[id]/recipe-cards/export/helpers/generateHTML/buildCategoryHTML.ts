/**
 * Build HTML for a category section
 */

import { escapeHtml } from '@/lib/exports/pdf-template';
import { buildCardHTML } from './buildCardHTML';

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
 * Build HTML for a category section
 */
export function buildCategoryHTML(category: string, cards: RecipeCardData[]): string {
  let html = `
    <div class="recipe-category">
      <h2 style="color: #29E7CD; margin-top: 2rem; margin-bottom: 1rem; font-size: 1.5rem;">${escapeHtml(category)}</h2>
  `;

  cards.forEach(card => {
    html += buildCardHTML(card);
  });

  html += `
    </div>
  `;

  return html;
}
