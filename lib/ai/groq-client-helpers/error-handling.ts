/**
 * Error handling helpers for Groq API client
 */

import { logger } from '@/lib/logger';
import { parseAIError } from '../utils/errorParser';

/**
 * Handle Groq API error responses
 */
export function handleGroqError(response: Response, errorText: string): Error {
  let errorJson: unknown = null;
  try {
    errorJson = JSON.parse(errorText);
  } catch {
    // Not JSON, use as text
  }

  const errorObj = errorJson as { error?: { message?: string } } | null;
  const errorMessage = errorObj?.error?.message || errorText || `HTTP ${response.status}`;
  const error = new Error(`Groq API error: ${errorMessage}`);
  const parsedError = parseAIError(error);

  if (response.status === 429) {
    logger.warn('[Groq] Rate limited - consider using Ollama fallback or waiting');
    throw parsedError.details || error;
  }

  if (response.status === 402 || response.status === 403) {
    logger.error(
      '[Groq] Billing/quota error - check Groq Console: https://console.groq.com/ ' +
        'Consider using Ollama (free, local) by setting USE_GROQ=false',
    );
    throw parsedError.details || error;
  }

  logger.error('[Groq] API error:', {
    status: response.status,
    statusText: response.statusText,
    error: errorMessage.substring(0, 500),
  });

  throw parsedError.details || error;
}
