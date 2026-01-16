/**
 * Hook for generating recipe cards.
 */
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { useRef, useState } from 'react';
import { handleFetch } from './useCardGeneration/helpers/handleFetch';
import { parseResponse } from './useCardGeneration/helpers/parseResponse';

interface UseCardGenerationOptions {
  menuId: string;
  onSuccess?: () => void;
}

export function useCardGeneration({ menuId, onSuccess }: UseCardGenerationOptions) {
  const [generating, setGenerating] = useState(false);
  const { showSuccess, showError } = useNotification();
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleGenerateCards = async () => {
    const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    try {
      logger.dev(`[useCardGeneration] [${requestId}] handleGenerateCards called`, {
        menuId,
        generating,
      });

      setGenerating(true);
      logger.dev(`[useCardGeneration] [${requestId}] State updated, making API call...`);

      const controller = new AbortController();
      abortControllerRef.current = controller;
      const fetchStartTime = Date.now();
      const response = await handleFetch({ menuId, requestId, controller, fetchStartTime });
      const data = await parseResponse(response);

      if (!response.ok) {
        logger.error('[useCardGeneration] Generation failed:', {
          status: response.status,
          data,
        });
        const typedData = data as { message?: string; error?: string };
        const errorMsg =
          typedData.message ||
          typedData.error ||
          `Failed to generate recipe cards (${response.status})`;
        throw new Error(errorMsg);
      }

      logger.dev('[useCardGeneration] Generation successful, refreshing cards...');
      showSuccess('Recipe cards generated successfully! Loading cards...');
      onSuccess?.();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to generate recipe cards';
      logger.error('[useCardGeneration] Error generating cards:', err);
      showError(errorMsg);
      throw err;
    } finally {
      setGenerating(false);
    }
  };

  return {
    generating,
    handleGenerateCards,
  };
}
