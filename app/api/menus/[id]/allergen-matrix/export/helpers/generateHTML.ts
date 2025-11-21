import { NextResponse } from 'next/server';
import { AUSTRALIAN_ALLERGENS } from '@/lib/allergens/australian-allergens';
import { generateExportTemplate, escapeHtml } from '@/lib/exports/pdf-template';

export function generateHTML(menuName: string, matrixData: any[], forPDF: boolean): NextResponse {
  // Generate table content
  const tableContent = `
    <style>
      .table-container {
        overflow-x: auto;
        margin-top: 32px;
      }
      
      table {
        width: 100%;
        border-collapse: collapse;
        background: rgba(26, 26, 26, 0.8);
        border-radius: 16px;
        overflow: hidden;
        font-size: 12px;
      }
      
      thead {
        background: linear-gradient(135deg, rgba(42, 42, 42, 0.9) 0%, rgba(42, 42, 42, 0.7) 100%);
      }
      
      th {
        padding: 12px 8px;
        text-align: left;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 11px;
        color: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(42, 42, 42, 0.8);
        border-bottom: 2px solid rgba(41, 231, 205, 0.3);
      }
      
      th.allergen-header {
        text-align: center;
        writing-mode: vertical-rl;
        text-orientation: mixed;
        min-width: 30px;
      }
      
      tbody tr {
        border-bottom: 1px solid rgba(42, 42, 42, 0.6);
      }
      
      tbody tr:nth-child(even) {
        background: rgba(26, 26, 26, 0.4);
      }
      
      tbody tr:hover {
        background: rgba(41, 231, 205, 0.05);
      }
      
      td {
        border: 1px solid rgba(42, 42, 42, 0.6);
        padding: 8px;
        text-align: center;
        color: rgba(255, 255, 255, 0.9);
      }
      
      td.item-name {
        text-align: left;
        font-weight: 500;
      }
      
      td.type {
        text-align: left;
        color: rgba(255, 255, 255, 0.7);
      }
      
      .has-allergen {
        color: #ef4444;
        font-weight: bold;
      }
      
      .dietary-badge {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 500;
        margin-right: 4px;
      }
      
      .vegetarian {
        background-color: rgba(34, 197, 94, 0.2);
        color: #86efac;
        border: 1px solid rgba(34, 197, 94, 0.3);
      }
      
      .vegan {
        background-color: rgba(16, 185, 129, 0.2);
        color: #6ee7b7;
        border: 1px solid rgba(16, 185, 129, 0.3);
      }
      
      .empty-state {
        text-align: center;
        padding: 40px 20px;
        color: rgba(255, 255, 255, 0.5);
      }
      
      @media print {
        table {
          background: #ffffff;
        }
        
        thead {
          background: #f5f5f5;
        }
        
        th {
          color: #000000;
          border-color: #cccccc;
        }
        
        tbody tr {
          border-color: #e0e0e0;
        }
        
        tbody tr:nth-child(even) {
          background: #f9f9f9;
        }
        
        td {
          color: #000000;
          border-color: #e0e0e0;
        }
        
        td.type {
          color: #666666;
        }
        
        .has-allergen {
          color: #dc2626;
        }
        
        .vegetarian {
          background-color: #dcfce7;
          color: #166534;
          border-color: #86efac;
        }
        
        .vegan {
          background-color: #d1fae5;
          color: #065f46;
          border-color: #6ee7b7;
        }
        
        thead {
          display: table-header-group;
        }
        
        tbody tr {
          page-break-inside: avoid;
        }
      }
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
