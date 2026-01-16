/**
 * Parse API response for card generation.
 */
import { logger } from '@/lib/logger';

export async function parseResponse(response: Response): Promise<unknown> {
  logger.dev('[useCardGeneration] Generation API response:', {
    status: response.status,
    ok: response.ok,
  });

  try {
    const responseText = await response.text();
    logger.dev('[useCardGeneration] Response text received:', {
      preview: responseText.substring(0, 200),
    });
    const data = JSON.parse(responseText);
    logger.dev('[useCardGeneration] Parsed API response data:', data);
    return data;
  } catch (parseError) {
    logger.error('[useCardGeneration] Failed to parse response:', parseError);
    throw new Error('Invalid response from server');
  }
}
