import { logger } from '@/lib/logger';

export async function parseResponse(response: Response) {
  try {
    const responseText = await response.text();
    logger.dev(`[Par Levels] POST Response status: ${response.status} ${response.statusText}`);
    logger.dev('[Par Levels] POST Response text:', responseText);
    const result = JSON.parse(responseText);
    logger.dev('[Par Levels] POST Parsed result:', result);
    return result;
  } catch (parseError) {
    logger.error('[Par Levels] POST Parse error:', parseError);
    throw new Error(`Server error (${response.status}). Please check the server logs.`);
  }
}

