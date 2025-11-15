/**
 * Centralized AI Service
 *
 * Provides unified interface for all AI operations with:
 * - Error handling and retries
 * - Rate limiting
 * - Cost tracking
 * - Caching
 * - Fallback mechanisms
 */

import { getOpenAIClient, isAIEnabled, getDefaultModel } from './openai-client';
import { buildKitchenContext } from './prompts/kitchen-context';
import { generateCacheKey, getCachedAIResponse, cacheAIResponse } from './cache/ai-cache';
import { checkRateLimit } from './utils/rate-limiter';
import { trackCost, storeCostTracking } from './utils/cost-tracker';
import type {
  AIRequestOptions,
  AIResponse,
  AIChatMessage,
  AIChatRequest,
  AIVisionRequest,
  AIError,
} from './types';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

/**
 * Generate AI response from chat messages
 */
export async function generateAIResponse(
  messages: AIChatMessage[],
  countryCode: string,
  options: AIRequestOptions = {},
): Promise<AIResponse<string>> {
  // Check if AI is enabled
  if (!isAIEnabled()) {
    return {
      content: '',
      error: 'AI is not enabled or API key is missing',
    };
  }

  // Check rate limiting (using a simple identifier - in production, use user ID or IP)
  const rateLimitId = 'global'; // TODO: Use user ID or IP address
  if (!checkRateLimit(rateLimitId)) {
    return {
      content: '',
      error: 'Rate limit exceeded. Please try again later.',
    };
  }

  // Check cache if enabled
  const useCache = options.useCache !== false;
  if (useCache) {
    const cacheKey = generateCacheKey('chat', { messages, countryCode, options });
    const cached = getCachedAIResponse(cacheKey);
    if (cached) {
      return {
        content: cached,
        cached: true,
      };
    }
  }

  // Build kitchen context and add to system message
  const kitchenContext = buildKitchenContext(countryCode);
  const systemMessage: AIChatMessage = {
    role: 'system',
    content: `You are a professional kitchen assistant for PrepFlow, a restaurant management system.

${kitchenContext}

Always provide responses that are:
- Professional and kitchen-focused
- Specific to the user's location and regulations
- Actionable and practical
- Using the correct currency, units, and formats for their country
- Compliant with local food safety standards`,
  };

  const messagesWithContext = [systemMessage, ...messages];

  const client = getOpenAIClient();
  if (!client) {
    return {
      content: '',
      error: 'AI client not available',
    };
  }

  const model = options.model || getDefaultModel();
  const temperature = options.temperature ?? 0.7;
  const maxTokens = options.maxTokens ?? 2000;

  let lastError: Error | null = null;

  // Retry logic
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model,
        messages: messagesWithContext.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature,
        max_tokens: maxTokens,
      });

      const content = response.choices[0]?.message?.content || '';
      const usage = response.usage
        ? {
            promptTokens: response.usage.prompt_tokens,
            completionTokens: response.usage.completion_tokens,
            totalTokens: response.usage.total_tokens,
          }
        : undefined;

      // Track cost
      if (usage) {
        const costTracking = trackCost(
          `req_${Date.now()}`,
          'chat',
          model,
          usage.promptTokens,
          usage.completionTokens,
        );
        storeCostTracking(costTracking);
      }

      // Cache response if enabled
      if (useCache && content) {
        const cacheKey = generateCacheKey('chat', { messages, countryCode, options });
        const ttl = options.cacheTTL || 60 * 60 * 1000; // 1 hour default
        cacheAIResponse(cacheKey, content, ttl);
      }

      return {
        content,
        usage,
      };
    } catch (error) {
      lastError = error as Error;
      const aiError = parseAIError(error as Error);

      // Don't retry on certain errors
      if (!aiError.retryable || attempt === MAX_RETRIES - 1) {
        return {
          content: '',
          error: aiError.message,
        };
      }

      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (attempt + 1)));
    }
  }

  return {
    content: '',
    error: lastError?.message || 'Unknown error occurred',
  };
}

/**
 * Generate AI response from vision (image analysis)
 */
export async function generateAIVisionResponse(
  imageUrl: string,
  prompt: string,
  countryCode: string,
  options: AIRequestOptions = {},
): Promise<AIResponse<string>> {
  if (!isAIEnabled()) {
    return {
      content: '',
      error: 'AI is not enabled or API key is missing',
    };
  }

  const client = getOpenAIClient();
  if (!client) {
    return {
      content: '',
      error: 'AI client not available',
    };
  }

  const kitchenContext = buildKitchenContext(countryCode);
  const fullPrompt = `${prompt}

${kitchenContext}

Analyze the image and provide recommendations specific to the user's location and regulations.`;

  const model = options.model || 'gpt-4o-vision';
  const temperature = options.temperature ?? 0.7;
  const maxTokens = options.maxTokens ?? 1000;

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: fullPrompt,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      temperature,
      max_tokens: maxTokens,
    });

    const content = response.choices[0]?.message?.content || '';
    const usage = response.usage
      ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens,
        }
      : undefined;

    // Track cost
    if (usage) {
      const costTracking = trackCost(
        `req_${Date.now()}`,
        'vision',
        model,
        usage.promptTokens,
        usage.completionTokens,
      );
      storeCostTracking(costTracking);
    }

    return {
      content,
      usage,
    };
  } catch (error) {
    const aiError = parseAIError(error as Error);
    return {
      content: '',
      error: aiError.message,
    };
  }
}

/**
 * Parse OpenAI error into AIError
 */
function parseAIError(error: Error): AIError {
  const message = error.message || 'Unknown error';
  const errorString = message.toLowerCase();

  if (errorString.includes('api key') || errorString.includes('authentication')) {
    return {
      type: 'API_KEY_MISSING',
      message: 'AI service authentication failed',
      details: error,
      retryable: false,
    };
  }

  if (errorString.includes('rate limit') || errorString.includes('429')) {
    return {
      type: 'RATE_LIMITED',
      message: 'AI service rate limit exceeded. Please try again later.',
      details: error,
      retryable: true,
    };
  }

  if (errorString.includes('timeout') || errorString.includes('timed out')) {
    return {
      type: 'TIMEOUT',
      message: 'AI request timed out. Please try again.',
      details: error,
      retryable: true,
    };
  }

  if (errorString.includes('network') || errorString.includes('fetch')) {
    return {
      type: 'NETWORK_ERROR',
      message: 'Network error. Please check your connection.',
      details: error,
      retryable: true,
    };
  }

  if (errorString.includes('invalid') || errorString.includes('400')) {
    return {
      type: 'INVALID_REQUEST',
      message: 'Invalid AI request. Please check your input.',
      details: error,
      retryable: false,
    };
  }

  return {
    type: 'UNKNOWN',
    message: 'An unexpected error occurred with the AI service.',
    details: error,
    retryable: true,
  };
}
