/**
 * API endpoint for exporting combined menu display and allergen matrix
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { EnrichedMenuItem } from '../../types';
import { fetchMenuWithItems } from '../helpers/fetchMenuWithItems';
import { fetchRecipeCards } from './helpers/fetchRecipeCards';
import { generateCombinedCSV } from './helpers/generateCombinedCSV';
import { generateCombinedHTML } from './helpers/generateCombinedHTML';
import { recalculateDietaryStatus } from './helpers/recalculateDietaryStatus';
import { transformMatrixData } from './helpers/transformMatrixData';
import { transformMenuData } from './helpers/transformMenuData';
import { validateRequest } from './helpers/validateRequest';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: menuId } = await context.params;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'html';
    const include = searchParams.get('include') || 'menu,matrix';

    // Validate request parameters
    const validation = validateRequest(menuId, format, include);
    if ('error' in validation) {
      return validation.error;
    }
    const { options } = validation;

    // Fetch menu with items
    const menu = await fetchMenuWithItems(menuId);

    if (!menu) {
      return NextResponse.json(ApiErrorHandler.createError('Menu not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }

    // Ensure fresh dietary data by triggering recalculation for all recipes/dishes
    await recalculateDietaryStatus(menu.items as EnrichedMenuItem[]);

    // Re-fetch menu with items to get updated dietary status
    const menuWithFreshData = await fetchMenuWithItems(menuId);

    if (!menuWithFreshData) {
      return NextResponse.json(ApiErrorHandler.createError('Menu not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }

    // Transform menu items to display data (only if needed)
    const menuData = options.includeMenu
      ? transformMenuData(menuWithFreshData.items as EnrichedMenuItem[])
      : [];

    // Transform menu items to allergen matrix data (only if needed)
    const matrixData = options.includeMatrix
      ? transformMatrixData(menuWithFreshData.items as EnrichedMenuItem[])
      : [];

    // Fetch recipe cards (only if needed)
    const recipeCardsData = options.includeRecipes ? await fetchRecipeCards(menuId) : [];

    // Generate export based on format
    if (options.format === 'csv') {
      return generateCombinedCSV(
        menuWithFreshData.menu_name,
        menuData,
        matrixData,
        recipeCardsData,
        options.includeMenu,
        options.includeMatrix,
        options.includeRecipes,
      );
    }
    if (options.format === 'pdf') {
      return generateCombinedHTML(
        menuWithFreshData.menu_name,
        menuData,
        matrixData,
        recipeCardsData,
        options.includeMenu,
        options.includeMatrix,
        options.includeRecipes,
        true,
      );
    }
    return generateCombinedHTML(
      menuWithFreshData.menu_name,
      menuData,
      matrixData,
      recipeCardsData,
      options.includeMenu,
      options.includeMatrix,
      options.includeRecipes,
      false,
    );
  } catch (err) {
    logger.error('[Combined Export API] Unexpected error:', {
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
