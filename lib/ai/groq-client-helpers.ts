/**
 * Helper functions for Groq API client
 */

import { logger } from '@/lib/logger';
import { parseAIError } from './utils/errorParser';
import { handleGroqError } from './groq-client-helpers/error-handling';
import { buildGroqRequest, GroqRequestOptions } from './groq-client-helpers/request-builder';
import { parseGroqResponse } from './groq-client-helpers/response-parser';

const DEFAULT_TIMEOUT = 30000;

/**
 * Get Groq API key from environment variables
 */
export function getGroqApiKey(): string | null {
  return process.env.GROQ_API_KEY || null;
}

/**
 * Check if Groq should be used (strict cost guard)
 */
export function isGroqEnabled(): boolean {
  const useGroq = process.env.USE_GROQ === 'true';
  const hasApiKey = !!getGroqApiKey();

  if (useGroq && !hasApiKey) {
    logger.error(
      '[Groq Client] USE_GROQ=true but GROQ_API_KEY is missing. ' +
        'Set GROQ_API_KEY in environment variables or set USE_GROQ=false to use Ollama (free, local).',
    );
    return false;
  }

  return useGroq && hasApiKey;
}

/**
 * Check if Groq API is available and healthy
 */
export async function isGroqAvailable(): Promise<boolean> {
  if (!isGroqEnabled()) {
    return false;
  }

  const apiKey = getGroqApiKey();
  if (!apiKey) {
    return false;
  }

  try {
    const { url, init } = buildGroqRequest('test', apiKey, { maxTokens: 1 });
    const response = await fetch(url, { ...init, signal: AbortSignal.timeout(5000) });
    return response.ok || response.status === 429;
  } catch (error) {
    logger.warn('[Groq Client] Health check failed:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

/**
 * Generate text with Groq API
 */
export async function generateTextWithGroq(
  prompt: string,
  options: GroqRequestOptions = {},
): Promise<{ response: string }> {
  if (!isGroqEnabled()) {
    const error = new Error(
      'GROQ_API_KEY is required when USE_GROQ=true. ' +
        'Set GROQ_API_KEY in environment variables or set USE_GROQ=false to use Ollama (free, local).',
    );
    logger.error('[Groq Client]', error.message);
    throw error;
  }

  const apiKey = getGroqApiKey();
  if (!apiKey) {
    const error = new Error('GROQ_API_KEY is not set');
    logger.error('[Groq Client]', error.message);
    throw error;
  }

  const timeout = options.timeout || DEFAULT_TIMEOUT;

  try {
    logger.dev('[Groq] Generating text with model:', {
      model: options.model || 'llama-3.1-8b-instant',
      promptLength: prompt.length,
      timeout,
      temperature: options.temperature ?? 0.3,
      maxTokens: options.maxTokens || 8192,
      responseFormat: options.responseFormat || 'json_object',
    });

    const { url, init, timeoutId } = buildGroqRequest(prompt, apiKey, options);
    const response = await fetch(url, init);
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      handleGroqError(response, errorText);
    }

    const result = await response.json();
    const content = parseGroqResponse(result);

    return { response: content };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(
        `Groq request timed out after ${timeout}ms. Groq is typically very fast (sub-second). ` +
          'If timeouts persist, check network connectivity or use Ollama fallback (USE_GROQ=false).',
      );
    }

    if (error instanceof Error) {
      const parsedError = parseAIError(error);
      if (parsedError.type !== 'UNKNOWN') {
        throw parsedError.details || error;
      }
    }

    logger.error('[Groq] Error generating text:', {
      error: error instanceof Error ? error.message : String(error),
      model: options.model || 'llama-3.1-8b-instant',
      timeout,
    });

    throw error;
  }
}
