import { logger } from '@/lib/logger';

/**
 * Extract column name from Supabase error message.
 *
 * @param {unknown} error - Supabase error object
 * @returns {string | null} Column name if found, null otherwise
 */
export function extractColumnName(error: unknown): string | null {
  if (!error || typeof error !== 'object') return null;

  const err = error as Record<string, unknown>;
  const errorMessage = err.message || '';
  const errorDetails = err.details || '';
  const errorHint = err.hint || '';
  const fullErrorText = `${errorMessage} ${errorDetails} ${errorHint}`;
  const columnMatch = fullErrorText.match(
    /column\s+["']?([\w.]+)["']?\s+(?:does\s+not\s+exist|not\s+found)/i,
  );
  if (columnMatch && columnMatch[1]) return columnMatch[1];
  const columnMatch2 = fullErrorText.match(/could\s+not\s+find\s+column[:\s]+([\w.]+)/i);
  if (columnMatch2 && columnMatch2[1]) return columnMatch2[1];
  return null;
}

/**
 * Log detailed error information for debugging.
 *
 * @param {unknown} error - Supabase error object
 * @param {string} context - Context string for logging
 * @param {string} menuId - Menu ID
 */
export function logDetailedError(error: unknown, context: string, menuId: string) {
  if (!error || typeof error !== 'object') {
    logger.error(`[Menus API] ${context}: Unknown error`, { error, menuId });
    return;
  }

  const err = error as Record<string, unknown>;
  const errorCode = err.code;
  const errorMessage = err.message || '';
  const errorDetails = err.details || '';
  const errorHint = err.hint || '';
  const columnName = extractColumnName(error);
  logger.error(`[Menus API] ${context}:`, {
    error: errorMessage,
    code: errorCode,
    details: errorDetails,
    hint: errorHint,
    columnName: columnName || 'unknown',
    fullError: process.env.NODE_ENV === 'development' ? error : undefined,
    context: { endpoint: '/api/menus/[id]', operation: 'GET', menuId },
  });
}
