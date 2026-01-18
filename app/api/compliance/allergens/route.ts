/**
 * Compliance Allergen Overview API Endpoint
 * GET /api/compliance/allergens
 * Returns all dishes/recipes with aggregated allergens
 */

import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { fetchAllergenExportData } from '../allergens/export/helpers/fetchAllergenExportData';

/**
 * Gets allergen overview data for compliance.
 */
export async function GET(request: NextRequest) {
  try {
    const { error } = await standardAdminChecks(request);
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const excludeAllergen = searchParams.get('exclude_allergen');
    const menuIdsParam = searchParams.get('menu_ids');
    const menuIds = menuIdsParam ? menuIdsParam.split(',').filter(id => id.trim()) : null;

    // Fetch and filter allergen data
    const { items } = await fetchAllergenExportData(menuIds);
    const filteredItems = excludeAllergen
      ? items.filter(item => !item.allergens.includes(excludeAllergen))
      : items;

    return NextResponse.json({
      success: true,
      data: { items: filteredItems, total: filteredItems.length },
    });
  } catch (err) {
    if (err instanceof NextResponse) return err;

    logger.error('[Compliance Allergens API] Error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to fetch allergen overview', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
