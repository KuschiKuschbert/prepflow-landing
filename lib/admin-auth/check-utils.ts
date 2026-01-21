import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { checkAdminRateLimit } from '../admin-rate-limit';
import { ApiErrorHandler } from '../api-error-handler';
import { supabaseAdmin } from '../supabase';
import { requireAdmin } from './session';
import type { SupabaseAdmin } from './types';

/**
 * Helper to resolve admin user ID from email using Supabase Admin client.
 * Returns undefined if not found or error occurs (logs warning).
 */
export async function resolveAdminUserId(
  email: string,
  supabaseAdminClient: SupabaseAdmin,
  logger: { warn: (msg: string, meta?: unknown) => void },
): Promise<string | undefined> {
  try {
    const { data: adminData, error: adminDataError } = await supabaseAdminClient
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (adminDataError && adminDataError.code !== 'PGRST116') {
      logger.warn('[Admin Resolve] Error fetching admin user:', {
        error: adminDataError.message,
        code: adminDataError.code,
        adminEmail: email,
      });
    }

    if (adminData) {
      return adminData.id;
    }
  } catch (err) {
    logger.warn('[Admin Resolve] Error fetching admin user:', {
      error: err instanceof Error ? err.message : String(err),
      adminEmail: email,
    });
  }
  return undefined;
}

/**
 * Perform standard admin checks: Auth, Rate Limit, and DB Connection.
 * Use this at the start of critical admin API routes.
 */
export async function standardAdminChecks(request: NextRequest, isCritical = false) {
  try {
    const adminUser = await requireAdmin(request);

    // Rate limiting
    if (!checkAdminRateLimit(adminUser.id, isCritical)) {
      return {
        error: NextResponse.json(
          ApiErrorHandler.createError('Rate limit exceeded', 'RATE_LIMIT_EXCEEDED', 429),
          { status: 429 },
        ),
      };
    }

    // DB Connection
    if (!supabaseAdmin) {
      return {
        error: NextResponse.json(
          ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
          { status: 500 },
        ),
      };
    }

    return { adminUser, supabase: supabaseAdmin };
  } catch (error) {
    if (error instanceof NextResponse) {
      return { error };
    }
    throw error;
  }
}
