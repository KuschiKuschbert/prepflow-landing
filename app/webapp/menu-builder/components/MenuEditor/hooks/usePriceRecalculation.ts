import { useCallback } from 'react';
import { logger } from '@/lib/logger';

export function usePriceRecalculation(menuId: string, onMenuUpdated: () => void) {
  const handleRecalculatePrices = useCallback(async () => {
    try {
      const response = await fetch(`/api/menus/${menuId}/refresh-prices`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to refresh prices');
      }

      await fetch(`/api/menus/${menuId}/changes/handle`, {
        method: 'POST',
      });

      onMenuUpdated();
    } catch (err) {
      logger.error('[MenuEditor] Error recalculating prices:', err);
      throw err;
    }
  }, [menuId, onMenuUpdated]);

  return { handleRecalculatePrices };
}



