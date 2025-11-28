import {
  getGeminiClient,
  isAIEnabled,
  getDefaultModel,
  getModelForTask,
  type TaskType,
} from '../gemini-client';
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

  // Build kitchen context for system instruction
  const kitchenContext = buildKitchenContext(countryCode);
  const systemInstruction = `You are a professional kitchen assistant for PrepFlow, a restaurant management system.

${kitchenContext}

Always provide responses that are:
- Professional and kitchen-focused
- Specific to the user's location and regulations
- Actionable and practical
- Using the correct currency, units, and formats for their country
- Compliant with local food safety standards`;

  // Separate system messages from conversation messages
  const systemMessages = messages.filter(msg => msg.role === 'system');
  const conversationMessages = messages.filter(msg => msg.role !== 'system');

  // Combine all system messages with kitchen context
  const fullSystemInstruction =
    systemMessages.length > 0
      ? `${systemInstruction}\n\n${systemMessages.map(msg => msg.content).join('\n\n')}`
      : systemInstruction;

  const client = getGeminiClient();
  if (!client) {
    return {
      content: '',
      error: 'AI client not available',
    };
  }

  // Determine task type for auto model selection
  const taskType: TaskType = 'text'; // Default for chat/text generation
  const model = options.model || getModelForTask(taskType);
  const temperature = options.temperature ?? 0.7;
  const maxOutputTokens = options.maxTokens ?? 2000;

  // Get the model instance
  const geminiModel = client.getGenerativeModel({
    model,
    systemInstruction: fullSystemInstruction,
    generationConfig: {
      temperature,
      maxOutputTokens,
    },
  });

  // Convert conversation messages to Gemini chat history format
  // For single request, use the last user message
  // For multi-turn conversations, build chat history
  let prompt = '';
  if (conversationMessages.length === 1) {
    // Single message - use directly
    prompt = conversationMessages[0].content;
  } else {
    // Multiple messages - combine user messages (Gemini handles context)
    // Take the last user message as the prompt
    const userMessages = conversationMessages.filter(msg => msg.role === 'user');
    prompt =
      userMessages[userMessages.length - 1]?.content || conversationMessages[0]?.content || '';
  }

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      // Extract token usage from response
      const usageMetadata = result.response.usageMetadata;
      const usage = usageMetadata
        ? {
            promptTokens: usageMetadata.promptTokenCount || 0,
            completionTokens: usageMetadata.candidatesTokenCount || 0,
            totalTokens: usageMetadata.totalTokenCount || 0,
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
