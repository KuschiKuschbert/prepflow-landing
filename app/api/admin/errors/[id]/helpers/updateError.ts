import { type AdminUser, resolveAdminUserId } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const updateErrorSchema = z.object({
  status: z.enum(['new', 'investigating', 'resolved', 'ignored']).optional(),
  notes: z.string().optional(),
});

/**
 * Updates an error log in the database.
 *
 * @param {string} errorId - The ID of the error log to update.
 * @param {z.infer<typeof updateErrorSchema>} updates - Validated update data.
 * @param {AdminUser} adminUser - The admin user making the update.
 * @returns {Promise<{ errorLog: Record<string, unknown> } | NextResponse>} Updated error log data or error response.
 */
export async function updateError(
  errorId: string,
  updates: z.infer<typeof updateErrorSchema>,
  adminUser: AdminUser,
): Promise<{ errorLog: Record<string, unknown> } | NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  // Build update object
  const updateData = await buildErrorUpdateData(updates, adminUser);

  const { data: errorLog, error: dbError } = await supabaseAdmin
    .from('admin_error_logs')
    .update(updateData)
    .eq('id', errorId)
    .select()
    .single();

  if (dbError) {
    if (dbError.code === 'PGRST116') {
      return NextResponse.json(
        ApiErrorHandler.createError('Error log not found', 'NOT_FOUND', 404),
        {
          status: 404,
        },
      );
    }

    logger.error('[Admin Errors API] Database error:', {
      error: dbError.message,
      context: { endpoint: `/api/admin/errors/${errorId}`, method: 'PUT' },
    });

    return NextResponse.json(ApiErrorHandler.fromSupabaseError(dbError, 500), { status: 500 });
  }

  return { errorLog };
}

async function buildErrorUpdateData(
  updates: z.infer<typeof updateErrorSchema>,
  adminUser: AdminUser,
): Promise<Record<string, unknown>> {
  const updateData: Record<string, unknown> = {};

  if (updates.status) {
    updateData.status = updates.status;
    if (updates.status === 'resolved') {
       Object.assign(updateData, await getResolutionUpdateData(adminUser));
    }
  }

  if (updates.notes !== undefined) {
    updateData.notes = updates.notes;
  }

  return updateData;
}

async function getResolutionUpdateData(adminUser: AdminUser) {
    const data: Record<string, unknown> = {
        resolved_at: new Date().toISOString()
    };
    if (supabaseAdmin) {
        const adminId = await resolveAdminUserId(adminUser.email, supabaseAdmin, logger);
        if (adminId) {
          data.resolved_by = adminId;
        }
    }
    return data;
}

export { updateErrorSchema };
