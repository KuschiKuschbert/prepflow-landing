/**
 * API endpoint for exporting combined menu display and allergen matrix
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import type { ExportTheme } from '@/lib/exports/themes';
import { logger } from '@/lib/logger';
import { getAuthenticatedUser } from '@/lib/server/get-authenticated-user';
import { NextRequest, NextResponse } from 'next/server';
import { EnrichedMenuItem } from '../../types';
import { fetchMenuWithItems } from '../helpers/fetchMenuWithItems';
import { resolveMenuId } from '../helpers/resolveMenuId';
import { fetchRecipeCards } from './helpers/fetchRecipeCards';
import { generateCombinedCSV } from './helpers/generateCombinedCSV';
import { generateCombinedHTML } from './helpers/generateCombinedHTML';
import { transformMatrixData } from './helpers/transformMatrixData';
import { transformMenuData } from './helpers/transformMenuData';
import { validateRequest } from './helpers/validateRequest';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // 0. Use resolveMenuId to support magic IDs like 'latest'
    const { id: menuIdParam } = await context.params;
    const { userId } = await getAuthenticatedUser(request);
    const menuId = await resolveMenuId(menuIdParam, userId);

    const { searchParams } = new URL(request.url);

    const format = searchParams.get('format') || 'html';
    const include = searchParams.get('include') || 'menu,matrix';
    const themeParam = searchParams.get('theme') || 'cyber-carrot';
    const VALID_THEMES: ExportTheme[] = [
      'cyber-carrot',
      'electric-lemon',
      'phantom-pepper',
      'cosmic-blueberry',
    ];
    const theme: ExportTheme = VALID_THEMES.includes(themeParam as ExportTheme)
      ? (themeParam as ExportTheme)
      : 'cyber-carrot';

    // Validate request parameters
    const validation = validateRequest(menuId, format, include);
    if ('error' in validation) {
      return validation.error;
    }
    const { options } = validation;

    // Check feature access for CSV/PDF exports (requires Pro tier)
    if (options.format === 'csv' || options.format === 'pdf') {
      try {
        const { requireAuth } = await import('@/lib/auth0-api-helpers');
        const { checkFeatureAccess } = await import('@/lib/api-feature-gate');

        const user = await requireAuth(request);
        const featureKey = options.format === 'csv' ? 'export_csv' : 'export_pdf';
        await checkFeatureAccess(featureKey, user, request);
      } catch (error) {
        if (error instanceof NextResponse) return error;
        throw error;
      }
    }

    // Fetch menu with items (this automatically triggers enrichment and dietary recalculation)
    const menu = await fetchMenuWithItems(menuId, userId);

    if (!menu) {
      return NextResponse.json(ApiErrorHandler.createError('Menu not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }

    // Transform menu items to display data (only if needed)
    const menuData = options.includeMenu ? transformMenuData(menu.items as EnrichedMenuItem[]) : [];

    // Transform menu items to allergen matrix data (only if needed)
    const matrixData = options.includeMatrix
      ? transformMatrixData(menu.items as EnrichedMenuItem[])
      : [];

    // Fetch recipe cards (only if needed)
    const recipeCardsData = options.includeRecipes ? await fetchRecipeCards(menuId) : [];

    // Generate export based on format
    if (options.format === 'csv') {
      return generateCombinedCSV(
        menu.menu_name,
        menuData,
        matrixData,
        recipeCardsData,
        options.includeMenu,
        options.includeMatrix,
        options.includeRecipes,
      );
    }
    if (options.format === 'pdf') {
      return await generateCombinedHTML(
        menu.menu_name,
        menuData,
        matrixData,
        recipeCardsData,
        options.includeMenu,
        options.includeMatrix,
        options.includeRecipes,
        true,
        theme,
      );
    }
    return await generateCombinedHTML(
      menu.menu_name,
      menuData,
      matrixData,
      recipeCardsData,
      options.includeMenu,
      options.includeMatrix,
      options.includeRecipes,
      false,
      theme,
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
