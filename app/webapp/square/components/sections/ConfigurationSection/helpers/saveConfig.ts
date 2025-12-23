import { logger } from '@/lib/logger';
import type { SquareConfig } from '../types';

interface SaveConfigParams {
  config: Partial<SquareConfig>;
  setSaving: React.Dispatch<React.SetStateAction<boolean>>;
  setShowConnectionWorkflow: React.Dispatch<React.SetStateAction<boolean>>;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  fetchConfig: () => Promise<void>;
}

export async function saveSquareConfig({
  config,
  setSaving,
  setShowConnectionWorkflow,
  showSuccess,
  showError,
  fetchConfig,
}: SaveConfigParams) {
  try {
    setSaving(true);
    const response = await fetch('/api/square/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to save configuration');
    showSuccess('Square configuration saved successfully');
    if (typeof window !== 'undefined') {
      const { clearCache } = await import('@/lib/cache/data-cache');
      clearCache('square_status');
    }
    await fetchConfig();
    setShowConnectionWorkflow(false);
  } catch (error) {
    logger.error('[Square Config] Error saving config:', {
      error: error instanceof Error ? error.message : String(error),
    });
    showError('Failed to save configuration');
  } finally {
    setSaving(false);
  }
}


