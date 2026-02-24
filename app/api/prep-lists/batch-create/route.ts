import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { processBatchCreation } from './helpers/processBatch';

interface _PrepListToCreate {
  sectionId: string | null;
  name: string;
  notes?: string;
  items: Array<{
    ingredientId: string;
    quantity: string;
    unit: string;
    notes: string;
  }>;
}

import { batchCreateSchema } from '../helpers/schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = batchCreateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validation.error.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const { prepLists, userId } = validation.data;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Database connection could not be established',
          'DATABASE_ERROR',
          500,
        ),
        { status: 500 },
      );
    }

    const { createdIds, errors } = await processBatchCreation(userId, prepLists);

    if (createdIds.length === 0 && errors.length > 0) {
      return NextResponse.json(
        ApiErrorHandler.createError('All prep lists failed to create', 'BATCH_CREATE_FAILED', 500, {
          errors,
        }),
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully created ${createdIds.length} prep list(s)`,
      data: {
        createdCount: createdIds.length,
        createdIds: createdIds,
        errors: errors.length > 0 ? errors : undefined,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          err.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }
    logger.error('Unexpected error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError(
        err instanceof Error ? err.message : 'Unknown error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
