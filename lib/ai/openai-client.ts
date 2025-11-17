/**
 * OpenAI client wrapper
 *
 * Provides a singleton OpenAI client instance with proper configuration
 */

import OpenAI from 'openai';

import { logger } from '@/lib/logger';

let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI | null {
  // Return null if AI is disabled or API key is missing
  if (process.env.AI_ENABLED === 'false') {
    return null;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    logger.warn('⚠️ OpenAI API key not found. AI features will be disabled.');
    return null;
  }

  // Return existing client if already initialized
  if (openaiClient) {
    return openaiClient;
  }

  // Create new client
  try {
    openaiClient = new OpenAI({
      apiKey: apiKey,
    });
    return openaiClient;
  } catch (error) {
    logger.error('❌ Failed to initialize OpenAI client:', error);
    return null;
  }
}

export function isAIEnabled(): boolean {
  return (
    process.env.AI_ENABLED !== 'false' && !!process.env.OPENAI_API_KEY && getOpenAIClient() !== null
  );
}

export function getDefaultModel(): string {
  return process.env.OPENAI_MODEL || 'gpt-4o-mini';
}
