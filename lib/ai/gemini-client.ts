/**
 * Google Gemini API Client
 *
 * ⚠️ DISABLED / DEPRECATED - GEMINI REMOVED TO PREVENT EXPENSIVE API COSTS ⚠️
 *
 * This file is kept for reference only. All functions are disabled and will throw errors.
 * DO NOT USE GEMINI - It causes expensive API costs that can explode quickly.
 *
 * Use Ollama instead (free, local processing):
 * - Install: brew install ollama (or download from https://ollama.com)
 * - Start: ollama serve
 * - Pull model: ollama pull llama3.2:3b
 * - See: docs/OLLAMA_SETUP_GUIDE.md
 */

import { logger } from '@/lib/logger';

const DEFAULT_TIMEOUT = 60000; // 60 seconds (paid tier can handle longer requests)
const DEFAULT_MAX_OUTPUT_TOKENS = 8192; // Increased for complex recipes with long descriptions (paid tier supports up to 8192)

// Safety guard: Throw error if Gemini is used (prevents expensive costs)
const GEMINI_DISABLED_ERROR = new Error(
  'GEMINI IS DISABLED - Using only Ollama to prevent expensive API costs. ' +
    'DO NOT USE GEMINI. Install Ollama instead: brew install ollama && ollama serve && ollama pull llama3.2:3b',
);

/**
 * Check if Gemini API key is configured
 *
 * ⚠️ DISABLED - Always returns false to prevent usage
 */
export function isGeminiAvailable(): boolean {
  logger.warn(
    '[Gemini Client] isGeminiAvailable() called - GEMINI IS DISABLED. Use Ollama instead.',
  );
  return false; // Always return false to prevent usage
}

/**
 * Check Gemini API quota/health by making a minimal test request
 *
 * ⚠️ DISABLED - Throws error to prevent usage (prevents expensive costs)
 *
 * @param model - Model to check (DISABLED - throws error)
 * @returns Never returns (always throws)
 */
export async function checkGeminiQuota(model: string = 'gemini-1.5-flash'): Promise<{
  available: boolean;
  error?: string;
  quotaInfo?: string;
  suggestedModel?: string;
  isDailyLimit?: boolean;
}> {
  logger.error(
    '[Gemini Client] checkGeminiQuota() called - GEMINI IS DISABLED. Use Ollama instead.',
    { model },
  );
  throw GEMINI_DISABLED_ERROR;
  // All code below is unreachable - Gemini is completely disabled to prevent expensive costs
}

/**
 * Get Gemini API key from environment
 *
 * ⚠️ DISABLED - Always returns null to prevent usage
 */
function getGeminiApiKey(): string | null {
  logger.warn('[Gemini Client] getGeminiApiKey() called - GEMINI IS DISABLED. Use Ollama instead.');
  return null; // Always return null to prevent usage
}

/**
 * Generate text using Google Gemini API
 *
 * ⚠️ DISABLED - Throws error to prevent usage (prevents expensive costs)
 * DO NOT USE THIS FUNCTION - It will cause expensive API costs!
 *
 * Use Ollama instead (free, local):
 * - Install: brew install ollama
 * - Start: ollama serve
 * - Pull model: ollama pull llama3.2:3b
 * - See: docs/OLLAMA_SETUP_GUIDE.md
 *
 * @param prompt - Text prompt (DISABLED - throws error)
 * @param options - Generation options (DISABLED - throws error)
 * @returns Never returns (always throws)
 */
export async function generateTextWithGemini(
  prompt: string,
  options: {
    timeout?: number;
    maxOutputTokens?: number;
    model?: string;
  } = {},
): Promise<{ response: string }> {
  logger.error(
    '[Gemini Client] generateTextWithGemini() called - GEMINI IS DISABLED. Use Ollama instead.',
    {
      promptLength: prompt.length,
      model: options.model,
    },
  );
  throw GEMINI_DISABLED_ERROR;
  // All code below is unreachable - Gemini is completely disabled to prevent expensive costs
}
