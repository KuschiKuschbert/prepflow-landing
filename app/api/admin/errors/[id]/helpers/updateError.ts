import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import type { AdminUser } from '@/lib/admin-auth';

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
 * @returns {Promise<{ errorLog: any } | NextResponse>} Updated error log data or error response.
 */
export async function updateError(
  errorId: string,
  updates: z.infer<typeof updateErrorSchema>,
  adminUser: AdminUser,
): Promise<{ errorLog: any } | NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  // Build update object
  const updateData: Record<string, unknown> = {};
  if (updates.status) {
    updateData.status = updates.status;
    // Set resolved_at if status is resolved
    if (updates.status === 'resolved') {
      updateData.resolved_at = new Date().toISOString();
      // Try to get admin user_id from email
      try {
        const { data: adminData } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', adminUser.email)
          .single();
        if (adminData) {
          updateData.resolved_by = adminData.id;
        }
      } catch (err) {
        // Continue without resolved_by if admin not found
      }
    }
  }
  if (updates.notes !== undefined) {
    updateData.notes = updates.notes;
  }

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

export { updateErrorSchema };
