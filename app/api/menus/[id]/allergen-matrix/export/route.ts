/**
 * API endpoint for exporting allergen matrix in various formats
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import {
  aggregateDishDietaryStatus,
  aggregateRecipeDietaryStatus,
} from '@/lib/dietary/dietary-aggregation';
import type { ExportTheme } from '@/lib/exports/themes';
import { logger } from '@/lib/logger';
import { getAuthenticatedUser } from '@/lib/server/get-authenticated-user';
import { NextRequest, NextResponse } from 'next/server';
import { EnrichedMenuItem } from '../../../types';
import { fetchMenuWithItems } from '../../helpers/fetchMenuWithItems';
import { resolveMenuId } from '../../helpers/resolveMenuId';
import { generateHTML } from './helpers/generateHTML';
import { generateCSV, processMenuItemsToMatrix } from './helpers/processMatrixData';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: menuIdParam } = await context.params;
    const { userId } = await getAuthenticatedUser(request);
    const menuId = await resolveMenuId(menuIdParam, userId);

    const { searchParams } = new URL(request.url);

    const format = searchParams.get('format') || 'html';
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
    // Check feature access for CSV/PDF exports (requires Pro tier)
    if (format === 'csv' || format === 'pdf') {
      try {
        const { requireAuth } = await import('@/lib/auth0-api-helpers');
        const { checkFeatureAccess } = await import('@/lib/api-feature-gate');

        const user = await requireAuth(request);
        const featureKey = format === 'csv' ? 'export_csv' : 'export_pdf';
        await checkFeatureAccess(featureKey, user, request);
      } catch (error) {
        if (error instanceof NextResponse) return error;
        throw error;
      }
    }

    // Fetch menu with items

    const menu = await fetchMenuWithItems(menuId, userId);

    if (!menu) {
      return NextResponse.json(ApiErrorHandler.createError('Menu not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }

    // Ensure fresh dietary data by triggering recalculation for all recipes/dishes
    // This ensures the allergen matrix always shows accurate vegan/vegetarian status
    const dietaryRecalculations = (menu.items || []).map(async (item: EnrichedMenuItem) => {
      try {
        if (item.recipe_id) {
          // Force recalculation for recipes to ensure fresh dietary status
          await aggregateRecipeDietaryStatus(item.recipe_id, false, true);
        } else if (item.dish_id) {
          // Force recalculation for dishes to ensure fresh dietary status
          await aggregateDishDietaryStatus(item.dish_id, false, true);
        }
      } catch (err: unknown) {
        // Log but don't fail the export if recalculation fails
        logger.warn('[Allergen Matrix Export] Failed to recalculate dietary status:', {
          itemId: item.recipe_id || item.dish_id,
          type: item.recipe_id ? 'recipe' : 'dish',
          error: err instanceof Error ? err.message : String(err),
        });
      }
    });

    // Wait for all dietary recalculations to complete (in parallel)
    await Promise.all(dietaryRecalculations);

    // Re-fetch menu with items to get updated dietary status
    const menuWithFreshData = await fetchMenuWithItems(menuId, userId);

    if (!menuWithFreshData) {
      return NextResponse.json(ApiErrorHandler.createError('Menu not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }

    const matrixData = processMenuItemsToMatrix(menuWithFreshData.items || []);

    if (format === 'csv') return generateCSV(menuWithFreshData.menu_name, matrixData);
    if (format === 'pdf')
      return await generateHTML(menuWithFreshData.menu_name, matrixData, true, theme);
    return await generateHTML(menuWithFreshData.menu_name, matrixData, false, theme);
  } catch (err: unknown) {
    logger.error('[Allergen Matrix Export API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    return NextResponse.json(
      ApiErrorHandler.createError(
        err instanceof Error ? err.message : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
