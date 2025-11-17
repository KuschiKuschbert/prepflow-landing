/**
 * AI Chat API Endpoint
 *
 * Handles AI chat requests from the frontend
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai/ai-service';
import type { AIChatMessage, AIRequestOptions } from '@/lib/ai/types';

import { logger } from '../../lib/logger';
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, countryCode, options } = body as {
      messages: AIChatMessage[];
      countryCode?: string;
      options?: AIRequestOptions;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const finalCountryCode = countryCode || 'AU';
    const response = await generateAIResponse(messages, finalCountryCode, options);

    return NextResponse.json(response);
  } catch (error) {
    logger.error('AI chat error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate AI response',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
