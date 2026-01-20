import { useNotification } from '@/contexts/NotificationContext';
import { useConfirm } from '@/hooks/useConfirm';
import { logger } from '@/lib/logger';
import { useState } from 'react';

export interface AllergenDetectionProgress {
  processed: number;
  successful: number;
  failed: number;
  skipped: number;
}

interface UseBulkAllergenDetectionProps {
  onComplete?: () => void;
}

export function useBulkAllergenDetection({ onComplete }: UseBulkAllergenDetectionProps = {}) {
  const { showConfirm, ConfirmDialog } = useConfirm();
  const { showSuccess, showError, showWarning } = useNotification();
  const [progress, setProgress] = useState<AllergenDetectionProgress | null>(null);

  const detectAllergens = async () => {
    const confirmed = await showConfirm({
      title: 'Detect Missing Allergens?',
      message:
        "This will detect allergens for all ingredients that don't have them yet. Ingredients with manually set allergens will be skipped. This may take a few minutes.",
      variant: 'info',
      confirmLabel: 'Detect Allergens',
      cancelLabel: 'Cancel',
    });

    if (!confirmed) {
      return;
    }

    // Store original progress state for rollback
    const originalProgress = progress;

    // Optimistically show progress UI
    setProgress({ processed: 0, successful: 0, failed: 0, skipped: 0 });

    try {
      const response = await fetch('/api/ingredients/detect-missing-allergens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ force: false }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const { processed, successful, failed, skipped } = data.data;
        setProgress({ processed, successful, failed, skipped });

        if (successful > 0) {
          showSuccess(
            `Allergen detection complete: ${successful} ingredients updated, ${skipped} skipped, ${failed} failed`,
          );
        } else if (skipped === processed) {
          showWarning('All ingredients already have allergens or are manually set');
        } else {
          showWarning(`No allergens detected. ${failed > 0 ? `${failed} failed.` : ''}`);
        }

        if (onComplete) {
          onComplete();
        }
      } else {
        // Error - revert progress state
        setProgress(originalProgress);
        showError(data.error || data.message || 'Failed to detect allergens');
      }
    } catch (err) {
      // Error - revert progress state
      setProgress(originalProgress);
      logger.error('[BulkAllergenDetection] Error:', err);
      showError('Connection issue while detecting allergens. Give it another go, chef.');
    }
  };

  return {
    progress,
    detectAllergens,
    ConfirmDialog,
  };
}
