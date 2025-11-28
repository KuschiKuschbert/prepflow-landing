/**
 * Hook for generating recipe cards.
 */

import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { useRef, useState } from 'react';

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

      // Add client-side timeout (5 minutes max to match server timeout)
      const fetchTimeout = 5 * 60 * 1000; // 5 minutes
      const controller = new AbortController();
      abortControllerRef.current = controller; // Store ref so it survives Fast Refresh
      const timeoutId = setTimeout(() => {
        logger.warn(
          `[useCardGeneration] [${requestId}] Fetch timeout after 5 minutes, aborting...`,
        );
        controller.abort();
      }, fetchTimeout);

      const fetchStartTime = Date.now();
      let response: Response;
      try {
        logger.dev(`[useCardGeneration] [${requestId}] Initiating fetch...`);

        response = await fetch(`/api/menus/${menuId}/recipe-cards/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        const fetchDuration = Date.now() - fetchStartTime;
        logger.dev(
          `[useCardGeneration] [${requestId}] Fetch completed in ${fetchDuration}ms, got response`,
          {
            status: response.status,
            ok: response.ok,
            statusText: response.statusText,
          },
        );
      } catch (fetchError) {
        clearTimeout(timeoutId);
        const fetchDuration = Date.now() - fetchStartTime;
        logger.error(
          `[useCardGeneration] [${requestId}] Fetch failed after ${fetchDuration}ms:`,
          fetchError,
        );

        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new Error(
            'Request timed out after 5 minutes. The generation may still be running on the server. Please check server logs.',
          );
        }

        throw new Error(
          `Network error: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`,
        );
      }

      logger.dev('[useCardGeneration] Generation API response:', {
        status: response.status,
        ok: response.ok,
      });

      let data: any;
      try {
        const responseText = await response.text();
        logger.dev('[useCardGeneration] Response text received:', {
          preview: responseText.substring(0, 200),
        });
        data = JSON.parse(responseText);
        logger.dev('[useCardGeneration] Parsed API response data:', data);
      } catch (parseError) {
        logger.error('[useCardGeneration] Failed to parse response:', parseError);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        logger.error('[useCardGeneration] Generation failed:', {
          status: response.status,
          data,
        });
        const errorMsg =
          data.message || data.error || `Failed to generate recipe cards (${response.status})`;
        logger.error('[useCardGeneration] Generation error:', { error: errorMsg });
        throw new Error(errorMsg);
      }

      logger.dev('[useCardGeneration] Generation successful, refreshing cards...');
      showSuccess('Recipe cards generated successfully! Loading cards...');

      if (onSuccess) {
        onSuccess();
      }
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
