import {
  isClientError,
  isNetworkError,
  isRowNotFoundError,
  isServerError,
  isTableNotFoundError,
} from './api-error-handler/errorChecks';
import {
  parseSupabaseError,
  SUPABASE_ERROR_CODES,
  type ApiError,
} from './api-error-handler/supabaseErrorParser';

import { PostgrestError } from '@supabase/supabase-js';

import { dispatchErrorPersonality } from './personality/ui';
// ... imports

export { SUPABASE_ERROR_CODES };
export type { ApiError };

export class ApiErrorHandler {
  static createError(message: string, code?: string, status?: number, details?: unknown): ApiError {
    return { message, code, status, details, timestamp: new Date() };
  }
  static fromResponse(response: Response, data?: unknown): ApiError {
    const errorData = data as Record<string, unknown> | undefined;
    return {
      message: String(errorData?.message || errorData?.error || 'An error occurred'),
      code: String(errorData?.code || response.status.toString()),
      status: response.status,
      details: data,
      timestamp: new Date(),
    };
  }
  static fromException(error: Error): ApiError {
    return {
      message: error.message,
      code: 'EXCEPTION',
      details: error.stack,
      timestamp: new Date(),
    };
  }
  static fromSupabaseError(error: PostgrestError | unknown, defaultStatus: number = 500): ApiError {
    return parseSupabaseError(error, defaultStatus);
  }
  static isNetworkError(error: unknown): boolean {
    return isNetworkError(error);
  }
  static isServerError(error: ApiError): boolean {
    return isServerError(error);
  }
  static isClientError(error: ApiError): boolean {
    return isClientError(error);
  }
  static getErrorMessage(error: ApiError, usePersonality = false): string {
    // Try to get personality error message if enabled
    if (usePersonality && typeof window !== 'undefined') {
      try {
        let errorType: 'validation' | 'network' | 'server' | 'notFound' | null = null;

        if (this.isNetworkError(error)) {
          errorType = 'network';
        } else if (this.isServerError(error)) {
          errorType = 'server';
        } else if (this.isRowNotFoundError(error)) {
          errorType = 'notFound';
        } else if (this.isClientError(error) && error.status === 400) {
          errorType = 'validation';
        }

        if (errorType && dispatchErrorPersonality) {
          const personalityMsg = dispatchErrorPersonality.pick(errorType);
          if (personalityMsg) {
            return personalityMsg;
          }
        }
      } catch {
        // Fall through to default messages if personality system not available
      }
    }

    // Default error messages
    if (this.isNetworkError(error))
      return 'Network connection failed. Please check your internet connection.';
    if (this.isServerError(error)) return 'Server error occurred. Please try again later.';
    if (this.isClientError(error))
      return error.message || 'Invalid request. Please check your input.';
    return error.message || 'An unexpected error occurred.';
  }
  static isTableNotFoundError(error: PostgrestError | unknown): boolean {
    return isTableNotFoundError(error);
  }
  static isRowNotFoundError(error: PostgrestError | unknown): boolean {
    return isRowNotFoundError(error);
  }

  /**
   * Type guard to check if an unknown error is an ApiError
   */
  static isApiError(error: unknown): error is ApiError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as ApiError).message === 'string'
    );
  }

  /**
   * Get the HTTP status code from an error, defaulting to 500
   */
  static getStatus(error: unknown): number {
    if (this.isApiError(error) && typeof error.status === 'number') {
      return error.status;
    }
    return 500;
  }

  /**
   * Convert an unknown error to an ApiError-shaped object for JSON responses
   */
  static toResponseData(error: unknown): { message: string; code?: string; details?: unknown } {
    if (this.isApiError(error)) {
      return {
        message: error.message,
        code: error.code,
        details: error.details,
      };
    }
    if (error instanceof Error) {
      return { message: error.message };
    }
    return { message: 'An unexpected error occurred' };
  }
}
