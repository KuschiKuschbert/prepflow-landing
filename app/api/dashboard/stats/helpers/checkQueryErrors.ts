import { logger } from '@/lib/logger';

interface QueryResult {
  error?: { message: string; code?: string };
}

/**
 * Check for errors in query results and log them
 *
 * @param {QueryResult[]} results - Array of query results
 * @param {string[]} names - Array of names for each query (for logging)
 */
export function checkQueryErrors(results: QueryResult[], names: string[]): void {
  results.forEach((result, index) => {
    if (result.error) {
      logger.error(`[Dashboard Stats API] Error fetching ${names[index]}:`, {
        error: result.error.message,
        code: (result.error as any).code,
        context: { endpoint: '/api/dashboard/stats', operation: 'GET' },
      });
    }
  });
}


