import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

/**
 * Fetches all tier configurations from the database.
 *
 * @returns {Promise<{ tiers: any[] } | NextResponse>} Tiers data or error response.
 */
export async function fetchTiers(): Promise<{ tiers: any[] } | NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database not available' }, { status: 503 });
  }

  const { data, error } = await supabaseAdmin
    .from('tier_configurations')
    .select('*')
    .order('display_order');

  if (error) {
    logger.error('[Admin Tiers] Failed to fetch tiers:', error);
    return NextResponse.json({ error: 'Failed to fetch tiers' }, { status: 500 });
  }

  return { tiers: data || [] };
}
