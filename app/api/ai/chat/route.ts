/**
 * AI Chat API Endpoint
 *
 * Handles AI chat requests from the frontend
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai/ai-service';
import type { AIChatMessage, AIRequestOptions } from '@/lib/ai/types';

import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { parseAndValidate } from '@/lib/api/parse-request-body';
import { z } from 'zod';

const aiChatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string(),
      }),
    )
    .min(1, 'At least one message is required'),
  countryCode: z.string().optional().default('AU'),
  options: z
    .object({
      temperature: z.number().min(0).max(2).optional(),
      maxTokens: z.number().int().positive().optional(),
    })
    .optional(),
});

/**
 * POST /api/ai/chat
 * Generate AI chat response
 *
 * @param {NextRequest} request - Request object
 * @param {Object} request.body - Request body
 * @param {AIChatMessage[]} request.body.messages - Chat messages
 * @param {string} [request.body.countryCode] - Country code (default: 'AU')
 * @param {AIRequestOptions} [request.body.options] - AI request options
 * @returns {Promise<NextResponse>} AI response
 */
export async function POST(request: NextRequest) {
  try {
    const parsed = await parseAndValidate(request, aiChatSchema, '[AI Chat API]');
    if (!parsed.ok) return parsed.response;

    const { messages, countryCode, options } = parsed.data;
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
