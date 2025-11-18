import { getOpenAIClient, isAIEnabled, getDefaultModel } from '../openai-client';
import { buildKitchenContext } from '../prompts/kitchen-context';
import { generateCacheKey, getCachedAIResponse } from '../cache/ai-cache';
import { checkRateLimit } from '../utils/rate-limiter';
import { parseAIError } from '../utils/errorParser';
import { processAIResponse } from '../utils/responseProcessor';
import type { AIRequestOptions, AIResponse, AIChatMessage } from '../types';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

/**
 * Generate AI response from chat messages.
 *
 * @param {AIChatMessage[]} messages - Chat messages
 * @param {string} countryCode - Country code for context
 * @param {AIRequestOptions} options - Request options
 * @returns {Promise<AIResponse<string>>} AI response
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
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model,
        messages: messagesWithContext.map(msg => ({ role: msg.role, content: msg.content })),
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
      return processAIResponse(content, usage, model, 'chat', messages, countryCode, options);
    } catch (error) {
      lastError = error as Error;
      const aiError = parseAIError(error as Error);
      if (!aiError.retryable || attempt === MAX_RETRIES - 1)
        return { content: '', error: aiError.message };
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (attempt + 1)));
    }
  }
  return { content: '', error: lastError?.message || 'Unknown error occurred' };
}
