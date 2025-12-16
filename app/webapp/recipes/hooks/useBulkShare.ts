'use client';

import { useCallback, useState } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';

interface UseBulkShareProps {
  selectedRecipeIds: string[];
  onSuccess?: () => void;
}

export function useBulkShare({ selectedRecipeIds, onSuccess }: UseBulkShareProps) {
  const { showSuccess, showError } = useNotification();
  const [shareLoading, setShareLoading] = useState(false);

  const handleBulkShare = useCallback(
    async (shareType: string, recipientEmail?: string, notes?: string) => {
      if (selectedRecipeIds.length === 0) {
        showError('No recipes selected for sharing');
        return;
      }

      setShareLoading(true);

      try {
        const response = await fetch('/api/recipes/bulk-share', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipeIds: selectedRecipeIds,
            shareType,
            recipientEmail,
            notes,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          const errorMessage = result.message || result.error || 'Failed to share recipes';
          showError(errorMessage);
          return;
        }

        // Show success message with summary
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

        onSuccess?.();
      } catch (err) {
        logger.error('Bulk share failed:', err);
        showError('Failed to share recipes. Please check your connection and try again.');
      } finally {
        setShareLoading(false);
      }
    },
    [selectedRecipeIds, showSuccess, showError, onSuccess],
  );

  return {
    handleBulkShare,
    shareLoading,
  };
}



