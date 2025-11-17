import type { AIError } from '../types';

export function parseAIError(error: Error): AIError {
  const message = error.message || 'Unknown error';
  const errorString = message.toLowerCase();
  if (errorString.includes('api key') || errorString.includes('authentication'))
    return {
      type: 'API_KEY_MISSING',
      message: 'AI service authentication failed',
      details: error,
      retryable: false,
    };
  if (errorString.includes('rate limit') || errorString.includes('429'))
    return {
      type: 'RATE_LIMITED',
      message: 'AI service rate limit exceeded. Please try again later.',
      details: error,
      retryable: true,
    };
  if (errorString.includes('timeout') || errorString.includes('timed out'))
    return {
      type: 'TIMEOUT',
      message: 'AI request timed out. Please try again.',
      details: error,
      retryable: true,
    };
  if (errorString.includes('network') || errorString.includes('fetch'))
    return {
      type: 'NETWORK_ERROR',
      message: 'Network error. Please check your connection.',
      details: error,
      retryable: true,
    };
  if (errorString.includes('invalid') || errorString.includes('400'))
    return {
      type: 'INVALID_REQUEST',
      message: 'Invalid AI request. Please check your input.',
      details: error,
      retryable: false,
    };
  return {
    type: 'UNKNOWN',
    message: 'An unexpected error occurred with the AI service.',
    details: error,
    retryable: true,
  };
}
