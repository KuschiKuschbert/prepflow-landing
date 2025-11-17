/**
 * AI Cost Tracking
 *
 * Tracks API usage and costs for monitoring and budgeting
 */

import { AICostTracking } from '../types';

import { logger } from '@/lib/logger';

// Cost per 1M tokens (as of 2024)
const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  'gpt-4o-mini': { input: 0.15, output: 0.6 },
  'gpt-4o': { input: 2.5, output: 10.0 },
  'gpt-4o-vision': { input: 2.5, output: 10.0 },
  'gpt-4-turbo': { input: 10.0, output: 30.0 },
  'gpt-3.5-turbo': { input: 0.5, output: 1.5 },
};

/**
 * Calculate cost for API usage
 */
export function calculateCost(
  model: string,
  promptTokens: number,
  completionTokens: number,
): number {
  const costs = MODEL_COSTS[model] || MODEL_COSTS['gpt-4o-mini'];
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
    logger.warn('Failed to store cost tracking:', error);
  }
}
