import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const updateUserSchema = z.object({
  first_name: z.string().max(100).optional().nullable(),
  last_name: z.string().max(100).optional().nullable(),
  business_name: z.string().max(255).optional().nullable(),
  subscription_status: z.enum(['trial', 'active', 'cancelled', 'past_due']).optional(),
  subscription_expires: z.string().datetime().optional().nullable(),
});

/**
 * Validates and updates a user in the database.
 *
 * @param {string} userId - The ID of the user to update.
 * @param {any} body - The request body containing update data.
 * @returns {Promise<{ user: any } | NextResponse>} Updated user data or error response.
 */
export async function updateUser(
  userId: string,
  body: unknown,
): Promise<{ user: unknown; validated: z.infer<typeof updateUserSchema> } | NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  const validated = updateUserSchema.parse(body);

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .update({
      ...validated,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    logger.error('[Admin User API] Database error updating user:', {
      error: error.message,
      context: { endpoint: `/api/admin/users/${userId}`, method: 'PUT' },
    });

    return NextResponse.json(ApiErrorHandler.fromSupabaseError(error, 500), { status: 500 });
  }

  return { user, validated };
}

export { updateUserSchema };
