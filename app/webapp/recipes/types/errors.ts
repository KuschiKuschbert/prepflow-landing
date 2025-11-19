import { logger } from '@/lib/logger';
/**
 * Error types for recipe operations
 */

export enum RecipeErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

export interface RecipeError {
  type: RecipeErrorType;
  message: string;
  originalError?: Error;
  recoverable: boolean;
  retryAction?: () => Promise<void>;
}

export class NetworkError implements RecipeError {
  type = RecipeErrorType.NETWORK;
  recoverable = true;
  originalError?: Error;

  constructor(
    public message: string,
    error?: Error,
    public retryAction?: () => Promise<void>,
  ) {
    this.originalError = error;
  }
}

export class ValidationError implements RecipeError {
  type = RecipeErrorType.VALIDATION;
  recoverable = false;
  originalError?: Error;

  constructor(
    public message: string,
    error?: Error,
  ) {
    this.originalError = error;
  }
}

export class ServerError implements RecipeError {
  type = RecipeErrorType.SERVER;
  recoverable = true;
  originalError?: Error;

  constructor(
    public message: string,
    error?: Error,
    public retryAction?: () => Promise<void>,
  ) {
    this.originalError = error;
  }
}

export class UnknownError implements RecipeError {
  type = RecipeErrorType.UNKNOWN;
  recoverable = false;
  originalError?: Error;

  constructor(
    public message: string,
    error?: Error,
  ) {
    this.originalError = error;
  }
}

/**
 * Categorize an error into a RecipeError type
 */
export function categorizeError(error: unknown, retryAction?: () => Promise<void>): RecipeError {
  if (
    error instanceof NetworkError ||
    error instanceof ValidationError ||
    error instanceof ServerError
  ) {
    return error;
  }

  if (error instanceof Error) {
    // Network errors
    if (
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('Failed to fetch') ||
      error.name === 'NetworkError' ||
      error.name === 'TypeError'
    ) {
      return new NetworkError(
        'Network connection failed. Please check your internet connection and try again.',
        error,
        retryAction,
      );
    }

    // Server errors (5xx)
    if (
      error.message.includes('500') ||
      error.message.includes('502') ||
      error.message.includes('503')
    ) {
      return new ServerError(
        'Server error occurred. Please try again in a moment.',
        error,
        retryAction,
      );
    }

    // Validation errors (4xx)
    if (
      error.message.includes('400') ||
      error.message.includes('401') ||
      error.message.includes('403') ||
      error.message.includes('404') ||
      error.message.includes('validation') ||
      error.message.includes('invalid')
    ) {
      return new ValidationError(
        'Invalid data provided. Please check your input and try again.',
        error,
      );
    }
  }

  // Unknown error
  return new UnknownError(
    'An unexpected error occurred. Please try again or contact support if the problem persists.',
    error instanceof Error ? error : new Error(String(error)),
  );
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt);
        logger.dev(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

