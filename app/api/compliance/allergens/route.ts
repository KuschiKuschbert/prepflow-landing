/**
 * Compliance Allergen Overview API Endpoint
 * GET /api/compliance/allergens
 * Returns all dishes/recipes with aggregated allergens
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { fetchAllergenExportData } from '../allergens/export/helpers/fetchAllergenExportData';

/**
 * Gets allergen overview data for compliance.
 *
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<NextResponse>} Allergen overview response
 */
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const excludeAllergen = searchParams.get('exclude_allergen');
    const menuIdsParam = searchParams.get('menu_ids');
    const menuIds = menuIdsParam ? menuIdsParam.split(',').filter(id => id.trim()) : null;

    // Fetch all allergen export data (reuses the same logic)
    const { items } = await fetchAllergenExportData(menuIds);

    // Filter by allergen if requested
    let filteredItems = items;
    if (excludeAllergen) {
      filteredItems = filteredItems.filter(item => !item.allergens.includes(excludeAllergen));
    }

    return NextResponse.json({
      success: true,
      data: {
        items: filteredItems,
        total: filteredItems.length,
      },
    });
  } catch (err) {
    logger.error('[Compliance Allergens API] Error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to fetch allergen overview',
        'SERVER_ERROR',
        500,
        err instanceof Error ? err.message : String(err),
      ),
      { status: 500 },
    );
  }
}
