/**
 * Compliance Allergen Export API Endpoint
 * GET /api/compliance/allergens/export
 * Exports allergen overview data in CSV, PDF, or HTML format
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { checkFeatureAccess } from '@/lib/api-feature-gate';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { fetchAllergenExportData } from './helpers/fetchAllergenExportData';
import { generateCSVExport } from './helpers/generateCSVExport';
import { generateHTMLExport } from './helpers/generateHTMLExport';

/**
 * Exports allergen overview data for compliance.
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
    const format = searchParams.get('format') || 'html';
    const theme = (searchParams.get('theme') || 'cyber-carrot') as any;
    const excludeAllergen = searchParams.get('exclude_allergen');
    const menuIdsParam = searchParams.get('menu_ids');
    const menuIds = menuIdsParam ? menuIdsParam.split(',').filter(id => id.trim()) : null;

    if (!['html', 'csv', 'pdf'].includes(format)) {
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid format', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Check feature access (flattened)
    if (format === 'csv' || format === 'pdf') {
      const user = await requireAuth(request);
      if (!user?.email) {
        return NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'UNAUTHORIZED', 401), {
          status: 401,
        });
      }
      const featureKey = format === 'csv' ? 'export_csv' : 'export_pdf';
      const accessResult = await checkFeatureAccess(featureKey, user.email, request);
      if (accessResult instanceof NextResponse) return accessResult;
    }

    // Export logic
    const { items } = await fetchAllergenExportData(menuIds);
    const filteredItems = excludeAllergen
      ? items.filter(item => !item.allergens.includes(excludeAllergen))
      : items;

    if (format === 'csv') return generateCSVExport(filteredItems);
    return generateHTMLExport(filteredItems, format === 'pdf', theme);
  } catch (err) {
    // Pass through NextResponse errors (e.g. from checkFeatureAccess or requireAuth)
    if (err instanceof NextResponse) {
      return err;
    }

    logger.error('[Compliance Allergen Export] Error:', {
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      raw: err,
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to export allergen overview', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
