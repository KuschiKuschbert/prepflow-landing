/**
 * Format prep list for printing
 * Uses unified template system with Cyber Carrot branding
 */

import { escapeHtml } from '@/lib/exports/template-utils';
import type { PrepList } from '@/lib/types/prep-lists';

export function formatPrepListForPrint(
  prepList: PrepList,
  variant: 'default' | 'kitchen' = 'default',
): string {
  const items = prepList.prep_list_items || [];
  const sectionName = prepList.kitchen_sections?.name || 'Unassigned';
  const date = new Date(prepList.created_at).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let html = `
    <div class="prep-list-print">
      <div class="prep-list-header">
        <h1>${escapeHtml(prepList.name)}</h1>
        <div class="prep-list-meta">
          <span>Section: ${escapeHtml(sectionName)}</span>
          <span>Date: ${escapeHtml(date)}</span>
          <span>Status: ${escapeHtml(prepList.status || 'Active')}</span>
        </div>
      </div>
  `;

  if (prepList.notes) {
    html += `<div class="prep-list-notes"><strong>Notes:</strong> ${escapeHtml(prepList.notes)}</div>`;
  }

  if (items.length > 0) {
    // Kitchen variant: compact list with checkboxes
    if (variant === 'kitchen') {
      html += `
        <div class="prep-list-ingredients kitchen-variant">
          <h2>Ingredients</h2>
          <div class="kitchen-ingredient-list">
      `;

      items.forEach(item => {
        const ingredientName = item.ingredients?.name || 'Unknown';
        html += `
          <div class="kitchen-ingredient-item">
            <span class="kitchen-checkbox"></span>
            <span class="kitchen-ingredient-name">${escapeHtml(ingredientName)}</span>
            <span class="kitchen-ingredient-quantity">${escapeHtml(String(item.quantity || 0))} ${escapeHtml(item.unit || '')}</span>
            ${item.notes ? `<span class="kitchen-ingredient-notes">${escapeHtml(item.notes)}</span>` : ''}
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    } else {
      // Default variant: table format
      html += `
        <div class="prep-list-ingredients">
          <h2>Ingredients</h2>
          <table>
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Quantity</th>
                <th>Unit</th>
                ${items.some(item => item.notes) ? '<th>Notes</th>' : ''}
              </tr>
            </thead>
            <tbody>
      `;

      items.forEach(item => {
        const ingredientName = item.ingredients?.name || 'Unknown';
        html += `
          <tr>
            <td>${escapeHtml(ingredientName)}</td>
            <td>${escapeHtml(String(item.quantity || 0))}</td>
            <td>${escapeHtml(item.unit || '')}</td>
            ${item.notes ? `<td>${escapeHtml(item.notes)}</td>` : ''}
          </tr>
        `;
      });

      html += `
            </tbody>
          </table>
        </div>
      `;
    }
  }

  html += `</div>`;

  return html;
}
