import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { deleteIngredient } from './deleteIngredient';
import { handleIngredientError } from './handleIngredientError';

export async function handleDeleteIngredient(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Ingredient ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    await deleteIngredient(id);

    return NextResponse.json({
      success: true,
      message: 'Ingredient deleted successfully',
    });
  } catch (err: any) {
    logger.error('[Ingredients API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/ingredients', method: 'DELETE' },
    });
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handleIngredientError(err, 'DELETE');
  }
}

