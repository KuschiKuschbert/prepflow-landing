import { ApiErrorHandler } from '@/lib/api-error-handler';
import { APP_BASE_URL } from '@/lib/constants';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import {
    fetchCleaningAreas,
    fetchEmployees,
    fetchRecipes,
    fetchStorageAreas,
    fetchSuppliers,
} from './helpers/fetch-entities';
import { QRCodeEntity } from './helpers/types';

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'SERVER_ERROR', 500),
        { status: 500 },
      );
    }

    const baseUrl =
      request.headers.get('origin') ||
      (request.headers.get('host')
        ? `${request.headers.get('host')?.includes('localhost') ? 'http' : 'https'}://${request.headers.get('host')}`
        : APP_BASE_URL);

    const [recipes, cleaningAreas, storageAreas, employees, suppliers] = await Promise.all([
      fetchRecipes(supabaseAdmin, baseUrl),
      fetchCleaningAreas(supabaseAdmin, baseUrl),
      fetchStorageAreas(supabaseAdmin, baseUrl),
      fetchEmployees(supabaseAdmin, baseUrl),
      fetchSuppliers(supabaseAdmin, baseUrl),
    ]);

    const entities: QRCodeEntity[] = [
      ...recipes,
      ...cleaningAreas,
      ...storageAreas,
      ...employees,
      ...suppliers,
    ];

    logger.info(`[QR Codes API] Returning ${entities.length} entities`);

    return NextResponse.json({
      success: true,
      entities,
      counts: {
        recipes: recipes.length,
        cleaningAreas: cleaningAreas.length,
        storageAreas: storageAreas.length,
        employees: employees.length,
        suppliers: suppliers.length,
        total: entities.length,
      },
    });
  } catch (error) {
    logger.error('[QR Codes API] Error fetching entities:', error);
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to fetch entities', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
