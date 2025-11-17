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
  static getErrorMessage(error: ApiError): string {
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
