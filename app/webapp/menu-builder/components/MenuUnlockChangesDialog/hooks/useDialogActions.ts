import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { useState } from 'react';

interface UseDialogActionsProps {
  menuId: string;
  onRecalculatePrices: () => Promise<void>;
  onDismiss: () => void;
  onClose: () => void;
}

/**
 * Hook for managing dialog actions (recalculate prices, dismiss changes)
 */
export function useDialogActions({
  menuId,
  onRecalculatePrices,
  onDismiss,
  onClose,
}: UseDialogActionsProps) {
  const { showSuccess, showError } = useNotification();
  const [recalculating, setRecalculating] = useState(false);

  const handleRecalculatePrices = async () => {
    setRecalculating(true);
    try {
      await onRecalculatePrices();
      showSuccess('Prices recalculated successfully');
      onClose();
    } catch (err) {
      logger.error('[MenuUnlockChangesDialog] Error recalculating prices:', err);
      showError('Failed to recalculate prices. Give it another go, chef.');
    } finally {
      setRecalculating(false);
    }
  };

  const handleDismiss = async () => {
    try {
      // Mark changes as handled
      const response = await fetch(`/api/menus/${menuId}/changes/handle`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to mark changes as handled');
      }

      onDismiss();
      onClose();
    } catch (err) {
      logger.error('[MenuUnlockChangesDialog] Error dismissing changes:', err);
      showError('Failed to dismiss changes. Give it another go, chef.');
    }
  };

  return {
    recalculating,
    handleRecalculatePrices,
    handleDismiss,
  };
}




