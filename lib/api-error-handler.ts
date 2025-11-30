import {
  parseSupabaseError,
  SUPABASE_ERROR_CODES,
  type ApiError,
} from './api-error-handler/supabaseErrorParser';
import {
  isNetworkError,
  isServerError,
  isClientError,
  isTableNotFoundError,
  isRowNotFoundError,
} from './api-error-handler/errorChecks';

interface PostgrestError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

export { SUPABASE_ERROR_CODES };
export type { ApiError };

export class ApiErrorHandler {
  static createError(message: string, code?: string, status?: number, details?: any): ApiError {
    return { message, code, status, details, timestamp: new Date() };
  }
  static fromResponse(response: Response, data?: any): ApiError {
    return {
      message: data?.message || data?.error || 'An error occurred',
      code: data?.code || response.status.toString(),
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
  static isNetworkError(error: any): boolean {
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
        // Dynamic import to avoid circular dependencies
        const personalityModule = require('./personality/ui');
        const { dispatchErrorPersonality } = personalityModule;
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
}
