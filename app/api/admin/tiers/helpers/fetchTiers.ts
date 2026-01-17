import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
/**
 * Fetches all tier configurations from the database.
 *
 * @returns {Promise<{ tiers: Record<string, unknown>[] } | NextResponse>} Tiers data or error response.
 */
export async function fetchTiers(): Promise<{ tiers: Record<string, unknown>[] } | NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database not available', 'DATABASE_ERROR', 503),
      { status: 503 },
    );
  }

  const { data, error } = await supabaseAdmin
    .from('tier_configurations')
    .select('*')
    .order('display_order');

  if (error) {
    logger.error('[Admin Tiers] Failed to fetch tiers:', error);
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to fetch tiers', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }

  return { tiers: data || [] };
}
