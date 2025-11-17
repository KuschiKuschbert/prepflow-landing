import { trackCost, storeCostTracking } from './cost-tracker';
import { generateCacheKey, cacheAIResponse } from '../cache/ai-cache';
import type { AIResponse, AIChatMessage, AIRequestOptions } from '../types';

interface Usage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export function processAIResponse(
  content: string,
  usage: Usage | undefined,
  model: string,
  requestType: 'chat' | 'vision',
  messages: AIChatMessage[] | undefined,
  countryCode: string,
  options: AIRequestOptions,
): AIResponse<string> {
  if (usage) {
    const costTracking = trackCost(
      `req_${Date.now()}`,
      requestType,
      model,
      usage.promptTokens,
      usage.completionTokens,
    );
    storeCostTracking(costTracking);
  }
  if (options.useCache !== false && content && messages) {
    const cacheKey = generateCacheKey(requestType, { messages, countryCode, options });
    const ttl = options.cacheTTL || 60 * 60 * 1000;
    cacheAIResponse(cacheKey, content, ttl);
  }
  return { content, usage };
}
