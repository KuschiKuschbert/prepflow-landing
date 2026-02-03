import { ApiErrorHandler } from '@/lib/api-error-handler';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest } from 'next/server';

/**
 * Retrieves the authenticated Supabase user ID for the current request.
 * It first verifies the Auth0 token, then resolves the user in Supabase Auth.
 *
 * Strategy:
 * 1. Verify Auth0 token to get email.
 * 2. Check if user exists in Supabase Auth (auth.users) via Admin API.
 * 3. If yes, return ID.
 * 4. If no, create the user in Supabase Auth (JIT provisioning) and return ID.
 *
 * @param request NextRequest
 * @returns Object containing userId and supabaseAdmin client
 */
export async function getAuthenticatedUser(request: NextRequest) {
  const supabaseAdmin = createSupabaseAdmin();

  // 1. Verify Auth0 Token
  let authUser;
  try {
    authUser = await requireAuth(request);
  } catch (err) {
    // If requireAuth throws a response (401/403), we assume caller handles it or we rethrow
    throw err;
  }

  const email = authUser.email;
  if (!email) {
    throw ApiErrorHandler.createError('User email not found in token', 'UNAUTHORIZED', 401);
  }

  // 2. Resolve Supabase User ID
  // Optimisation: We could check a public.users table here if we had one synced.
  // For now, we query auth.users directly via verify/create pattern.

  // Attempt to list users to find by email
  // Note: listUsers is paginated. For large user bases, this is inefficient.
  // A better approach is to use a synced public.users table.
  const {
    data: { users },
    error: listError,
  } = await supabaseAdmin.auth.admin.listUsers({
    perPage: 1000, // Fetch up to 1000 users to be safe for now
  });

  if (listError) {
    logger.error('Error listing users from Supabase Auth:', listError);
    throw ApiErrorHandler.createError('Failed to resolve user identity', 'SERVER_ERROR', 500);
  }

  let user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());

  // 3. JIT Provisioning
  if (!user) {
    logger.info(`User ${email} not found in Supabase Auth. Provisioning...`);
    // Create user
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      email_confirm: true,
      user_metadata: {
        global_name: authUser.name,
        picture: authUser.picture,
        origin: 'auth0_jit',
      },
    });

    if (createError) {
      logger.error(`Failed to provision user ${email}:`, createError);
      throw ApiErrorHandler.createError('Failed to provision user', 'SERVER_ERROR', 500);
    }
    user = newUser.user;
  }

  if (!user) {
    // Should not happen if create succeeded
    throw ApiErrorHandler.createError('User resolution failed unexpected', 'SERVER_ERROR', 500);
  }

  return { userId: user.id, supabase: supabaseAdmin, authUser };
}
