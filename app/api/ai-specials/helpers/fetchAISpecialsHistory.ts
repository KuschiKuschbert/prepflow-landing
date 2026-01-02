import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * Fetches AI specials history for a user.
 *
 * @param {string} userId - The user ID.
 * @returns {Promise<{ data: any[] } | NextResponse>} History data or error response.
 */
export async function fetchAISpecialsHistory(
  userId: string,
): Promise<{ data: any[] } | NextResponse> {
  try {
    // Dynamic import to handle module load failures gracefully
    const { supabaseAdmin } = await import('@/lib/supabase');

    if (!supabaseAdmin) {
      logger.error('[AI Specials API] Database connection not available');
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
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
        ApiErrorHandler.createError("Couldn't retrieve AI analysis data", 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    return { data: data || [] };
  } catch (error) {
    // Handle module load failures or other unexpected errors
    logger.error('[AI Specials API] Error in fetchAISpecialsHistory:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context: { endpoint: '/api/ai-specials', operation: 'GET', userId },
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to fetch AI specials history', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
