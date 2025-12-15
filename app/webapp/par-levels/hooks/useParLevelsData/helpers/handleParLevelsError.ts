/**
 * Handle par levels API error.
 */
import { logger } from '@/lib/logger';

interface HandleParLevelsErrorParams {
  response: Response;
  result: any;
  showError: (message: string) => void;
}

export function handleParLevelsError({
  response,
  result,
  showError,
}: HandleParLevelsErrorParams): void {
  const errorMessage =
    result.message || result.error || `Failed to fetch par levels (${response.status})`;
  const instructions = result.details?.instructions || [];
  logger.error('[Par Levels] API Error:', {
    status: response.status,
    error: errorMessage,
    details: result.details,
    code: result.code,
    fullResponse: result,
  });
  showError(
    instructions.length > 0 ? `${errorMessage}\n\n${instructions.join('\n')}` : errorMessage,
  );
  if (instructions.length > 0) logger.dev('[Par Levels] Error Instructions:', instructions);
}
