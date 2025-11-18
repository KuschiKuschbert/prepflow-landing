/**
 * Format prep list for printing
 */

import type { PrepList } from '../types';

export function formatPrepListForPrint(prepList: PrepList): string {
  const items = prepList.prep_list_items || [];
  const sectionName = prepList.kitchen_sections?.name || 'Unassigned';
  const date = new Date(prepList.created_at).toLocaleDateString();

  let html = `
      <div class="prep-list-print">
        <div class="prep-list-header">
          <h1>${prepList.name}</h1>
          <div class="prep-list-meta">
            <span>Section: ${sectionName}</span>
            <span>Date: ${date}</span>
            <span>Status: ${prepList.status}</span>
          </div>
        </div>
    `;

  if (prepList.notes) {
    html += `<div class="prep-list-notes"><strong>Notes:</strong> ${prepList.notes}</div>`;
  }

  if (items.length > 0) {
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
            <td>${ingredientName}</td>
            <td>${item.quantity}</td>
            <td>${item.unit}</td>
            ${item.notes ? `<td>${item.notes}</td>` : ''}
          </tr>
        `;
    });

    html += `
            </tbody>
          </table>
        </div>
      `;
  }

  html += `</div>`;

  return html;
}
