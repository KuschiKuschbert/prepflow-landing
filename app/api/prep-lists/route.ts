import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { createPrepList } from './helpers/createPrepList';
import { deletePrepList } from './helpers/deletePrepList';
import { fetchAllPrepListData } from './helpers/fetchPrepLists';
import { handlePrepListError } from './helpers/handlePrepListError';
import { parseDeleteRequest } from './helpers/parseDeleteRequest';
import { createPrepListSchema, getPrepListsSchema, updatePrepListSchema } from './helpers/schemas';
import { transformItems } from './helpers/transformItems';
import { updatePrepList } from './helpers/updatePrepList';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    const validation = getPrepListsSchema.safeParse(params);
    if (!validation.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validation.error.issues[0]?.message || 'Invalid query parameters',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const { userId, page, pageSize } = validation.data;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const data = await fetchAllPrepListData({
      userId: userId || null,
      page,
      pageSize,
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err) {
    logger.error('[Prep Lists API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/prep-lists', method: 'GET' },
    });
    return handlePrepListError(err, 'GET');
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch (_err) {
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid JSON body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validation = createPrepListSchema.safeParse(body);
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

    const { userId, kitchenSectionId, name, notes, items } = validation.data;
    const prepList = await createPrepList({
      userId,
      kitchenSectionId,
      name,
      notes,
      items: transformItems(items || []),
    });

    return NextResponse.json({
      success: true,
      message: 'Prep list created successfully',
      data: prepList,
    });
  } catch (err: unknown) {
    logger.error('[Prep Lists API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/prep-lists', method: 'POST' },
    });
    return handlePrepListError(err, 'POST');
  }
}

export async function PUT(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch (_err) {
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid JSON body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validation = updatePrepListSchema.safeParse(body);
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

    const data = await updatePrepList(validation.data);

    return NextResponse.json({
      success: true,
      message: 'Prep list updated successfully',
      data,
    });
  } catch (err: unknown) {
    logger.error('[Prep Lists API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/prep-lists', method: 'PUT' },
    });
    return handlePrepListError(err, 'PUT');
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = parseDeleteRequest(request);

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Prep list ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    await deletePrepList(id);

    return NextResponse.json({
      success: true,
      message: 'Prep list deleted successfully',
    });
  } catch (err: unknown) {
    logger.error('[Prep Lists API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/prep-lists', method: 'DELETE' },
    });
    return handlePrepListError(err, 'DELETE');
  }
}
