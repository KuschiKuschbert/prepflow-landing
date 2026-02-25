/**
 * Error category rules for error-categorizer. Extracted for filesize limit.
 */
export interface ErrorCategory {
  isRetryable: boolean;
  shouldSkipPermanently: boolean;
  retryDelay?: number;
  maxRetries?: number;
  reason: string;
}

export function matchCategory(
  errorMessage: string,
  errorString: string,
  statusCode: number | null,
): ErrorCategory | null {
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
  if (['timeout', 'timed out', 'etimedout', 'econnreset'].some(s => errorString.includes(s))) {
    return {
      isRetryable: true,
      shouldSkipPermanently: false,
      maxRetries: 5,
      reason: 'Network timeout',
    };
  }
  if (['network', 'econnrefused', 'enotfound', 'eai_again'].some(s => errorString.includes(s))) {
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
  if (['validation', 'invalid', 'parse', 'malformed'].some(s => errorString.includes(s))) {
    return { isRetryable: false, shouldSkipPermanently: true, reason: 'Validation/parsing error' };
  }
  return null;
}
