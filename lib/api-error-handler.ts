/**
 * API Error Handler for PrepFlow
 * Provides standardized error handling and types
 */

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
  timestamp?: Date;
}

export class ApiErrorHandler {
  static createError(message: string, code?: string, status?: number, details?: any): ApiError {
    return {
      message,
      code,
      status,
      details,
      timestamp: new Date(),
    };
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

  static isNetworkError(error: any): boolean {
    return (
      error.code === 'NETWORK_ERROR' ||
      error.message?.includes('fetch') ||
      error.message?.includes('network')
    );
  }

  static isServerError(error: ApiError): boolean {
    return error.status ? error.status >= 500 : false;
  }

  static isClientError(error: ApiError): boolean {
    return error.status ? error.status >= 400 && error.status < 500 : false;
  }

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
}

// Export the ApiError type as the default export for convenience
export type { ApiError as default };
