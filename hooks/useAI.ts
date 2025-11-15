/**
 * Generic AI Hook
 *
 * Provides reusable AI functionality for React components
 */

import { useState, useCallback } from 'react';
import type { AIRequestOptions, AIResponse, AIChatMessage } from '@/lib/ai/types';

interface UseAIOptions {
  countryCode?: string;
  defaultOptions?: AIRequestOptions;
}

interface UseAIReturn {
  generate: (
    messages: AIChatMessage[],
    options?: AIRequestOptions,
  ) => Promise<AIResponse<string>>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useAI(options: UseAIOptions = {}): UseAIReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (
      messages: AIChatMessage[],
      requestOptions?: AIRequestOptions,
    ): Promise<AIResponse<string>> => {
      setIsLoading(true);
      setError(null);

      try {
        const countryCode = options.countryCode || 'AU'; // Default to Australia
        const mergedOptions = { ...options.defaultOptions, ...requestOptions };

        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages,
            countryCode,
            options: mergedOptions,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to generate AI response');
        }

        const data = await response.json();
        setIsLoading(false);
        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        setIsLoading(false);
        return {
          content: '',
          error: errorMessage,
        };
      }
    },
    [options.countryCode, options.defaultOptions],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    generate,
    isLoading,
    error,
    clearError,
  };
}
