/**
 * API endpoint for exporting menu display in various formats
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { fetchMenuWithItems } from '../../helpers/fetchMenuWithItems';
import { generateHTML } from './helpers/generateHTML';
import { generateCSV } from './helpers/generateCSV';
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

    // Transform menu items to display data
    const menuData = (menu.items || []).map((item: MenuItem) => {
      const isDish = !!item.dish_id;
      const itemName = isDish
        ? item.dishes?.dish_name || 'Unknown Dish'
        : item.recipes?.recipe_name || 'Unknown Recipe';

      const description = isDish ? item.dishes?.description : item.recipes?.description;

      // Get price - prefer actual_selling_price, fallback to selling_price or recommended_selling_price
      const price =
        item.actual_selling_price ||
        (isDish ? item.dishes?.selling_price : item.recommended_selling_price) ||
        0;

      return {
        name: itemName,
        description: description || undefined,
        price,
        category: item.category || 'Uncategorized',
      };
    });

    // Generate export based on format
    if (format === 'csv') {
      return generateCSV(menu.menu_name, menuData);
    }
    if (format === 'pdf') {
      return generateHTML(menu.menu_name, menuData, true);
    }
    return generateHTML(menu.menu_name, menuData, false);
  } catch (err) {
    logger.error('[Menu Display Export API] Unexpected error:', {
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
