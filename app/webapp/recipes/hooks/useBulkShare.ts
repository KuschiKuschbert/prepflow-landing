'use client';

import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { useCallback } from 'react';

interface UseBulkShareProps {
  selectedRecipeIds: string[];
  onSuccess?: () => void;
}

export function useBulkShare({ selectedRecipeIds, onSuccess }: UseBulkShareProps) {
  const { showSuccess, showError } = useNotification();

  const handleBulkShare = useCallback(
    async (shareType: string, recipientEmail?: string, notes?: string) => {
      if (selectedRecipeIds.length === 0) {
        showError('No recipes selected for sharing');
        return;
      }

      try {
        const result = await performShareRequest(
          selectedRecipeIds,
          shareType,
          recipientEmail,
          notes,
        );

        if (result.error) {
          showError(result.error);
          return;
        }

        handleShareResponse(result, showSuccess, showError);
        onSuccess?.();
      } catch (err) {
        logger.error('Bulk share failed:', err);
        showError('Failed to share recipes. Please check your connection and try again.');
      }
    },
    [selectedRecipeIds, showSuccess, showError, onSuccess],
  );

  return {
    handleBulkShare,
  };
}

async function performShareRequest(
  recipeIds: string[],
  shareType: string,
  recipientEmail?: string,
  notes?: string,
) {
  const response = await fetch('/api/recipes/bulk-share', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipeIds,
      shareType,
      recipientEmail,
      notes,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    return { error: data.message || data.error || 'Failed to share recipes' };
  }
  return data;
}

function handleShareResponse(
  result: any,
  showSuccess: (msg: string) => void,
  showError: (msg: string) => void,
) {
  const { summary } = result;
  if (summary) {
    if (summary.failed > 0) {
      showError(
        `Shared ${summary.successful} recipe${summary.successful > 1 ? 's' : ''} successfully, ${summary.failed} failed`,
      );
    } else {
      showSuccess(
        `Shared ${summary.successful} recipe${summary.successful > 1 ? 's' : ''} successfully!`,
      );
    }
  } else {
    showSuccess('Recipes shared successfully!');
  }
}
