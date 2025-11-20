/**
 * Dietary Suitability API Endpoint
 * GET /api/recipes/[id]/dietary-suitability - Get dietary status
 * POST /api/recipes/[id]/dietary-suitability - Trigger detection
 */

import { NextRequest, NextResponse } from 'next/server';
import { aggregateRecipeDietaryStatus } from '@/lib/dietary/dietary-aggregation';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Recipe ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Get dietary status (will check cache first)
    const status = await aggregateRecipeDietaryStatus(id);

    if (!status) {
      return NextResponse.json(ApiErrorHandler.createError('Recipe not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }

    return NextResponse.json({
      success: true,
      data: status,
    });
  } catch (err) {
    logger.error('[Dietary Suitability API] Error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to get dietary suitability',
        'SERVER_ERROR',
        500,
        err instanceof Error ? err.message : String(err),
      ),
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Recipe ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const { searchParams } = new URL(request.url);
    const useAI = searchParams.get('use_ai') === 'true';

    // Trigger detection (will use AI if requested or if confidence is low)
    const status = await aggregateRecipeDietaryStatus(id, useAI);

    if (!status) {
      return NextResponse.json(ApiErrorHandler.createError('Recipe not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }

    return NextResponse.json({
      success: true,
      data: status,
    });
  } catch (err) {
    logger.error('[Dietary Suitability API] Error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to detect dietary suitability',
        'SERVER_ERROR',
        500,
        err instanceof Error ? err.message : String(err),
      ),
      { status: 500 },
    );
  }
}
