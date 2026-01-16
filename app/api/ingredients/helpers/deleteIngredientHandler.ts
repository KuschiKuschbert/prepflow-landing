import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
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
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'status' in err &&
      typeof (err as { status: unknown }).status === 'number'
    ) {
      const errorWithStatus = err as { status: number; message: string };
      logger.error('[Ingredients API] Error with status:', {
        error: errorWithStatus.message || String(err),
        status: errorWithStatus.status,
        context: { endpoint: '/api/ingredients', method: 'DELETE' },
      });
      return NextResponse.json(err, { status: errorWithStatus.status });
    }
    return handleIngredientError(err, 'DELETE');
  }
}
