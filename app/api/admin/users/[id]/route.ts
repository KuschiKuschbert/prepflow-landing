import { requireAdmin } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logAdminApiAction } from '@/lib/admin-audit';
import { checkAdminRateLimit } from '@/lib/admin-rate-limit';
import { NextRequest, NextResponse } from 'next/server';
import { fetchUser } from './helpers/fetchUser';
import { updateUser } from './helpers/updateUser';
import { deleteUser } from './helpers/deleteUser';
import { handleUserApiError } from './helpers/handleError';

/**
 * GET /api/admin/users/[id]
 * Get user details
 */
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;

    const result = await fetchUser(id);
    if (result instanceof NextResponse) return result;

    return NextResponse.json({
      success: true,
      user: result.user,
    });
  } catch (error) {
    return handleUserApiError(error, 'GET');
  }
}

/**
 * PUT /api/admin/users/[id]
 * Update user
 */
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const adminUser = await requireAdmin(request);

    // Rate limiting
    if (!checkAdminRateLimit(adminUser.id, false)) {
      return NextResponse.json(
        ApiErrorHandler.createError('Rate limit exceeded', 'RATE_LIMIT_EXCEEDED', 429),
        { status: 429 },
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    const result = await updateUser(id, body);
    if (result instanceof NextResponse) return result;

    // Log admin action
    await logAdminApiAction(adminUser, 'update_user', request, {
      target_type: 'user',
      target_id: id,
      details: { changes: result.validated },
    });

    return NextResponse.json({
      success: true,
      user: result.user,
    });
  } catch (error) {
    return handleUserApiError(error, 'PUT');
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Delete user
 */
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const adminUser = await requireAdmin(request);

    // Stricter rate limiting for critical operations
    if (!checkAdminRateLimit(adminUser.id, true)) {
      return NextResponse.json(
        ApiErrorHandler.createError('Rate limit exceeded', 'RATE_LIMIT_EXCEEDED', 429),
        { status: 429 },
      );
    }

    const { id } = await context.params;

    const result = await deleteUser(id);
    if (result instanceof NextResponse) return result;

    // Log admin action
    await logAdminApiAction(adminUser, 'delete_user', request, {
      target_type: 'user',
      target_id: id,
      details: {},
    });

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    return handleUserApiError(error, 'DELETE');
  }
}
