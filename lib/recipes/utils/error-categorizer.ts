/**
 * Error Categorizer Utility (Migrated from scripts)
 */

import { scraperLogger } from './logger';

export interface ErrorCategory {
  isRetryable: boolean;
  shouldSkipPermanently: boolean;
  retryDelay?: number;
  maxRetries?: number;
  reason: string;
}

export function isRetryableError(error: unknown): boolean {
  const category = categorizeError(error);
  return category.isRetryable;
}

export function shouldSkipPermanently(error: unknown): boolean {
  const category = categorizeError(error);
  return category.shouldSkipPermanently;
}

export function getRetryDelay(
  error: unknown,
  attempt: number = 1,
  baseDelay: number = 1000,
): number {
  const category = categorizeError(error);

  if (category.retryDelay) {
    return category.retryDelay;
  }

  const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
  const jitter = Math.random() * 0.3 * exponentialDelay;
  return Math.min(exponentialDelay + jitter, 60000);
}

export function getMaxRetries(error: unknown, defaultMaxRetries: number = 5): number {
  const category = categorizeError(error);
  return category.maxRetries ?? defaultMaxRetries;
}

export function categorizeError(error: unknown): ErrorCategory {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorString = errorMessage.toLowerCase();

  const statusCodeMatch = errorMessage.match(/(\d{3})/);
  const statusCode = statusCodeMatch ? parseInt(statusCodeMatch[1], 10) : null;

  if (statusCode === 404 || errorString.includes('404') || errorString.includes('not found')) {
    return { isRetryable: false, shouldSkipPermanently: true, reason: 'URL not found (404)' };
  }

  if (statusCode === 403 || errorString.includes('403') || errorString.includes('forbidden')) {
    return { isRetryable: false, shouldSkipPermanently: true, reason: 'Access forbidden (403)' };
  }

  if (statusCode === 429 || errorString.includes('429') || errorString.includes('rate limit')) {
    return {
      isRetryable: true,
      shouldSkipPermanently: false,
      retryDelay: 60000,
      maxRetries: 3,
      reason: 'Rate limit exceeded (429)',
    };
  }

  if (
    statusCode === 503 ||
    errorString.includes('503') ||
    errorString.includes('service unavailable')
  ) {
    return {
      isRetryable: true,
      shouldSkipPermanently: false,
      retryDelay: 10000,
      maxRetries: 5,
      reason: 'Service unavailable (503)',
    };
  }

  if (
    statusCode === 500 ||
    errorString.includes('500') ||
    errorString.includes('internal server error')
  ) {
    return {
      isRetryable: true,
      shouldSkipPermanently: false,
      retryDelay: 5000,
      maxRetries: 3,
      reason: 'Internal server error (500)',
    };
  }

  if (
    errorString.includes('timeout') ||
    errorString.includes('timed out') ||
    errorString.includes('etimedout') ||
    errorString.includes('econnreset')
  ) {
    return {
      isRetryable: true,
      shouldSkipPermanently: false,
      maxRetries: 5,
      reason: 'Network timeout',
    };
  }

  if (
    errorString.includes('network') ||
    errorString.includes('econnrefused') ||
    errorString.includes('enotfound') ||
    errorString.includes('eai_again')
  ) {
    return {
      isRetryable: true,
      shouldSkipPermanently: false,
      maxRetries: 5,
      reason: 'Network error',
    };
  }

  if (errorString.includes('robots.txt') || errorString.includes('disallowed')) {
    return { isRetryable: false, shouldSkipPermanently: true, reason: 'Disallowed by robots.txt' };
  }

  if (
    errorString.includes('validation') ||
    errorString.includes('invalid') ||
    errorString.includes('parse') ||
    errorString.includes('malformed')
  ) {
    return { isRetryable: false, shouldSkipPermanently: true, reason: 'Validation/parsing error' };
  }

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
