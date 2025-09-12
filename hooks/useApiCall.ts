'use client';

import { useState, useEffect, useCallback } from 'react';
import { ApiResponse, withErrorHandling, ApiError } from '@/lib/api-error-handler';

interface UseApiCallOptions {
  immediate?: boolean;
  retryOnError?: boolean;
  maxRetries?: number;
}

interface UseApiCallReturn<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  execute: (...args: any[]) => Promise<ApiResponse<T>>;
  reset: () => void;
}

export function useApiCall<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiCallOptions = {}
): UseApiCallReturn<T> {
  const {
    immediate = false,
    retryOnError = false,
    maxRetries = 3,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(async (...args: any[]): Promise<ApiResponse<T>> => {
    setLoading(true);
    setError(null);

    try {
      const result = await withErrorHandling(() => apiFunction(...args));
      
      if (result.success && result.data !== undefined) {
        setData(result.data);
        setError(null);
      } else {
        setError(result.error || null);
        setData(null);
      }

      return result;
    } catch (err) {
      const apiError: ApiError = {
        message: 'An unexpected error occurred',
        code: 'UNEXPECTED_ERROR',
      };
      setError(apiError);
      setData(null);
      
      return {
        success: false,
        error: apiError,
      };
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

// Hook for handling multiple API calls
export function useApiCalls<T = any>(
  apiFunctions: Array<(...args: any[]) => Promise<T>>,
  options: UseApiCallOptions = {}
) {
  const [results, setResults] = useState<Array<ApiResponse<T>>>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Array<ApiError | null>>([]);

  const executeAll = useCallback(async (...args: any[]): Promise<ApiResponse<T>[]> => {
    setLoading(true);
    setErrors([]);

    try {
      const promises = apiFunctions.map(apiFunction => 
        withErrorHandling(() => apiFunction(...args))
      );

      const results = await Promise.all(promises);
      
      setResults(results);
      setErrors(results.map(result => result.error || null));

      return results;
    } catch (err) {
      const apiError: ApiError = {
        message: 'An unexpected error occurred',
        code: 'UNEXPECTED_ERROR',
      };
      
      const errorResults = apiFunctions.map(() => ({
        success: false,
        error: apiError,
      }));

      setResults(errorResults);
      setErrors(apiFunctions.map(() => apiError));

      return errorResults;
    } finally {
      setLoading(false);
    }
  }, [apiFunctions]);

  const reset = useCallback(() => {
    setResults([]);
    setErrors([]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (options.immediate) {
      executeAll();
    }
  }, [options.immediate, executeAll]);

  return {
    results,
    loading,
    errors,
    executeAll,
    reset,
  };
}

// Hook for handling API calls with caching
export function useCachedApiCall<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  cacheKey: string,
  options: UseApiCallOptions & { cacheTimeout?: number } = {}
) {
  const { cacheTimeout = 5 * 60 * 1000 } = options; // 5 minutes default
  const apiCall = useApiCall(apiFunction, options);

  const executeWithCache = useCallback(async (...args: any[]): Promise<ApiResponse<T>> => {
    const cacheKeyWithArgs = `${cacheKey}_${JSON.stringify(args)}`;
    const cached = sessionStorage.getItem(cacheKeyWithArgs);
    
    if (cached) {
      try {
        const { data: cachedData, timestamp } = JSON.parse(cached);
        
        if (Date.now() - timestamp < cacheTimeout) {
          apiCall.reset();
          // Set data directly without going through the API call
          (apiCall as any).setData(cachedData);
          return {
            success: true,
            data: cachedData,
          };
        }
      } catch (err) {
        // Invalid cache, continue with API call
      }
    }

    const result = await apiCall.execute(...args);
    
    if (result.success && result.data) {
      // Cache the successful result
      sessionStorage.setItem(cacheKeyWithArgs, JSON.stringify({
        data: result.data,
        timestamp: Date.now(),
      }));
    }

    return result;
  }, [apiCall, cacheKey, cacheTimeout]);

  return {
    ...apiCall,
    execute: executeWithCache,
  };
}
