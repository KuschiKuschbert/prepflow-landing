import { logger } from '@/lib/logger';
import type { SquareConfig } from '../types';

interface DeleteConfigParams {
  setSaving: React.Dispatch<React.SetStateAction<boolean>>;
  setConfig: React.Dispatch<React.SetStateAction<Partial<SquareConfig>>>;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

export async function deleteSquareConfig({
  setSaving,
  setConfig,
  showSuccess,
  showError,
}: DeleteConfigParams) {
  try {
    setSaving(true);
    const response = await fetch('/api/square/config', { method: 'DELETE' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to delete configuration');
    showSuccess('Square configuration deleted');
    setConfig({
      square_environment: 'sandbox',
      auto_sync_enabled: true,
      sync_menu_items: true,
      sync_staff: true,
      sync_sales_data: true,
      sync_food_costs: true,
      webhook_enabled: false,
    });
  } catch (error) {
    logger.error('[Square Config] Error deleting config:', {
      error: error instanceof Error ? error.message : String(error),
    });
    showError('Failed to delete configuration');
  } finally {
    setSaving(false);
  }
}
