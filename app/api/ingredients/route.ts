/**
 * Ingredients API Routes
 *
 * 📚 Square Integration: This route automatically triggers Square sync hooks after ingredient
 * create/update operations. See `docs/SQUARE_API_REFERENCE.md` (Automatic Sync section) for details.
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { getUserEmail } from '@/lib/auth0-api-helpers';
import { logger } from '@/lib/logger';
import { triggerIngredientSync } from '@/lib/square/sync/hooks';
import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { createIngredient } from './helpers/createIngredient';
import { handleDeleteIngredient } from './helpers/deleteIngredientHandler';
import { handleIngredientError } from './helpers/handleIngredientError';
import { createIngredientSchema, updateIngredientSchema } from './helpers/schemas';
import { updateIngredient } from './helpers/updateIngredient';

// Helper to safely parse request body
async function safeParseBody(request: NextRequest) {
  try {
    return await request.json();
  } catch (err) {
    logger.warn('[Ingredients API] Failed to parse request JSON:', {
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = createSupabaseAdmin();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    const { data, error, count } = await supabaseAdmin
      .from('ingredients')
      .select('*', { count: 'exact' })
      .order('ingredient_name')
      .range(start, end);

    if (error) {
      logger.error('[Ingredients API] Database error fetching ingredients:', {
        error: error.message,
        code: error.code,
        context: { endpoint: '/api/ingredients', operation: 'GET', table: 'ingredients' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        items: data || [],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    });
  } catch (err) {
    logger.error('[Ingredients API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/ingredients', method: 'GET' },
    });
    return handleIngredientError(err, 'GET');
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Ingredients API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = createIngredientSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validationResult.error.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const data = await createIngredient(validationResult.data);

    // Trigger Square sync hook (non-blocking)
    (async () => {
      try {
        await triggerIngredientSync(request, data.id, 'create');
      } catch (err) {
        logger.error('[Ingredients API] Error triggering Square sync:', {
          error: err instanceof Error ? err.message : String(err),
          ingredientId: data.id,
        });
      }
    })();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err) {
    logger.error('[Ingredients API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/ingredients', method: 'POST' },
    });
    if (
      err &&
      typeof err === 'object' &&
      'status' in err &&
      typeof (err as Record<string, unknown>).status === 'number'
    ) {
      return NextResponse.json(err, { status: (err as { status: number }).status });
    }
    return handleIngredientError(err, 'POST');
  }
}

export async function PUT(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Ingredients API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = updateIngredientSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validationResult.error.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const { id, ...updates } = validationResult.data;

    // Get user email for change tracking
    let userEmail: string | null = null;
    try {
      userEmail = await getUserEmail(request);
    } catch (authError) {
      // Continue without user email if auth fails (for development)
      logger.warn('[Ingredients API] Could not get user email for change tracking:', authError);
    }

    const data = await updateIngredient(id, updates, userEmail);

    // Trigger Square sync hook (non-blocking)
    (async () => {
      try {
        await triggerIngredientSync(request, id, 'update');
      } catch (err) {
        logger.error('[Ingredients API] Error triggering Square sync:', {
          error: err instanceof Error ? err.message : String(err),
          ingredientId: id,
        });
      }
    })();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err) {
    logger.error('[Ingredients API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/ingredients', method: 'PUT' },
    });
    if (err && typeof err === 'object' && 'status' in err && typeof err.status === 'number') {
      return NextResponse.json(err, { status: (err as { status: number }).status });
    }
    return handleIngredientError(err, 'PUT');
  }
}

export async function DELETE(request: NextRequest) {
  return handleDeleteIngredient(request);
}
