import { logger } from '@/lib/logger';
import type { SquareConfig } from '../types';

interface FetchConfigParams {
  setConfig: React.Dispatch<React.SetStateAction<Partial<SquareConfig>>>;
  setShowConnectionWorkflow: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  showError: (message: string) => void;
}

export async function fetchSquareConfig({
  setConfig,
  setShowConnectionWorkflow,
  setLoading,
  showError,
}: FetchConfigParams) {
  try {
    setLoading(true);
    const response = await fetch('/api/square/config');
    const data = await response.json();
    if (response.ok && data.config) {
      const hasConfig = !!data.config.square_environment;
      setShowConnectionWorkflow(!hasConfig);
      setConfig({
        square_environment: data.config.square_environment || 'sandbox',
        default_location_id: data.config.default_location_id || '',
        auto_sync_enabled: data.config.auto_sync_enabled ?? true,
        sync_menu_items: data.config.sync_menu_items ?? true,
        sync_staff: data.config.sync_staff ?? true,
        sync_sales_data: data.config.sync_sales_data ?? true,
        sync_food_costs: data.config.sync_food_costs ?? true,
        webhook_enabled: data.config.webhook_enabled ?? false,
        webhook_url: data.config.webhook_url || '',
        webhook_secret: data.config.webhook_secret || '',
      });
    } else {
      setShowConnectionWorkflow(true);
    }
  } catch (error) {
    logger.error('[Square Config] Error fetching config:', {
      error: error instanceof Error ? error.message : String(error),
    });
    showError('Failed to load configuration');
  } finally {
    setLoading(false);
  }
}
