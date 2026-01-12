import { logger } from '@/lib/logger';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Extract column name from Supabase error message.
 *
 * @param {PostgrestError | any} error - Supabase error object
 * @returns {string | null} Column name if found, null otherwise
 */
export function extractColumnName(error: PostgrestError | any): string | null {
  if (!error) return null;
  const errorMessage = error.message || '';
  const errorDetails = error.details || '';
  const errorHint = error.hint || '';
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
 * @param {PostgrestError | any} error - Supabase error object
 * @param {string} context - Context string for logging
 * @param {string} menuId - Menu ID
 */
export function logDetailedError(error: PostgrestError | any, context: string, menuId: string) {
  const errorCode = error?.code;
  const errorMessage = error?.message || '';
  const errorDetails = error?.details || '';
  const errorHint = error?.hint || '';
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
