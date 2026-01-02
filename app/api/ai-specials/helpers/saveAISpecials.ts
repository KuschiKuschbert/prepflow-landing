import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { NextResponse } from 'next/server';

/**
 * Saves AI specials analysis to the database.
 *
 * @param {string} userId - The user ID.
 * @param {string} imageData - The image data.
 * @param {string} [prompt] - Optional prompt.
 * @param {any} aiResponse - The AI response data.
 * @param {string} [requestId] - Optional request ID for tracing.
 * @returns {Promise<{ aiRecord: any } | NextResponse>} Saved record or error response.
 */
export async function saveAISpecials(
  userId: string,
  imageData: string,
  prompt: string | undefined,
  aiResponse: any,
  requestId?: string,
): Promise<{ aiRecord: any } | NextResponse> {
  const startTime = Date.now();
  logger.info('[saveAISpecials] Function called', {
    userId,
    requestId,
    hasImageData: !!imageData,
    hasPrompt: !!prompt,
    hasAiResponse: !!aiResponse,
  });

  try {
    logger.debug('[saveAISpecials] Attempting dynamic import of supabase', {
      userId,
      requestId,
    });

    const importStartTime = Date.now();
    const { supabaseAdmin } = await import('@/lib/supabase');
    const importDuration = Date.now() - importStartTime;

    logger.info('[saveAISpecials] Supabase module loaded successfully', {
      userId,
      requestId,
      hasSupabaseAdmin: !!supabaseAdmin,
      importDuration: `${importDuration}ms`,
    });

    if (!supabaseAdmin) {
      logger.error('[saveAISpecials] supabaseAdmin is null/undefined', {
        userId,
        requestId,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    logger.debug('[saveAISpecials] Executing database insert', {
      userId,
      requestId,
      table: 'ai_specials_ingredients',
    });

    const insertStartTime = Date.now();
    const { data: aiRecord, error: aiError } = await supabaseAdmin
      .from('ai_specials_ingredients')
      .insert({
        user_id: userId,
        image_data: imageData,
        prompt: prompt,
        ai_response: aiResponse,
        status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    const insertDuration = Date.now() - insertStartTime;

    const totalDuration = Date.now() - startTime;
    logger.info('[saveAISpecials] Database insert completed', {
      userId,
      requestId,
      duration: `${totalDuration}ms`,
      insertDuration: `${insertDuration}ms`,
      hasError: !!aiError,
      hasRecord: !!aiRecord,
      recordId: aiRecord?.id,
      errorMessage: aiError?.message,
      errorCode: (aiError as any)?.code,
      errorDetails: aiError ? (aiError as any) : undefined,
    });

    if (aiError) {
      logger.error('[saveAISpecials] Database error saving:', {
        userId,
        requestId,
        error: aiError.message,
        code: (aiError as any).code,
        details: aiError as any,
        context: { endpoint: '/api/ai-specials', operation: 'POST', userId },
      });
      return NextResponse.json(
        ApiErrorHandler.createError("Couldn't save AI processing results", 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    logger.info('[saveAISpecials] Successfully saved AI specials', {
      userId,
      requestId,
      recordId: aiRecord?.id,
      totalDuration: `${totalDuration}ms`,
    });

    return { aiRecord };
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    logger.error('[saveAISpecials] Error in catch block', {
      userId,
      requestId,
      duration: `${totalDuration}ms`,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      errorType: error?.constructor?.name,
      isNextResponse: error instanceof NextResponse,
      context: { endpoint: '/api/ai-specials', operation: 'POST', userId },
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to save AI specials', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
