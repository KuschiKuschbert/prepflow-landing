import { generateAIVisionResponse } from '@/lib/ai/ai-service';
import { buildAISpecialsPrompt, parseAISpecialsResponse } from '@/lib/ai/prompts/ai-specials';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { handleAISpecialsError } from './helpers/handleAISpecialsError';
import { processImageWithAI } from './helpers/processImageWithAI';

/**
 * POST /api/ai-specials
 * Generate AI-powered specials suggestions from image analysis
 *
 * @param {NextRequest} request - Request object
 * @param {Object} request.body - Request body
 * @param {string} request.body.userId - User ID
 * @param {string} request.body.imageData - Image data (data URL or public URL)
 * @param {string} [request.body.prompt] - Optional prompt
 * @param {string} [request.body.countryCode] - Country code (default: 'AU')
 * @returns {Promise<NextResponse>} AI specials response
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, imageData, prompt, countryCode } = body;

    if (!userId || !imageData) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          message: 'User ID and image data are required',
        },
        { status: 400 },
      );
    }

    // Try AI Vision API first
    let aiResponse: {
      ingredients: string[];
      suggestions: string[];
      confidence: number;
      notes?: string;
      processing_time?: number;
    };

    try {
      const aiPrompt = buildAISpecialsPrompt(prompt);
      const visionResponse = await generateAIVisionResponse(
        imageData, // imageData should be a data URL or public URL
        aiPrompt,
        countryCode || 'AU',
        {
          temperature: 0.7,
          maxTokens: 1500,
          useCache: true,
          cacheTTL: 60 * 60 * 1000, // 1 hour cache
        },
      );

      if (visionResponse.content && !visionResponse.error) {
        const parsed = parseAISpecialsResponse(visionResponse.content);
        aiResponse = {
          ...parsed,
          processing_time: 0, // Will be calculated if needed
        };
      } else {
        // Fallback to mock
        aiResponse = await processImageWithAI(imageData, prompt);
      }
    } catch (aiError) {
      logger.warn('[AI Specials API] AI Vision API failed, using fallback:', {
        error: aiError instanceof Error ? aiError.message : String(aiError),
        context: { endpoint: '/api/ai-specials', operation: 'POST' },
      });
      // Fallback to mock
      aiResponse = await processImageWithAI(imageData, prompt);
    }

    // Save the AI analysis to database
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

    return NextResponse.json({
      success: true,
      message: 'AI specials generated successfully',
      data: {
        aiRecord,
        suggestions: aiResponse.suggestions,
        ingredients: aiResponse.ingredients,
      },
    });
  } catch (error) {
    return handleAISpecialsError(error, 'POST');
  }
}

/**
 * GET /api/ai-specials
 * Fetch AI specials history for a user
 *
 * @param {NextRequest} request - Request object
 * @param {string} request.url - Request URL with search params
 * @param {string} request.url.searchParams.userId - User ID query parameter
 * @returns {Promise<NextResponse>} AI specials history response
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        {
          error: 'User ID is required',
          message: 'Please provide a valid user ID',
        },
        { status: 400 },
      );
    }

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
          message: 'Could not retrieve AI analysis data',
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    return handleAISpecialsError(error, 'GET');
  }
}
