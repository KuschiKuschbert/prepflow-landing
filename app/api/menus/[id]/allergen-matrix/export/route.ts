/**
 * API endpoint for exporting allergen matrix in various formats
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { AUSTRALIAN_ALLERGENS, consolidateAllergens } from '@/lib/allergens/australian-allergens';
import { fetchMenuWithItems } from '../../helpers/fetchMenuWithItems';
import type { MenuItem } from '@/app/webapp/menu-builder/types';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id: menuId } = await context.params;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'html';

    if (!menuId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Menu ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    if (!['html', 'csv', 'pdf'].includes(format)) {
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid format. Must be html, csv, or pdf', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Fetch menu with items
    const menu = await fetchMenuWithItems(menuId);

    if (!menu) {
      return NextResponse.json(
        ApiErrorHandler.createError('Menu not found', 'NOT_FOUND', 404),
        { status: 404 },
      );
    }

    // Build allergen matrix data
    const matrixData = (menu.items || []).map((item: MenuItem) => {
      // Extract allergens - ensure it's always an array
      let allergens: string[] = [];

      // Try item.allergens first (from enriched item)
      if (item.allergens && Array.isArray(item.allergens)) {
        allergens = item.allergens;
      } else if (item.dish_id && item.dishes?.allergens) {
        // Try dish allergens
        if (Array.isArray(item.dishes.allergens)) {
          allergens = item.dishes.allergens;
        }
      } else if (item.recipe_id && item.recipes?.allergens) {
        // Try recipe allergens
        if (Array.isArray(item.recipes.allergens)) {
          allergens = item.recipes.allergens;
        }
      }

      // Consolidate allergens (map old codes to new) and validate
      const validAllergenCodes = AUSTRALIAN_ALLERGENS.map(a => a.code);
      allergens = consolidateAllergens(allergens).filter(code => validAllergenCodes.includes(code));

      // Debug logging
      logger.dev('[Allergen Matrix Export] Item allergens:', {
        itemName: item.dish_id ? item.dishes?.dish_name : item.recipes?.recipe_name,
        allergens,
        allergensCount: allergens.length,
        rawAllergens: item.allergens,
        dishAllergens: item.dishes?.allergens,
        recipeAllergens: item.recipes?.allergens,
      });

      const isVegetarian = item.is_vegetarian ?? (item.dish_id ? item.dishes?.is_vegetarian : item.recipes?.is_vegetarian);
      const isVegan = item.is_vegan ?? (item.dish_id ? item.dishes?.is_vegan : item.recipes?.is_vegan);

      return {
        name: item.dish_id ? item.dishes?.dish_name : item.recipes?.recipe_name || 'Unknown',
        type: item.dish_id ? 'Dish' : 'Recipe',
        allergens,
        isVegetarian: isVegetarian === true,
        isVegan: isVegan === true,
        category: item.category,
      };
    });

    // Generate export based on format
    if (format === 'csv') {
      return generateCSV(menu.menu_name, matrixData);
    } else if (format === 'pdf') {
      // For PDF, we'll generate HTML and let the client print to PDF
      // In a production environment, you might want to use a library like puppeteer or pdfkit
      return generateHTML(menu.menu_name, matrixData, true);
    } else {
      return generateHTML(menu.menu_name, matrixData, false);
    }
  } catch (err) {
    logger.error('[Allergen Matrix Export API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}

function generateCSV(menuName: string, matrixData: any[]): NextResponse {
  const headers = ['Item Name', 'Type', 'Category', ...AUSTRALIAN_ALLERGENS.map(a => a.displayName), 'Vegetarian', 'Vegan'];
  const rows = matrixData.map(item => {
    const allergenColumns = AUSTRALIAN_ALLERGENS.map(allergen =>
      item.allergens.includes(allergen.code) ? 'Yes' : 'No',
    );
    return [
      item.name,
      item.type,
      item.category || '',
      ...allergenColumns,
      item.isVegetarian ? 'Yes' : 'No',
      item.isVegan ? 'Yes' : 'No',
    ];
  });

  const csvContent = [
    `Allergen Matrix - ${menuName}`,
    '',
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${menuName.replace(/[^a-z0-9]/gi, '_')}_allergen_matrix.csv"`,
    },
  });
}

function generateHTML(menuName: string, matrixData: any[], forPDF: boolean): NextResponse {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Allergen Matrix - ${menuName}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      margin: 20px;
      color: #333;
      background: #fff;
    }
    h1 {
      color: #000;
      margin-bottom: 10px;
    }
    .menu-info {
      color: #666;
      margin-bottom: 30px;
      font-size: 14px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      font-size: 12px;
    }
    th {
      background-color: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px 8px;
      text-align: left;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 11px;
    }
    th.allergen-header {
      text-align: center;
      writing-mode: vertical-rl;
      text-orientation: mixed;
      min-width: 30px;
    }
    td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: center;
    }
    td.item-name {
      text-align: left;
      font-weight: 500;
    }
    td.type {
      text-align: left;
      color: #666;
    }
    .has-allergen {
      color: #dc2626;
      font-weight: bold;
    }
    .no-allergen {
      color: #16a34a;
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
      background-color: #dcfce7;
      color: #166534;
    }
    .vegan {
      background-color: #d1fae5;
      color: #065f46;
    }
    @media print {
      body {
        margin: 0;
      }
      @page {
        margin: 1cm;
      }
    }
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
      ${matrixData.length === 0
        ? '<tr><td colspan="' + (AUSTRALIAN_ALLERGENS.length + 4) + '" style="text-align: center; padding: 20px; color: #999;">No items in this menu</td></tr>'
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
            .join('')}
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
