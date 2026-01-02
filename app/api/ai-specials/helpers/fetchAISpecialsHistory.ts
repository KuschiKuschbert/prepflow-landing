import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * Fetches AI specials history for a user.
 *
 * @param {string} userId - The user ID.
 * @param {string} [requestId] - Optional request ID for tracing.
 * @returns {Promise<{ data: any[] } | NextResponse>} History data or error response.
 */
export async function fetchAISpecialsHistory(
  userId: string,
  requestId?: string,
): Promise<{ data: any[] } | NextResponse> {
  const startTime = Date.now();
  logger.info('[fetchAISpecialsHistory] Function called', { userId, requestId });

  try {
    logger.debug('[fetchAISpecialsHistory] Attempting dynamic import of supabase', {
      userId,
      requestId,
    });

    const importStartTime = Date.now();
    const { supabaseAdmin } = await import('@/lib/supabase');
    const importDuration = Date.now() - importStartTime;

    logger.info('[fetchAISpecialsHistory] Supabase module loaded successfully', {
      userId,
      requestId,
      hasSupabaseAdmin: !!supabaseAdmin,
      importDuration: `${importDuration}ms`,
    });

    if (!supabaseAdmin) {
      logger.error('[fetchAISpecialsHistory] supabaseAdmin is null/undefined', {
        userId,
        requestId,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    logger.debug('[fetchAISpecialsHistory] Executing database query', {
      userId,
      requestId,
      table: 'ai_specials_ingredients',
    });

    const queryStartTime = Date.now();
    const { data, error } = await supabaseAdmin
      .from('ai_specials_ingredients')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    const queryDuration = Date.now() - queryStartTime;

    const totalDuration = Date.now() - startTime;
    logger.info('[fetchAISpecialsHistory] Database query completed', {
      userId,
      requestId,
      duration: `${totalDuration}ms`,
      queryDuration: `${queryDuration}ms`,
      hasError: !!error,
      dataCount: data?.length || 0,
      errorMessage: error?.message,
      errorCode: (error as any)?.code,
      errorDetails: error ? (error as any) : undefined,
    });

    if (error) {
      logger.error('[fetchAISpecialsHistory] Database error fetching:', {
        userId,
        requestId,
        error: error.message,
        code: (error as any).code,
        details: error as any,
        context: { endpoint: '/api/ai-specials', operation: 'GET', userId },
      });
      return NextResponse.json(
        ApiErrorHandler.createError("Couldn't retrieve AI analysis data", 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    logger.info('[fetchAISpecialsHistory] Successfully fetched AI specials history', {
      userId,
      requestId,
      dataCount: data?.length || 0,
      totalDuration: `${totalDuration}ms`,
    });

    return { data: data || [] };
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    logger.error('[fetchAISpecialsHistory] Error in catch block', {
      userId,
      requestId,
      duration: `${totalDuration}ms`,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      errorType: error?.constructor?.name,
      isNextResponse: error instanceof NextResponse,
      context: { endpoint: '/api/ai-specials', operation: 'GET', userId },
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to fetch AI specials history', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
