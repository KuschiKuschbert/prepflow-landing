import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
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
  aiResponse: unknown,
  requestId?: string,
): Promise<{ aiRecord: unknown } | NextResponse> {
  const startTime = Date.now();
  logger.info('[saveAISpecials] Function called', {
    userId,
    requestId,
    hasImageData: !!imageData,
    hasPrompt: !!prompt,
    hasAiResponse: !!aiResponse,
  });

  try {
    // Validate environment variables before attempting import
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      logger.error('[saveAISpecials] Missing Supabase environment variables', {
        userId,
        requestId,
        hasSupabaseUrl: !!supabaseUrl,
        hasServiceRoleKey: !!serviceRoleKey,
      });
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Database configuration error. Please check environment variables.',
          'CONFIGURATION_ERROR',
          500,
        ),
        { status: 500 },
      );
    }

    logger.debug(
      '[saveAISpecials] Environment variables validated, attempting dynamic import of supabase',
      {
        userId,
        requestId,
        hasSupabaseUrl: true,
        hasServiceRoleKey: true,
      },
    );

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
      table: 'ai_specials',
    });

    const insertStartTime = Date.now();
    // Insert into ai_specials table (main table for AI specials records)
    // Map the data to match the ai_specials schema:
    // - image_data -> image_url (store as base64 data URL or save to storage)
    // - prompt -> ai_prompt
    // - ai_response -> store as JSON in description or create separate column
    // - status -> status
    // Note: If user_id column doesn't exist, we need to add it to the schema
    const { data: aiRecord, error: aiError } = await supabaseAdmin
      .from('ai_specials')
      .insert({
        user_id: userId,
        name: (aiResponse as { suggestions?: string[] })?.suggestions?.[0] || 'AI Generated Special',
        description: JSON.stringify(aiResponse), // Store full AI response as JSON
        image_url: imageData, // Store base64 image data URL
        ai_prompt: prompt || '',
        status: 'generated',
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
      errorCode: aiError?.code,
      errorDetails: aiError || undefined,
    });

    if (aiError) {
      logger.error('[saveAISpecials] Database error saving:', {
        userId,
        requestId,
        error: aiError.message,
        code: aiError.code,
        details: aiError,
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
