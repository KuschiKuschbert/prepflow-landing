import { logger } from '@/lib/logger';

export async function updateIngredientViaApi<T extends { id: string }>(
  id: string,
  updates: Partial<T>,
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const response = await fetch('/api/ingredients', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });

    const result = (await response.json()) as { success?: boolean; data?: T; error?: string };

    if (!response.ok || !result.success) {
      return {
        success: false,
        error: result.error || 'Failed to update via API',
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    logger.error('[API Fallback] Error sending update:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
