import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import type { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { fetchFallback } from './fetch/fetchFallback';
import { fetchWithJoin } from './fetch/fetchWithJoin';
import { ParLevelRecord } from './types';

/**
 * Fetch par levels with ingredient join, with fallback to separate queries.
 *
 * @param supabaseAdmin - Supabase admin client
 * @returns Par levels data and error if any
 */
export async function fetchParLevels(supabaseAdmin: SupabaseClient) {
  // Try to fetch par levels with ingredient join
  // If join fails, fall back to fetching ingredients separately
  let { data, error } = await fetchWithJoin(supabaseAdmin);

  // If join fails, try without join first to see if table exists
  if (error) {
    const errorCode = error.code;
    const errorMessage = error.message || '';

    // If it's a relationship/join error, try fetching without join
    if (
      errorMessage.includes('relation') ||
      errorMessage.includes('foreign key') ||
      errorMessage.includes('does not exist')
    ) {
       return await fetchFallback(supabaseAdmin, error);
    }
  } else {
    // Success with join, order the results
    if (data) {
      data = data.sort((a: ParLevelRecord, b: ParLevelRecord) => {
        const aTime = new Date(a.created_at || 0).getTime();
        const bTime = new Date(b.created_at || 0).getTime();
        return bTime - aTime;
      });
    }
  }

  if (error) {
    logger.error('[Par Levels API] Database error fetching par levels:', {
      error: error.message,
      code: error.code,
      details: error,
      context: { endpoint: '/api/par-levels', operation: 'GET', table: 'par_levels' },
    });

    // If it's a foreign key relationship error, provide helpful message
    if (error.message.includes('foreign key') || error.message.includes('relation')) {
      return {
        data: null,
        error: NextResponse.json(
          ApiErrorHandler.createError(
            'Database relationship error. Please ensure par_levels table has proper foreign key to ingredients.',
            'DATABASE_ERROR',
            500,
            {
              error: error.message,
              instructions: [
                'The par_levels table may be missing the foreign key relationship to ingredients.',
                'Please verify the table structure in Supabase.',
              ],
            },
          ),
          { status: 500 },
        ),
      };
    }

    const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
    return {
      data: null,
      error: NextResponse.json(apiError, { status: apiError.status || 500 }),
    };
  }

  return { data: data || [], error: null };
}
