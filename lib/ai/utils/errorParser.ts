import type { AIError } from '../types';

export function parseAIError(error: Error): AIError {
  const message = error.message || 'Unknown error';
  const errorString = message.toLowerCase();

  // Check for API key / authentication errors (OpenAI and Gemini)
  if (
    errorString.includes('api key') ||
    errorString.includes('authentication') ||
    errorString.includes('invalid api key') ||
    errorString.includes('api key not found') ||
    errorString.includes('permission denied') ||
    errorString.includes('401')
  ) {
    return {
      type: 'API_KEY_MISSING',
      message: 'AI service authentication failed',
      details: error,
      retryable: false,
    };
  }

  // Check for rate limit errors (OpenAI and Gemini)
  if (
    errorString.includes('rate limit') ||
    errorString.includes('429') ||
    errorString.includes('quota exceeded') ||
    errorString.includes('resource exhausted') ||
    errorString.includes('too many requests')
  ) {
    return {
      type: 'RATE_LIMITED',
      message:
        "The AI's had a bit too much on its plate. Give it a moment to catch its breath and try again.",
      details: error,
      retryable: true,
    };
  }

  // Check for quota/billing errors (Gemini-specific)
  if (
    errorString.includes('quota') ||
    errorString.includes('billing') ||
    errorString.includes('payment required') ||
    errorString.includes('402')
  ) {
    return {
      type: 'RATE_LIMITED',
      message: 'AI service quota exceeded. Please check your billing.',
      details: error,
      retryable: false,
    };
  }

  // Check for timeout errors
  if (errorString.includes('timeout') || errorString.includes('timed out')) {
    return {
      type: 'TIMEOUT',
      message:
        "The AI's taking longer than expected. Give it another shot - sometimes good things take time.",
      details: error,
      retryable: true,
    };
  }

  // Check for network errors
  if (
    errorString.includes('network') ||
    errorString.includes('fetch') ||
    errorString.includes('connection') ||
    errorString.includes('econnreset')
  ) {
    return {
      type: 'NETWORK_ERROR',
      message: 'Network error. Please check your connection.',
      details: error,
      retryable: true,
    };
  }

  // Check for invalid request errors
  if (
    errorString.includes('invalid') ||
    errorString.includes('400') ||
    errorString.includes('bad request') ||
    errorString.includes('invalid argument')
  ) {
    return {
      type: 'INVALID_REQUEST',
      message: 'Invalid AI request. Please check your input.',
      details: error,
      retryable: false,
    };
  }

  // Check for content filtering / safety errors (Gemini-specific)
  if (
    errorString.includes('safety') ||
    errorString.includes('blocked') ||
    errorString.includes('content filter') ||
    errorString.includes('harmful')
  ) {
    return {
      type: 'INVALID_REQUEST',
      message: 'Content was blocked by safety filters. Please adjust your request.',
      details: error,
      retryable: false,
    };
  }

  return {
    type: 'UNKNOWN',
    message: "Something went sideways with the AI. We're looking into it - try again in a moment.",
    details: error,
    retryable: true,
  };
}
