import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createPrepList } from './helpers/createPrepList';
import { deletePrepList } from './helpers/deletePrepList';
import { fetchAllPrepListData } from './helpers/fetchPrepLists';
import { handlePrepListError } from './helpers/handlePrepListError';
import { parseDeleteRequest } from './helpers/parseDeleteRequest';
import { createPrepListSchema, getPrepListsSchema, updatePrepListSchema } from './helpers/schemas';
import { transformItems } from './helpers/transformItems';
import { updatePrepList } from './helpers/updatePrepList';

async function getAuthenticatedUser(request: NextRequest) {
  const supabaseAdmin = createSupabaseAdmin();

  // Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(
    request.headers.get('Authorization')?.replace('Bearer ', '') || '',
  );

  // Fallback/Use Auth0 helper
  const { requireAuth } = await import('@/lib/auth0-api-helpers');
  const authUser = await requireAuth(request);

  // Get user_id from email
  const { data: userData, error: userError } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', authUser.email)
    .single();

  if (userError || !userData) {
    throw ApiErrorHandler.createError('User not found', 'NOT_FOUND', 404);
  }
  return { userId: userData.id, supabaseAdmin };
}

export async function GET(request: NextRequest) {
  try {
    const { userId: authUserId } = await getAuthenticatedUser(request);

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

    const { page, pageSize } = validation.data;

    // Use authUserId to ensure security
    const data = await fetchAllPrepListData({
      userId: authUserId,
      page,
      pageSize,
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err) {
    if (err instanceof NextResponse) return err;
    if (ApiErrorHandler.isApiError(err)) {
      return NextResponse.json(ApiErrorHandler.toResponseData(err), {
        status: ApiErrorHandler.getStatus(err),
      });
    }

    logger.error('[Prep Lists API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/prep-lists', method: 'GET' },
    });
    return handlePrepListError(err, 'GET');
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId: authUserId } = await getAuthenticatedUser(request);

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

    const { kitchenSectionId, name, notes, items } = validation.data;

    // Overwrite userId with authenticated user ID
    const prepList = await createPrepList({
      userId: authUserId,
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
    if (err instanceof NextResponse) return err;
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
    if (ApiErrorHandler.isApiError(err)) {
      return NextResponse.json(ApiErrorHandler.toResponseData(err), {
        status: ApiErrorHandler.getStatus(err),
      });
    }

    logger.error('[Prep Lists API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/prep-lists', method: 'POST' },
    });
    return handlePrepListError(err, 'POST');
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId: authUserId } = await getAuthenticatedUser(request);

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

    const data = await updatePrepList(validation.data, authUserId);

    return NextResponse.json({
      success: true,
      message: 'Prep list updated successfully',
      data,
    });
  } catch (err: unknown) {
    if (err instanceof NextResponse) return err;
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
    if (ApiErrorHandler.isApiError(err)) {
      return NextResponse.json(ApiErrorHandler.toResponseData(err), {
        status: ApiErrorHandler.getStatus(err),
      });
    }

    logger.error('[Prep Lists API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/prep-lists', method: 'PUT' },
    });
    return handlePrepListError(err, 'PUT');
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId: authUserId } = await getAuthenticatedUser(request);

    const id = parseDeleteRequest(request);

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Prep list ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    await deletePrepList(id, authUserId);

    return NextResponse.json({
      success: true,
      message: 'Prep list deleted successfully',
    });
  } catch (err: unknown) {
    if (err instanceof NextResponse) return err;
    if (ApiErrorHandler.isApiError(err)) {
      return NextResponse.json(ApiErrorHandler.toResponseData(err), {
        status: ApiErrorHandler.getStatus(err),
      });
    }

    logger.error('[Prep Lists API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/prep-lists', method: 'DELETE' },
    });
    return handlePrepListError(err, 'DELETE');
  }
}
