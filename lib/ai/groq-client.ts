/**
 * Groq API Client
 *
 * Fastest free AI option for recipe processing (sub-second responses, 500+ tokens/sec)
 * Uses OpenAI-compatible API format via Groq Cloud
 *
 * STRICT COST GUARDS:
 * - Only used if USE_GROQ=true AND GROQ_API_KEY is set
 * - Fails immediately if API key missing (no silent fallback)
 * - Ollama fallback available for completely free operation
 *
 * Setup:
 * 1. Get free API key: https://console.groq.com/
 * 2. Set USE_GROQ=true in environment variables
 * 3. Set GROQ_API_KEY=your-api-key-here
 * 4. Set spending limits in Groq Console (Settings → Billing → Limits)
 *
 * See: docs/GROQ_SETUP_GUIDE.md
 */

import { logger } from '@/lib/logger';
import { parseAIError } from './utils/errorParser';

const GROQ_API_BASE = 'https://api.groq.com/openai/v1';
const DEFAULT_TIMEOUT = 30000; // 30 seconds (Groq is fast, shouldn't need 90s like Ollama)
const DEFAULT_MAX_TOKENS = 8192; // Max tokens for recipe formatting
const DEFAULT_MODEL = 'llama-3.1-8b-instant'; // Fastest free model (sub-second responses)

/**
 * Get Groq API key from environment variables
 */
function getGroqApiKey(): string | null {
  return process.env.GROQ_API_KEY || null;
}

/**
 * Check if Groq should be used (strict cost guard)
 * Requires USE_GROQ=true AND GROQ_API_KEY to be set
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
 * Makes a minimal health check request to verify API connectivity
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
    // Minimal health check (uses minimal tokens)
    const response = await fetch(`${GROQ_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 1,
      }),
      signal: AbortSignal.timeout(5000), // 5 second timeout for health check
    });

    return response.ok || response.status === 429; // 429 = rate limited but API works
  } catch (error) {
    logger.warn('[Groq Client] Health check failed:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

/**
 * Generate text with Groq API (OpenAI-compatible format)
 *
 * STRICT COST GUARDS:
 * - Fails immediately if USE_GROQ=true but API key missing
 * - Uses structured JSON output mode for recipe formatting
 * - 30 second timeout (fast responses expected)
 *
 * @param prompt - Full prompt (system + user combined for simplicity)
 * @param options - Generation options
 * @returns Generated text response
 */
export async function generateTextWithGroq(
  prompt: string,
  options: {
    model?: string;
    timeout?: number;
    temperature?: number;
    maxTokens?: number;
    responseFormat?: 'text' | 'json_object';
  } = {},
): Promise<{ response: string }> {
  // STRICT COST GUARD: Fail if enabled but API key missing
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

  const model = options.model || DEFAULT_MODEL;
  const timeout = options.timeout || DEFAULT_TIMEOUT;
  const temperature = options.temperature ?? 0.3; // Low temperature for deterministic JSON output
  const maxTokens = options.maxTokens || DEFAULT_MAX_TOKENS;
  const responseFormat = options.responseFormat || 'json_object'; // Default to JSON for recipe formatting

  try {
    logger.dev('[Groq] Generating text with model:', {
      model,
      promptLength: prompt.length,
      timeout,
      temperature,
      maxTokens,
      responseFormat,
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Groq API uses OpenAI-compatible format
    // Reference: https://console.groq.com/docs/openai
    const response = await fetch(`${GROQ_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content:
              'You are a precise recipe formatter. Always respond with valid JSON only, no markdown, no explanations. Follow all conversion rules strictly.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature,
        max_tokens: maxTokens,
        response_format: responseFormat === 'json_object' ? { type: 'json_object' } : undefined,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      let errorJson: any = null;
      try {
        errorJson = JSON.parse(errorText);
      } catch {
        // Not JSON, use as text
      }

      const errorMessage = errorJson?.error?.message || errorText || `HTTP ${response.status}`;
      const error = new Error(`Groq API error: ${errorMessage}`);

      // Parse error for better error handling
      const parsedError = parseAIError(error);

      // Handle rate limiting (429) - Groq has generous free tier but may rate limit
      if (response.status === 429) {
        logger.warn('[Groq] Rate limited - consider using Ollama fallback or waiting');
        throw parsedError.details || error;
      }

      // Handle quota/billing errors
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

    const result = await response.json();

    // OpenAI-compatible format: { choices: [{ message: { content: "..." } }] }
    let content = '';
    if (result.choices && Array.isArray(result.choices) && result.choices.length > 0) {
      content = result.choices[0].message?.content || '';
    } else if (result.content) {
      content = result.content;
    }

    if (!content) {
      throw new Error('Empty response from Groq API');
    }

    // Log usage if available (for cost monitoring)
    if (result.usage) {
      logger.dev('[Groq] Token usage:', {
        promptTokens: result.usage.prompt_tokens || 0,
        completionTokens: result.usage.completion_tokens || 0,
        totalTokens: result.usage.total_tokens || 0,
      });

      // Warn if approaching typical free tier limits (adjust based on actual limits)
      const totalTokens = result.usage.total_tokens || 0;
      if (totalTokens > 100000) {
        logger.warn(
          '[Groq] High token usage detected. Monitor usage at https://console.groq.com/ ' +
            'Consider setting spending limits in Groq Console (Settings → Billing → Limits)',
        );
      }
    }

    logger.dev('[Groq] Text generated successfully:', {
      contentLength: content.length,
      model,
    });

    return { response: content };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(
        `Groq request timed out after ${timeout}ms. Groq is typically very fast (sub-second). ` +
          'If timeouts persist, check network connectivity or use Ollama fallback (USE_GROQ=false).',
      );
    }

    // Re-throw parsed errors
    if (error instanceof Error) {
      const parsedError = parseAIError(error);
      if (parsedError.type !== 'UNKNOWN') {
        throw parsedError.details || error;
      }
    }

    logger.error('[Groq] Error generating text:', {
      error: error instanceof Error ? error.message : String(error),
      model,
      timeout,
    });

    throw error;
  }
}
