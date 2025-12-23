/**
 * Allergen Cross-Reference API Endpoint
 * GET /api/allergens/[code]/ingredients
 * Returns all ingredients containing a specific allergen
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Gets all ingredients containing a specific allergen.
 *
 * @param {NextRequest} request - Next.js request object
 * @param {Object} context - Route context with params
 * @returns {Promise<NextResponse>} Ingredients with allergen
 */
export async function GET(_request: NextRequest, context: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await context.params;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    if (!code) {
      return NextResponse.json(
        ApiErrorHandler.createError('Allergen code is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Query ingredients where allergens JSONB array contains the allergen code
    const { data: ingredients, error } = await supabaseAdmin
      .from('ingredients')
      .select('id, ingredient_name, brand, allergens, allergen_source')
      .contains('allergens', [code])
      .order('ingredient_name');

    if (error) {
      logger.error('[Allergen Cross-Reference API] Error fetching ingredients:', {
        allergenCode: code,
        error: error.message,
        code: (error as any).code,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to fetch ingredients', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        allergen_code: code,
        ingredients: ingredients || [],
        count: ingredients?.length || 0,
      },
    });
  } catch (err) {
    logger.error('[Allergen Cross-Reference API] Unexpected error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to fetch ingredients with allergen',
        'SERVER_ERROR',
        500,
        err instanceof Error ? err.message : String(err),
      ),
      { status: 500 },
    );
  }
}




