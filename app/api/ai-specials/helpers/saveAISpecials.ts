import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { NextResponse } from 'next/server';

/**
 * Saves AI specials analysis to the database.
 *
 * @param {string} userId - The user ID.
 * @param {string} imageData - The image data.
 * @param {string} [prompt] - Optional prompt.
 * @param {any} aiResponse - The AI response data.
 * @returns {Promise<{ aiRecord: any } | NextResponse>} Saved record or error response.
 */
export async function saveAISpecials(
  userId: string,
  imageData: string,
  prompt: string | undefined,
  aiResponse: any,
): Promise<{ aiRecord: any } | NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

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

  if (aiError) {
    logger.error('[AI Specials API] Database error saving:', {
      error: aiError.message,
      code: (aiError as any).code,
      context: { endpoint: '/api/ai-specials', operation: 'POST', userId },
    });
    return NextResponse.json(
      ApiErrorHandler.createError("Couldn't save AI processing results", 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  return { aiRecord };
}
