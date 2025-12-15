/**
 * Generate ingredients HTML for prep list.
 */
import { escapeHtml } from '@/lib/exports/template-utils';
import type { SectionData } from '../../../types';

export function generateIngredientsHTML(section: SectionData, variant: 'default' | 'kitchen'): string {
  if (section.aggregatedIngredients.length === 0) return '';

  if (variant === 'kitchen') {
    let html = `
      <div class="prep-list-ingredients kitchen-variant">
        <h3>Ingredients</h3>
        <div class="kitchen-ingredient-list">
    `;
    section.aggregatedIngredients.forEach(ing => {
      const prepNotes =
        ing.prepNotes && ing.prepNotes.length > 0
          ? `<span class="kitchen-ingredient-notes">Prep: ${escapeHtml(ing.prepNotes.join(', '))}</span>`
          : '';
      html += `
        <div class="kitchen-ingredient-item">
          <span class="kitchen-checkbox"></span>
          <span class="kitchen-ingredient-name">${escapeHtml(ing.name)}</span>
          <span class="kitchen-ingredient-quantity">${escapeHtml(String(ing.totalQuantity))} ${escapeHtml(ing.unit || '')}</span>
          ${prepNotes}
        </div>
      `;
    });
    html += `</div></div>`;
    return html;
  }

  let html = `
    <div class="prep-list-ingredients">
      <h3>Ingredients</h3>
      <table>
        <thead>
          <tr>
            <th>Ingredient</th>
            <th>Total Quantity</th>
            <th>Unit</th>
          </tr>
        </thead>
        <tbody>
  `;
  section.aggregatedIngredients.forEach(ing => {
    const prepNotes =
      ing.prepNotes && ing.prepNotes.length > 0
        ? `<br><small style="color: rgba(255, 255, 255, 0.6);">Prep: ${escapeHtml(ing.prepNotes.join(', '))}</small>`
        : '';
    html += `
      <tr>
        <td>${escapeHtml(ing.name)}${prepNotes}</td>
        <td>${escapeHtml(String(ing.totalQuantity))}</td>
        <td>${escapeHtml(ing.unit || '')}</td>
      </tr>
    `;
  });
  html += `</tbody></table></div>`;
  return html;
}
