/**
 * Ingredients API Routes
 *
 * 📚 Square Integration: This route automatically triggers Square sync hooks after ingredient
 * create/update operations. See `docs/SQUARE_API_REFERENCE.md` (Automatic Sync section) for details.
 */

import { getUserEmail } from '@/lib/auth0-api-helpers';
import { logger } from '@/lib/logger';
import { getAuthenticatedUser } from '@/lib/server/get-authenticated-user';
import { triggerIngredientSync } from '@/lib/square/sync/hooks';
import { NextRequest, NextResponse } from 'next/server';
import { createIngredient } from './helpers/createIngredient';
import { handleDeleteIngredient } from './helpers/deleteIngredientHandler';
import { handleGetIngredients } from './helpers/getIngredientsHandler';
import { handleIngredientError } from './helpers/handleIngredientError';
import { parseAndValidateRequest } from './helpers/requestHelpers';
import { createIngredientSchema, updateIngredientSchema } from './helpers/schemas';
import { updateIngredient } from './helpers/updateIngredient';

export async function GET(request: NextRequest) {
  return handleGetIngredients(request);
}

export async function POST(request: NextRequest) {
  try {
    const dataOrResponse = await parseAndValidateRequest(
      request,
      createIngredientSchema,
      'Ingredients API',
    );
    if (dataOrResponse instanceof NextResponse) {
      return dataOrResponse;
    }

    const { userId } = await getAuthenticatedUser(request);

    const data = await createIngredient(dataOrResponse, userId);

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
    const dataOrResponse = await parseAndValidateRequest(
      request,
      updateIngredientSchema,
      'Ingredients API',
    );
    if (dataOrResponse instanceof NextResponse) {
      return dataOrResponse;
    }
    const { id, ...updates } = dataOrResponse;

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
  try {
    const { userId } = await getAuthenticatedUser(request);

    return handleDeleteIngredient(request, userId);
  } catch (err) {
    if (err instanceof NextResponse) return err;
    return handleIngredientError(err, 'DELETE');
  }
}
