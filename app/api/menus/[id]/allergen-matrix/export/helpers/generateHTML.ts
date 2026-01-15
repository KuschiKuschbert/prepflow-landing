import { AUSTRALIAN_ALLERGENS } from '@/lib/allergens/australian-allergens';
import { escapeHtml, generateExportTemplate } from '@/lib/exports/pdf-template';
import { NextResponse } from 'next/server';
import { MatrixItem } from '../route';
import { allergenMatrixStyles } from './allergenMatrixStyles';

export function generateHTML(menuName: string, matrixData: MatrixItem[], forPDF: boolean): NextResponse {
  // Generate table content
  const tableContent = `
    <style>
      ${allergenMatrixStyles}
    </style>
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
          ${
            matrixData.length === 0
              ? `<tr><td colspan="${AUSTRALIAN_ALLERGENS.length + 4}" class="empty-state">No items in this menu</td></tr>`
              : matrixData
                  .map(
                    item => `
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
          `,
                  )
                  .join('')
          }
        </tbody>
      </table>
    </div>
  `;

  // Use shared template
  const htmlContent = generateExportTemplate({
    title: 'Allergen Matrix',
    subtitle: `Allergen Matrix - ${menuName}`,
    content: tableContent,
    forPDF,
    totalItems: matrixData.length,
    customMeta: `Menu: ${menuName}`,
  });

  return new NextResponse(htmlContent, {
    headers: {
      'Content-Type': 'text/html',
      'Content-Disposition': forPDF
        ? `inline; filename="${menuName.replace(/[^a-z0-9]/gi, '_')}_allergen_matrix.html"`
        : `inline; filename="${menuName.replace(/[^a-z0-9]/gi, '_')}_allergen_matrix.html"`,
    },
  });
}
