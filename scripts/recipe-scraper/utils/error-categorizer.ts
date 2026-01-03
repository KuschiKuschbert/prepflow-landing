/**
 * Error Categorizer Utility
 * Categorizes scraping errors and determines retry strategies
 */

import { scraperLogger } from './logger';

export interface ErrorCategory {
  isRetryable: boolean;
  shouldSkipPermanently: boolean;
  retryDelay?: number;
  maxRetries?: number;
  reason: string;
}

/**
 * Check if an error is retryable
 * @param error - Error object or error message
 * @returns True if error should be retried
 */
export function isRetryableError(error: unknown): boolean {
  const category = categorizeError(error);
  return category.isRetryable;
}

/**
 * Check if a URL should be skipped permanently (e.g., 404, 403)
 * @param error - Error object or error message
 * @returns True if URL should be skipped permanently
 */
export function shouldSkipPermanently(error: unknown): boolean {
  const category = categorizeError(error);
  return category.shouldSkipPermanently;
}

/**
 * Get retry delay based on error type and attempt number
 * @param error - Error object or error message
 * @param attempt - Current retry attempt (1-based)
 * @param baseDelay - Base delay in milliseconds (default: 1000)
 * @returns Retry delay in milliseconds
 */
export function getRetryDelay(
  error: unknown,
  attempt: number = 1,
  baseDelay: number = 1000,
): number {
  const category = categorizeError(error);

  // If error has specific retry delay, use it
  if (category.retryDelay) {
    return category.retryDelay;
  }

  // Exponential backoff with jitter
  const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
  const jitter = Math.random() * 0.3 * exponentialDelay; // Up to 30% jitter
  return Math.min(exponentialDelay + jitter, 60000); // Cap at 60 seconds
}

/**
 * Get maximum retries for an error type
 * @param error - Error object or error message
 * @param defaultMaxRetries - Default max retries (default: 5)
 * @returns Maximum number of retries
 */
export function getMaxRetries(error: unknown, defaultMaxRetries: number = 5): number {
  const category = categorizeError(error);
  return category.maxRetries ?? defaultMaxRetries;
}

/**
 * Categorize an error and determine retry strategy
 * @param error - Error object or error message
 * @returns Error category with retry strategy
 */
export function categorizeError(error: unknown): ErrorCategory {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorString = errorMessage.toLowerCase();

  // Check for HTTP status codes in error message
  const statusCodeMatch = errorMessage.match(/(\d{3})/);
  const statusCode = statusCodeMatch ? parseInt(statusCodeMatch[1], 10) : null;

  // 404 Not Found - Skip permanently
  if (statusCode === 404 || errorString.includes('404') || errorString.includes('not found')) {
    return {
      isRetryable: false,
      shouldSkipPermanently: true,
      reason: 'URL not found (404)',
    };
  }

  // 403 Forbidden - Skip permanently (likely blocked)
  if (statusCode === 403 || errorString.includes('403') || errorString.includes('forbidden')) {
    return {
      isRetryable: false,
      shouldSkipPermanently: true,
      reason: 'Access forbidden (403)',
    };
  }

  // 429 Rate Limit - Retry with longer delay
  if (statusCode === 429 || errorString.includes('429') || errorString.includes('rate limit')) {
    return {
      isRetryable: true,
      shouldSkipPermanently: false,
      retryDelay: 60000, // 60 seconds for rate limits
      maxRetries: 3, // Fewer retries for rate limits
      reason: 'Rate limit exceeded (429)',
    };
  }

  // 503 Service Unavailable - Retry with backoff
  if (statusCode === 503 || errorString.includes('503') || errorString.includes('service unavailable')) {
    return {
      isRetryable: true,
      shouldSkipPermanently: false,
      retryDelay: 10000, // 10 seconds for service unavailable
      maxRetries: 5,
      reason: 'Service unavailable (503)',
    };
  }

  // 500 Internal Server Error - Retry with backoff
  if (statusCode === 500 || errorString.includes('500') || errorString.includes('internal server error')) {
    return {
      isRetryable: true,
      shouldSkipPermanently: false,
      retryDelay: 5000, // 5 seconds for server errors
      maxRetries: 3,
      reason: 'Internal server error (500)',
    };
  }

  // Timeout errors - Retry with exponential backoff
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

  // Network errors - Retry with exponential backoff
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

  // robots.txt disallowed - Skip permanently
  if (errorString.includes('robots.txt') || errorString.includes('disallowed')) {
    return {
      isRetryable: false,
      shouldSkipPermanently: true,
      reason: 'Disallowed by robots.txt',
    };
  }

  // Validation errors - Skip permanently (won't improve with retry)
  if (
    errorString.includes('validation') ||
    errorString.includes('invalid') ||
    errorString.includes('parse') ||
    errorString.includes('malformed')
  ) {
    return {
      isRetryable: false,
      shouldSkipPermanently: true,
      reason: 'Validation/parsing error',
    };
  }

  // Default: Retry with exponential backoff
  return {
    isRetryable: true,
    shouldSkipPermanently: false,
    maxRetries: 5,
    reason: 'Unknown error (default retry)',
  };
}

/**
 * Log error category for debugging
 * @param error - Error object or error message
 * @param url - URL that failed (optional)
 */
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
