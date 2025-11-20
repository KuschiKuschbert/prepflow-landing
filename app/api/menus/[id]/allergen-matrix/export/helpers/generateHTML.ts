import { NextResponse } from 'next/server';
import { AUSTRALIAN_ALLERGENS } from '@/lib/allergens/australian-allergens';

export function generateHTML(menuName: string, matrixData: any[], forPDF: boolean): NextResponse {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Allergen Matrix - ${menuName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 20px; color: #333; background: #fff; }
    h1 { color: #000; margin-bottom: 10px; }
    .menu-info { color: #666; margin-bottom: 30px; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
    th { background-color: #f5f5f5; border: 1px solid #ddd; padding: 10px 8px; text-align: left; font-weight: 600; text-transform: uppercase; font-size: 11px; }
    th.allergen-header { text-align: center; writing-mode: vertical-rl; text-orientation: mixed; min-width: 30px; }
    td { border: 1px solid #ddd; padding: 8px; text-align: center; }
    td.item-name { text-align: left; font-weight: 500; }
    td.type { text-align: left; color: #666; }
    .has-allergen { color: #dc2626; font-weight: bold; }
    .no-allergen { color: #16a34a; }
    .dietary-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 500; margin-right: 4px; }
    .vegetarian { background-color: #dcfce7; color: #166534; }
    .vegan { background-color: #d1fae5; color: #065f46; }
    @media print { body { margin: 0; } @page { margin: 1cm; } }
  </style>
</head>
<body>
  <h1>Allergen Matrix</h1>
  <div class="menu-info">
    <strong>Menu:</strong> ${menuName}<br>
    <strong>Generated:</strong> ${new Date().toLocaleString()}
  </div>
  <table>
    <thead>
      <tr>
        <th>Item Name</th>
        <th>Type</th>
        <th>Category</th>
        ${AUSTRALIAN_ALLERGENS.map(a => `<th class="allergen-header">${a.displayName}</th>`).join('')}
        <th>Dietary</th>
      </tr>
    </thead>
    <tbody>
      ${
        matrixData.length === 0
          ? '<tr><td colspan="' +
            (AUSTRALIAN_ALLERGENS.length + 4) +
            '" style="text-align: center; padding: 20px; color: #999;">No items in this menu</td></tr>'
          : matrixData
              .map(
                item => `
        <tr>
          <td class="item-name">${escapeHtml(item.name)}</td>
          <td class="type">${escapeHtml(item.type)}</td>
          <td>${escapeHtml(item.category || '')}</td>
          ${AUSTRALIAN_ALLERGENS.map(
            allergen =>
              `<td class="${item.allergens.includes(allergen.code) ? 'has-allergen' : 'no-allergen'}">${
                item.allergens.includes(allergen.code) ? '❌' : '✅'
              }</td>`,
          ).join('')}
          <td>
            ${item.isVegetarian ? '<span class="dietary-badge vegetarian">Vegetarian</span>' : ''}
            ${item.isVegan ? '<span class="dietary-badge vegan">Vegan</span>' : ''}
            ${!item.isVegetarian && !item.isVegan ? '<span style="color: #999;">-</span>' : ''}
          </td>
        </tr>
      `,
              )
              .join('')
      }
    </tbody>
  </table>
  ${forPDF ? '<script>window.onload = function() { window.print(); }</script>' : ''}
</body>
</html>`;

  return new NextResponse(htmlContent, {
    headers: {
      'Content-Type': 'text/html',
      'Content-Disposition': forPDF
        ? `attachment; filename="${menuName.replace(/[^a-z0-9]/gi, '_')}_allergen_matrix.html"`
        : `inline; filename="${menuName.replace(/[^a-z0-9]/gi, '_')}_allergen_matrix.html"`,
    },
  });
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}
