/**
 * AI Cost Tracking
 *
 * Tracks API usage and costs for monitoring and budgeting
 */

import { AICostTracking } from '../types';

import { logger } from '@/lib/logger';

// Cost per 1M tokens (as of 2024-2025)
// Gemini pricing (current as of 2025)
const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  // Gemini 2.5 models (current)
  'gemini-2.5-flash': { input: 0.075, output: 0.3 }, // Fast, cost-effective model for text generation
  'gemini-2.5-pro-preview-06-05': { input: 1.25, output: 5.0 }, // Pro model with vision capabilities
  'gemini-2.5-pro-preview-05-06': { input: 1.25, output: 5.0 }, // Pro model variant
  'gemini-2.5-pro-preview-03-25': { input: 1.25, output: 5.0 }, // Pro model variant
  'gemini-2.5-pro-vtea-da-csi': { input: 1.25, output: 5.0 }, // Pro model variant
  // Legacy Gemini models (kept for reference)
  'gemini-pro': { input: 0.5, output: 1.5 }, // Legacy model (may not be available)
  'gemini-1.5-flash': { input: 0.075, output: 0.3 }, // Legacy model (may not be available)
  'gemini-1.5-pro': { input: 1.25, output: 5.0 }, // Legacy model (may not be available)
  // Legacy OpenAI models (kept for reference, not used)
  // 'gpt-4o-mini': { input: 0.15, output: 0.6 },
  // 'gpt-4o': { input: 2.5, output: 10.0 },
  // 'gpt-4o-vision': { input: 2.5, output: 10.0 },
  // 'gpt-4-turbo': { input: 10.0, output: 30.0 },
  // 'gpt-3.5-turbo': { input: 0.5, output: 1.5 },
};

/**
 * Calculate cost for API usage
 */
export function calculateCost(
  model: string,
  promptTokens: number,
  completionTokens: number,
): number {
  const costs = MODEL_COSTS[model] || MODEL_COSTS['gemini-2.5-flash'];
  const inputCost = (promptTokens / 1_000_000) * costs.input;
  const outputCost = (completionTokens / 1_000_000) * costs.output;
  return inputCost + outputCost;
}

/**
 * Track AI request cost
 */
export function trackCost(
  requestId: string,
  endpoint: string,
  model: string,
  promptTokens: number,
  completionTokens: number,
): AICostTracking {
  const cost = calculateCost(model, promptTokens, completionTokens);
  const tracking: AICostTracking = {
    requestId,
    endpoint,
    model,
    tokens: promptTokens + completionTokens,
    cost,
    timestamp: Date.now(),
  };

  // Log cost (in production, send to analytics/monitoring service)
  if (process.env.NODE_ENV === 'development') {
    logger.dev(`💰 AI Cost: $${cost.toFixed(4)} (${tracking.tokens} tokens, ${model})`);
  }

  return tracking;
}

/**
 * Get total cost for a time period (from localStorage or database)
 */
export function getTotalCost(periodMs: number = 24 * 60 * 60 * 1000): number {
  if (typeof window === 'undefined') {
    return 0;
  }

  try {
    const costData = localStorage.getItem('ai_cost_tracking');
    if (!costData) {
      return 0;
    }

    const costs: AICostTracking[] = JSON.parse(costData);
    const cutoff = Date.now() - periodMs;
    const recentCosts = costs.filter(c => c.timestamp > cutoff);
    return recentCosts.reduce((sum, c) => sum + c.cost, 0);
  } catch {
    return 0;
  }
}

/**
 * Store cost tracking (client-side only, for development)
 */
export function storeCostTracking(tracking: AICostTracking): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const existing = localStorage.getItem('ai_cost_tracking');
    const costs: AICostTracking[] = existing ? JSON.parse(existing) : [];
    costs.push(tracking);

    // Keep only last 1000 entries
    const trimmed = costs.slice(-1000);
    localStorage.setItem('ai_cost_tracking', JSON.stringify(trimmed));
  } catch (error) {
    logger.warn('Failed to store cost tracking:', {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
