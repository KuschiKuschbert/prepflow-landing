/**
 * Compliance Allergen Export API Endpoint
 * GET /api/compliance/allergens/export
 * Exports allergen overview data in CSV, PDF, or HTML format
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { checkFeatureAccess } from '@/lib/api-feature-gate';
import { authOptions } from '@/lib/auth-options';
import { getServerSession } from 'next-auth';
import { fetchAllergenExportData } from './helpers/fetchAllergenExportData';
import { generateCSVExport } from './helpers/generateCSVExport';
import { generateHTMLExport } from './helpers/generateHTMLExport';

/**
 * Exports allergen overview data for compliance.
 *
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<NextResponse>} Export file response
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
    const excludeAllergen = searchParams.get('exclude_allergen');
    const menuIdsParam = searchParams.get('menu_ids');
    const menuIds = menuIdsParam ? menuIdsParam.split(',').filter(id => id.trim()) : null;

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
    // HTML export is available to all tiers
    if (format === 'csv' || format === 'pdf') {
      const session = await getServerSession(authOptions);
      if (session?.user?.email) {
        try {
          const featureKey = format === 'csv' ? 'export_csv' : 'export_pdf';
          await checkFeatureAccess(featureKey, session.user.email, request);
        } catch (error) {
          // checkFeatureAccess throws NextResponse, so return it
          return error as NextResponse;
        }
      }
    }

    // Fetch all allergen export data
    const { items } = await fetchAllergenExportData(menuIds);

    // Apply allergen filter if provided
    let filteredItems = items;
    if (excludeAllergen) {
      filteredItems = filteredItems.filter(item => !item.allergens.includes(excludeAllergen));
    }

    // Generate export based on format
    if (format === 'csv') {
      return generateCSVExport(filteredItems);
    }
    if (format === 'pdf') {
      return generateHTMLExport(filteredItems, true);
    }
    return generateHTMLExport(filteredItems, false);
  } catch (err) {
    logger.error('[Compliance Allergen Export] Error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to export allergen overview',
        'SERVER_ERROR',
        500,
        err instanceof Error ? err.message : String(err),
      ),
      { status: 500 },
    );
  }
}
