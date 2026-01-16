/**
 * Parse par levels API response.
 */
import { logger } from '@/lib/logger';

interface ParseParLevelsResponseParams {
  response: Response;
  showError: (message: string) => void;
}

export async function parseParLevelsResponse({
  response,
  showError,
}: ParseParLevelsResponseParams): Promise<unknown> {
  let result;
  try {
    const responseText = await response.text();
    logger.dev('[Par Levels] Response text:', responseText);
    result = JSON.parse(responseText);
    logger.dev('[Par Levels] Parsed result:', result);
  } catch (parseError) {
    logger.error('[Par Levels] Parse error:', parseError);
    showError(`Server error (${response.status}). Please check the server logs.`);
    return null;
  }
  return result;
}
