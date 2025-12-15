import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

/**
 * Fetches AI specials history for a user.
 *
 * @param {string} userId - The user ID.
 * @returns {Promise<{ data: any[] } | NextResponse>} History data or error response.
 */
export async function fetchAISpecialsHistory(
  userId: string,
): Promise<{ data: any[] } | NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      {
        error: 'Database connection not available',
      },
      { status: 500 },
    );
  }

  const { data, error } = await supabaseAdmin
    .from('ai_specials_ingredients')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    logger.error('[AI Specials API] Database error fetching:', {
      error: error.message,
      code: (error as any).code,
      context: { endpoint: '/api/ai-specials', operation: 'GET', userId },
    });
    return NextResponse.json(
      {
        error: 'Failed to fetch AI specials',
        message: "couldn't retrieve AI analysis data",
      },
      { status: 500 },
    );
  }

  return { data: data || [] };
}
