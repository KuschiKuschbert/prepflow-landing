/**
 * Error Categorizer Utility (Migrated from scripts)
 */

import { scraperLogger } from './logger';
import { matchCategory, type ErrorCategory } from './error-categorizer-rules';

export type { ErrorCategory };

export function isRetryableError(error: unknown): boolean {
  return categorizeError(error).isRetryable;
}

export function shouldSkipPermanently(error: unknown): boolean {
  return categorizeError(error).shouldSkipPermanently;
}

export function getRetryDelay(
  error: unknown,
  attempt: number = 1,
  baseDelay: number = 1000,
): number {
  const category = categorizeError(error);
  if (category.retryDelay) return category.retryDelay;
  const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
  const jitter = Math.random() * 0.3 * exponentialDelay;
  return Math.min(exponentialDelay + jitter, 60000);
}

export function getMaxRetries(error: unknown, defaultMaxRetries: number = 5): number {
  return categorizeError(error).maxRetries ?? defaultMaxRetries;
}

export function categorizeError(error: unknown): ErrorCategory {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorString = errorMessage.toLowerCase();
  const statusCodeMatch = errorMessage.match(/(\d{3})/);
  const statusCode = statusCodeMatch ? parseInt(statusCodeMatch[1], 10) : null;

  const matched = matchCategory(errorMessage, errorString, statusCode);
  if (matched) return matched;

  return {
    isRetryable: true,
    shouldSkipPermanently: false,
    maxRetries: 5,
    reason: 'Unknown error (default retry)',
  };
}

export function logErrorCategory(error: unknown, url?: string): void {
  const category = categorizeError(error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  scraperLogger.debug(`[Error Categorizer] Error categorized:`, {
    url: url || 'unknown',
    error: errorMessage,
    category: category.reason,
    isRetryable: category.isRetryable,
    shouldSkipPermanently: category.shouldSkipPermanently,
    retryDelay: category.retryDelay,
    maxRetries: category.maxRetries,
  });
}
