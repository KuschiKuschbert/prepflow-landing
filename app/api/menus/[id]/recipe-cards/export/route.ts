/**
 * Recipe Cards Export API Endpoint
 * GET /api/menus/[id]/recipe-cards/export - Export recipe cards in various formats
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { checkFeatureAccess } from '@/lib/api-feature-gate';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { getAuthenticatedUser } from '@/lib/server/get-authenticated-user';
import { createSupabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import type { ExportTheme } from '@/lib/exports/themes';
import { resolveMenuId } from '../../helpers/resolveMenuId';
import { fetchAndTransformCards } from './helpers/fetchAndTransformCards';
import { generateCSV, type RecipeCardData } from './helpers/generateCSV';
import { generateHTML } from './helpers/generateHTML';

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

    if (format === 'csv' || format === 'pdf') {
      try {
        const user = await requireAuth(request);
        const featureKey = format === 'csv' ? 'export_csv' : 'export_pdf';
        await checkFeatureAccess(featureKey, user, request);
      } catch (error) {
        if (error instanceof NextResponse) return error;
        throw error;
      }
    }

    const supabase = createSupabaseAdmin();
    const result = await fetchAndTransformCards(supabase, menuId);

    if (result instanceof NextResponse) return result;

    const { cards, menuName } = result;

    if (format === 'csv') return generateCSV(menuName, cards as unknown as RecipeCardData[]);
    if (format === 'pdf')
      return generateHTML(menuName, cards as unknown as RecipeCardData[], true, theme);
    return generateHTML(menuName, cards as unknown as RecipeCardData[], false, theme);
  } catch (err) {
    logger.error('[Recipe Cards Export API] Unexpected error:', {
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
