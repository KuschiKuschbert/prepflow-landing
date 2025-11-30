/**
 * Gemini client wrapper
 *
 * Provides a singleton Gemini client instance with proper configuration
 * and auto model selection based on task type
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

import { logger } from '@/lib/logger';

let geminiClient: GoogleGenerativeAI | null = null;

export type TaskType = 'text' | 'vision' | 'complex';

/**
 * Get Gemini client instance (singleton)
 */
export function getGeminiClient(): GoogleGenerativeAI | null {
  // Return null if AI is disabled or API key is missing
  if (process.env.AI_ENABLED === 'false') {
    return null;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    logger.warn('⚠️ Gemini API key not found. AI features will be disabled.');
    return null;
  }

  // Return existing client if already initialized
  if (geminiClient) {
    return geminiClient;
  }

  // Create new client
  try {
    geminiClient = new GoogleGenerativeAI(apiKey);
    return geminiClient;
  } catch (error) {
    logger.error('❌ Failed to initialize Gemini client:', error);
    return null;
  }
}

/**
 * Check if AI is enabled
 */
export function isAIEnabled(): boolean {
  return (
    process.env.AI_ENABLED !== 'false' && !!process.env.GEMINI_API_KEY && getGeminiClient() !== null
  );
}

/**
 * Get default model (cost-effective option)
 */
export function getDefaultModel(): string {
  return process.env.GEMINI_MODEL || 'gemini-2.5-flash';
}

/**
 * Get model for specific task type (auto-selection)
 *
 * - text: gemini-2.5-flash (fast, cost-effective for recipes, descriptions, instructions)
 * - vision: gemini-2.5-flash (supports vision capabilities for image analysis, free tier)
 * - complex: gemini-2.5-flash (suitable for performance insights, detailed analysis, free tier)
 *
 * All tasks use gemini-2.5-flash to stay within free tier limits.
 */
export function getModelForTask(taskType: TaskType): string {
  // Allow override via environment variable
  if (process.env.GEMINI_MODEL) {
    return process.env.GEMINI_MODEL;
  }

  switch (taskType) {
    case 'vision':
      return process.env.GEMINI_VISION_MODEL || 'gemini-2.5-flash';
    case 'complex':
      return process.env.GEMINI_COMPLEX_MODEL || 'gemini-2.5-flash';
    case 'text':
    default:
      return process.env.GEMINI_TEXT_MODEL || 'gemini-2.5-flash';
  }
}
