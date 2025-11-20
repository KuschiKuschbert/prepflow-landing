/**
 * API endpoint for exporting allergen matrix in various formats
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { AUSTRALIAN_ALLERGENS, consolidateAllergens } from '@/lib/allergens/australian-allergens';
import { fetchMenuWithItems } from '../../helpers/fetchMenuWithItems';
import { generateHTML } from './helpers/generateHTML';
import type { MenuItem } from '@/app/webapp/menu-builder/types';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
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
        ApiErrorHandler.createError(
          'Invalid format. Must be html, csv, or pdf',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    // Fetch menu with items
    const menu = await fetchMenuWithItems(menuId);

    if (!menu) {
      return NextResponse.json(ApiErrorHandler.createError('Menu not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }

    const matrixData = (menu.items || []).map((item: MenuItem) => {
      let allergens: string[] = [];
      if (item.allergens && Array.isArray(item.allergens)) {
        allergens = item.allergens;
      } else if (item.dish_id && item.dishes?.allergens && Array.isArray(item.dishes.allergens)) {
        allergens = item.dishes.allergens;
      } else if (
        item.recipe_id &&
        item.recipes?.allergens &&
        Array.isArray(item.recipes.allergens)
      ) {
        allergens = item.recipes.allergens;
      }
      const validAllergenCodes = AUSTRALIAN_ALLERGENS.map(a => a.code);
      allergens = consolidateAllergens(allergens).filter(code => validAllergenCodes.includes(code));
      const isVegetarian =
        item.is_vegetarian ??
        (item.dish_id ? item.dishes?.is_vegetarian : item.recipes?.is_vegetarian);
      const isVegan =
        item.is_vegan ?? (item.dish_id ? item.dishes?.is_vegan : item.recipes?.is_vegan);
      return {
        name: item.dish_id ? item.dishes?.dish_name : item.recipes?.recipe_name || 'Unknown',
        type: item.dish_id ? 'Dish' : 'Recipe',
        allergens,
        isVegetarian: isVegetarian === true,
        isVegan: isVegan === true,
        category: item.category,
      };
    });
    if (format === 'csv') return generateCSV(menu.menu_name, matrixData);
    if (format === 'pdf') return generateHTML(menu.menu_name, matrixData, true);
    return generateHTML(menu.menu_name, matrixData, false);
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
  const headers = [
    'Item Name',
    'Type',
    'Category',
    ...AUSTRALIAN_ALLERGENS.map(a => a.displayName),
    'Vegetarian',
    'Vegan',
  ];
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
