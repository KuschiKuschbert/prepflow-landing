/**
 * API Error Handler Utility
 * Provides consistent error handling for API calls across the application
 */

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

/**
 * Handles API errors consistently
 */
export const handleApiError = (error: any): ApiError => {
  console.error('API Error:', error);

  // Network errors
  if (!error.response) {
    return {
      message: 'Network error - please check your connection',
      code: 'NETWORK_ERROR',
      status: 0,
    };
  }

  // HTTP errors
  const status = error.response?.status || 500;
  const data = error.response?.data;

  switch (status) {
    case 400:
      return {
        message: data?.message || 'Invalid request',
        code: 'BAD_REQUEST',
        status: 400,
        details: data,
      };
    
    case 401:
      return {
        message: 'Authentication required',
        code: 'UNAUTHORIZED',
        status: 401,
      };
    
    case 403:
      return {
        message: 'Access denied',
        code: 'FORBIDDEN',
        status: 403,
      };
    
    case 404:
      return {
        message: 'Resource not found',
        code: 'NOT_FOUND',
        status: 404,
      };
    
    case 500:
      return {
        message: data?.message || 'Internal server error',
        code: 'SERVER_ERROR',
        status: 500,
        details: data,
      };
    
    default:
      return {
        message: data?.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
        status,
        details: data,
      };
  }
};

/**
 * Wraps API calls with error handling
 */
export const withErrorHandling = async <T>(
  apiCall: () => Promise<T>,
  fallbackValue?: T
): Promise<ApiResponse<T>> => {
  try {
    const data = await apiCall();
    return {
      success: true,
      data,
    };
  } catch (error) {
    const apiError = handleApiError(error);
    
    return {
      success: false,
      error: apiError,
      data: fallbackValue,
    };
  }
};

/**
 * Creates a standardized API response
 */
export const createApiResponse = <T>(
  success: boolean,
  data?: T,
  error?: ApiError,
  message?: string
): ApiResponse<T> => {
  return {
    success,
    data,
    error,
    message,
  };
};

/**
 * Retry mechanism for failed API calls
 */
export const retryApiCall = async <T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<ApiResponse<T>> => {
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const data = await apiCall();
      return {
        success: true,
        data,
      };
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        break;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  return {
    success: false,
    error: handleApiError(lastError),
  };
};

/**
 * Hook for handling API errors in React components
 */
export const useApiErrorHandler = () => {
  const handleError = (error: ApiError, context?: string) => {
    console.error(`API Error${context ? ` in ${context}` : ''}:`, error);
    
    // Log to analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'api_error', {
        error_code: error.code,
        error_message: error.message,
        context,
      });
    }

    // You can add more error handling logic here
    // e.g., show toast notifications, redirect to error page, etc.
  };

  return { handleError };
};
