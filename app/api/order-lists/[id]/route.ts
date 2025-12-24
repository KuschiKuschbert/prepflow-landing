import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { updateOrderListSchema } from './helpers/schemas';
import { updateOrderList } from './helpers/updateOrderList';
import { deleteOrderList } from './helpers/deleteOrderList';

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'SERVER_ERROR', 500),
        { status: 500 },
      );
    }

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Order list ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Order Lists API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = updateOrderListSchema.safeParse(body);
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

    const result = await updateOrderList(id, validationResult.data);
    if ('error' in result) {
      return NextResponse.json(result.error, { status: result.status });
    }

    return NextResponse.json(result);
  } catch (error) {
    logger.error('Order lists API error:', error);
    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'SERVER_ERROR', 500, {
        details: error instanceof Error ? error.message : 'An unexpected error occurred',
      }),
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'SERVER_ERROR', 500),
        { status: 500 },
      );
    }

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Order list ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const result = await deleteOrderList(id);
    if ('error' in result) {
      return NextResponse.json(result.error, { status: result.status });
    }

    return NextResponse.json(result);
  } catch (error) {
    logger.error('Order lists API error:', error);
    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'SERVER_ERROR', 500, {
        details: error instanceof Error ? error.message : 'An unexpected error occurred',
      }),
      { status: 500 },
    );
  }
}
