import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
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
      {
        error: 'Database connection not available',
      },
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
      {
        error: 'Failed to save AI analysis',
        message: 'Could not save AI processing results',
      },
      { status: 500 },
    );
  }

  return { aiRecord };
}
