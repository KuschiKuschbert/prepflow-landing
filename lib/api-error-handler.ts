/**
 * API Error Handler for PrepFlow
 * Provides standardized error handling and types with Supabase error parsing
 */

/**
 * Supabase PostgrestError interface
 */
interface PostgrestError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

/**
 * Common Supabase error codes
 */
export const SUPABASE_ERROR_CODES = {
  TABLE_NOT_FOUND: '42P01',
  COLUMN_NOT_FOUND: '42703',
  NOT_NULL_VIOLATION: '23502',
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
  CHECK_VIOLATION: '23514',
  ROW_NOT_FOUND: 'PGRST116',
} as const;

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
  timestamp?: Date;
}

export class ApiErrorHandler {
  /**
   * Create a standardized API error
   */
  static createError(message: string, code?: string, status?: number, details?: any): ApiError {
    return {
      message,
      code,
      status,
      details,
      timestamp: new Date(),
    };
  }

  /**
   * Parse error from API response
   */
  static fromResponse(response: Response, data?: any): ApiError {
    return {
      message: data?.message || data?.error || 'An error occurred',
      code: data?.code || response.status.toString(),
      status: response.status,
      details: data,
      timestamp: new Date(),
    };
  }

  /**
   * Convert exception to API error
   */
  static fromException(error: Error): ApiError {
    return {
      message: error.message,
      code: 'EXCEPTION',
      details: error.stack,
      timestamp: new Date(),
    };
  }

  /**
   * Parse Supabase PostgrestError to ApiError
   * Handles common Supabase error codes and formats user-friendly messages
   */
  static fromSupabaseError(error: PostgrestError | unknown, defaultStatus: number = 500): ApiError {
    // Type guard for PostgrestError
    const isPostgrestError = (err: unknown): err is PostgrestError => {
      return (
        typeof err === 'object' &&
        err !== null &&
        'message' in err &&
        typeof (err as PostgrestError).message === 'string'
      );
    };

    if (!isPostgrestError(error)) {
      return this.createError(
        'Database error occurred',
        'DATABASE_ERROR',
        defaultStatus,
        error instanceof Error ? { message: error.message, stack: error.stack } : error,
      );
    }

    const errorCode = error.code;
    const errorMessage = error.message || 'Database error occurred';
    const errorDetails = error.details;
    const errorHint = error.hint;

    // Build user-friendly message
    let userMessage = errorMessage;
    if (errorDetails && errorDetails !== errorMessage) {
      userMessage += `: ${errorDetails}`;
    }
    if (errorHint && errorHint !== errorDetails) {
      userMessage += ` (${errorHint})`;
    }

    // Handle specific error codes
    switch (errorCode) {
      case SUPABASE_ERROR_CODES.TABLE_NOT_FOUND:
        return this.createError(
          'Database table not found',
          'TABLE_NOT_FOUND',
          500,
          process.env.NODE_ENV === 'development'
            ? { hint: errorMessage, code: errorCode }
            : undefined,
        );

      case SUPABASE_ERROR_CODES.COLUMN_NOT_FOUND:
        return this.createError(
          'Database column not found',
          'COLUMN_NOT_FOUND',
          500,
          process.env.NODE_ENV === 'development'
            ? { hint: errorMessage, code: errorCode }
            : undefined,
        );

      case SUPABASE_ERROR_CODES.NOT_NULL_VIOLATION:
        return this.createError(
          'Required field is missing',
          'NOT_NULL_VIOLATION',
          400,
          process.env.NODE_ENV === 'development' ? { hint: errorHint, code: errorCode } : undefined,
        );

      case SUPABASE_ERROR_CODES.UNIQUE_VIOLATION:
        return this.createError(
          'This record already exists',
          'UNIQUE_VIOLATION',
          409,
          process.env.NODE_ENV === 'development' ? { hint: errorHint, code: errorCode } : undefined,
        );

      case SUPABASE_ERROR_CODES.FOREIGN_KEY_VIOLATION:
        return this.createError(
          'Referenced record does not exist',
          'FOREIGN_KEY_VIOLATION',
          400,
          process.env.NODE_ENV === 'development' ? { hint: errorHint, code: errorCode } : undefined,
        );

      case SUPABASE_ERROR_CODES.CHECK_VIOLATION:
        return this.createError(
          'Data validation failed',
          'CHECK_VIOLATION',
          400,
          process.env.NODE_ENV === 'development' ? { hint: errorHint, code: errorCode } : undefined,
        );

      case SUPABASE_ERROR_CODES.ROW_NOT_FOUND:
        return this.createError(
          'Record not found',
          'NOT_FOUND',
          404,
          process.env.NODE_ENV === 'development' ? { code: errorCode } : undefined,
        );

      default:
        // Generic database error
        return this.createError(
          process.env.NODE_ENV === 'development' ? userMessage : 'Database error occurred',
          errorCode ? `DATABASE_ERROR_${errorCode}` : 'DATABASE_ERROR',
          defaultStatus,
          process.env.NODE_ENV === 'development'
            ? { message: errorMessage, details: errorDetails, hint: errorHint, code: errorCode }
            : undefined,
        );
    }
  }

  /**
   * Check if error is a network error
   */
  static isNetworkError(error: any): boolean {
    return (
      error.code === 'NETWORK_ERROR' ||
      error.message?.includes('fetch') ||
      error.message?.includes('network') ||
      error.message?.includes('Failed to fetch')
    );
  }

  /**
   * Check if error is a server error (5xx)
   */
  static isServerError(error: ApiError): boolean {
    return error.status ? error.status >= 500 : false;
  }

  /**
   * Check if error is a client error (4xx)
   */
  static isClientError(error: ApiError): boolean {
    return error.status ? error.status >= 400 && error.status < 500 : false;
  }

  /**
   * Get user-friendly error message
   */
  static getErrorMessage(error: ApiError): string {
    if (this.isNetworkError(error)) {
      return 'Network connection failed. Please check your internet connection.';
    }

    if (this.isServerError(error)) {
      return 'Server error occurred. Please try again later.';
    }

    if (this.isClientError(error)) {
      return error.message || 'Invalid request. Please check your input.';
    }

    return error.message || 'An unexpected error occurred.';
  }

  /**
   * Check if Supabase error is a table not found error
   */
  static isTableNotFoundError(error: PostgrestError | unknown): boolean {
    if (typeof error !== 'object' || error === null) return false;
    const err = error as PostgrestError;
    return (
      err.code === SUPABASE_ERROR_CODES.TABLE_NOT_FOUND ||
      err.message?.includes('does not exist') ||
      (err.message?.includes('relation') && err.message?.includes('does not exist'))
    );
  }

  /**
   * Check if Supabase error is a row not found error
   */
  static isRowNotFoundError(error: PostgrestError | unknown): boolean {
    if (typeof error !== 'object' || error === null) return false;
    const err = error as PostgrestError;
    return err.code === SUPABASE_ERROR_CODES.ROW_NOT_FOUND;
  }
}

// Export the ApiError type as the default export for convenience
export type { ApiError as default };
