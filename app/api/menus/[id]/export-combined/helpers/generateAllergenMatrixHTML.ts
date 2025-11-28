/**
 * Helper for generating allergen matrix HTML
 */

import { escapeHtml } from '@/lib/exports/pdf-template';
import { AUSTRALIAN_ALLERGENS } from '@/lib/allergens/australian-allergens';

export interface AllergenMatrixData {
  name: string;
  type: string;
  category: string;
  allergens: string[];
  isVegetarian: boolean;
  isVegan: boolean;
}

/**
 * Generates allergen matrix HTML table
 *
 * @param {AllergenMatrixData[]} matrixData - Allergen matrix data
 * @returns {string} Allergen matrix HTML
 */
export function generateAllergenMatrixHTML(matrixData: AllergenMatrixData[]): string {
  let matrixContent = `
    <div class="allergen-matrix-section">
      <div class="allergen-matrix-header">
        <h2>Allergen Matrix</h2>
        <p>This matrix shows which allergens are present in each menu item.</p>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Type</th>
              <th>Category</th>
              ${AUSTRALIAN_ALLERGENS.map(a => `<th class="allergen-header">${escapeHtml(a.displayName)}</th>`).join('')}
              <th>Dietary</th>
            </tr>
          </thead>
          <tbody>
  `;

  if (matrixData.length === 0) {
    matrixContent += `<tr><td colspan="${AUSTRALIAN_ALLERGENS.length + 4}" class="empty-state">No items in this menu</td></tr>`;
  } else {
    matrixData.forEach(item => {
      matrixContent += `
        <tr>
          <td class="item-name">${escapeHtml(item.name)}</td>
          <td class="type">${escapeHtml(item.type)}</td>
          <td>${escapeHtml(item.category || '')}</td>
          ${AUSTRALIAN_ALLERGENS.map(
            allergen =>
              `<td class="${item.allergens.includes(allergen.code) ? 'has-allergen' : ''}">${
                item.allergens.includes(allergen.code) ? '❌' : ''
              }</td>`,
          ).join('')}
          <td>
            ${item.isVegetarian ? '<span class="dietary-badge vegetarian">Vegetarian</span>' : ''}
            ${item.isVegan ? '<span class="dietary-badge vegan">Vegan</span>' : ''}
            ${!item.isVegetarian && !item.isVegan ? '<span style="color: rgba(255, 255, 255, 0.5);">-</span>' : ''}
          </td>
        </tr>
      `;
    });
  }

  matrixContent += `
          </tbody>
        </table>
      </div>
    </div>
  `;

  return matrixContent;
}
