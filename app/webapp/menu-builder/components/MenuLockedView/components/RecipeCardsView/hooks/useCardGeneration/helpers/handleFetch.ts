/**
 * Handle fetch request for card generation.
 */
import { logger } from '@/lib/logger';

interface HandleFetchParams {
  menuId: string;
  requestId: string;
  controller: AbortController;
  fetchStartTime: number;
}

export async function handleFetch({
  menuId,
  requestId,
  controller,
  fetchStartTime,
}: HandleFetchParams): Promise<Response> {
  const fetchTimeout = 5 * 60 * 1000;
  const timeoutId = setTimeout(() => {
    logger.warn(`[useCardGeneration] [${requestId}] Fetch timeout after 5 minutes, aborting...`);
    controller.abort();
  }, fetchTimeout);

  try {
    logger.dev(`[useCardGeneration] [${requestId}] Initiating fetch...`);
    const response = await fetch(`/api/menus/${menuId}/recipe-cards/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const fetchDuration = Date.now() - fetchStartTime;
    logger.dev(`[useCardGeneration] [${requestId}] Fetch completed in ${fetchDuration}ms`, {
      status: response.status,
      ok: response.ok,
    });
    return response;
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
}
