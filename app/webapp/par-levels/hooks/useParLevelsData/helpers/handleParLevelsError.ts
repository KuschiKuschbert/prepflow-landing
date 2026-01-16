/**
 * Handle par levels API error.
 */
import { logger } from '@/lib/logger';

interface HandleParLevelsErrorParams {
  response: Response;
  result: unknown;
  showError: (message: string) => void;
}

export function handleParLevelsError({
  response,
  result,
  showError,
}: HandleParLevelsErrorParams): void {
  const res = result as { message?: string; error?: string; code?: string; details?: { instructions?: string[] } };
  const errorMessage =
    res.message || res.error || `Failed to fetch par levels (${response.status})`;
  const instructions = res.details?.instructions || [];
  logger.error('[Par Levels] API Error:', {
    status: response.status,
    error: errorMessage,
    details: res.details,
    code: res.code,
    fullResponse: res,
  });
  showError(
    instructions.length > 0 ? `${errorMessage}\n\n${instructions.join('\n')}` : errorMessage,
  );
  if (instructions.length > 0) logger.dev('[Par Levels] Error Instructions:', instructions);
}
