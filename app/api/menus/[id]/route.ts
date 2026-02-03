import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { updateMenuSchema } from '../helpers/schemas';
import { buildMenuUpdateData } from './helpers/buildMenuUpdateData';
import { deleteMenu } from './helpers/deleteMenu';
import { fetchMenuWithItems } from './helpers/fetchMenuWithItems';
import { handleMenuError } from './helpers/handleMenuError';
import { updateMenu } from './helpers/updateMenu';
import { validateMenuId } from './helpers/validateMenuId';

// Helper to safely parse request body
async function safeParseBody(request: NextRequest) {
  try {
    return await request.json();
  } catch (err) {
    logger.warn('[Menus API] Failed to parse request JSON:', {
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

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
  return { userId: userData.id };
}

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: menuId } = await context.params;
  try {
    const { userId } = await getAuthenticatedUser(_req);

    const validationError = validateMenuId(menuId);
    if (validationError) return validationError;

    const menu = await fetchMenuWithItems(menuId, userId);

    return NextResponse.json({
      success: true,
      menu,
    });
  } catch (err: unknown) {
    if (err instanceof NextResponse) return err;
    if (err instanceof Error && 'status' in err) {
      return NextResponse.json(err, { status: (err as any).status });
    }

    logger.error('[Menus API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/menus/[id]', method: 'GET', menuId },
    });
    return handleMenuError(err, 'GET');
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: menuId } = await context.params;
  try {
    const { userId } = await getAuthenticatedUser(request);

    const validationError = validateMenuId(menuId);
    if (validationError) return validationError;

    const body = await safeParseBody(request);

    const validationResult = updateMenuSchema.safeParse(body);
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

    const updateData = buildMenuUpdateData(validationResult.data);
    const updatedMenu = await updateMenu(menuId, updateData, userId);

    return NextResponse.json({
      success: true,
      menu: updatedMenu,
      message: 'Menu updated successfully',
    });
  } catch (err: unknown) {
    if (err instanceof NextResponse) return err;
    if (err instanceof Error && 'status' in err) {
      return NextResponse.json(err, { status: (err as any).status });
    }

    logger.error('[Menus API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/menus/[id]', method: 'PUT', menuId },
    });
    return handleMenuError(err, 'PUT');
  }
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: menuId } = await context.params;
  try {
    const { userId } = await getAuthenticatedUser(_req);

    const validationError = validateMenuId(menuId);
    if (validationError) return validationError;

    await deleteMenu(menuId, userId);

    return NextResponse.json({
      success: true,
      message: 'Menu deleted successfully',
    });
  } catch (err: unknown) {
    if (err instanceof NextResponse) return err;
    if (err instanceof Error && 'status' in err) {
      return NextResponse.json(err, { status: (err as any).status });
    }

    logger.error('[Menus API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/menus/[id]', method: 'DELETE', menuId },
    });
    return handleMenuError(err, 'DELETE');
  }
}
