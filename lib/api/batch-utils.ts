/**
 * Batch fetching utilities for optimizing API calls
 * Reduces N+1 query problems by batching multiple requests
 */

/**
 * Chunks an array into smaller arrays of specified size
 */
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Batch size limit for Supabase queries (PostgreSQL has a limit on IN clause items)
 */
export const MAX_BATCH_SIZE = 100;

/**
 * Executes multiple fetch requests in parallel with error handling
 * Returns results in the same order as input, with null for failed requests
 */
export async function fetchInParallel<T>(
  requests: Array<() => Promise<T>>,
  options?: {
    onError?: (error: Error, index: number) => void;
    continueOnError?: boolean;
  },
): Promise<Array<T | null>> {
  const { onError, continueOnError = true } = options || {};

  try {
    const results = await Promise.allSettled(
      requests.map((request, index) =>
        request().catch(error => {
          if (onError) {
            onError(error instanceof Error ? error : new Error(String(error)), index);
          }
          if (!continueOnError) {
            throw error;
          }
          return null;
        }),
      ),
    );

    return results.map(result => (result.status === 'fulfilled' ? result.value : null));
  } catch (error) {
    if (!continueOnError) {
      throw error;
    }
    return requests.map(() => null);
  }
}

/**
 * Executes batched requests with automatic chunking
 * Useful for large arrays that need to be split into smaller batches
 */
export async function fetchInBatches<T, R>(
  items: T[],
  batchFn: (batch: T[]) => Promise<R[]>,
  batchSize: number = MAX_BATCH_SIZE,
): Promise<R[]> {
  if (items.length === 0) {
    return [];
  }

  const chunks = chunkArray(items, batchSize);
  const batchResults = await Promise.all(chunks.map(chunk => batchFn(chunk)));

  return batchResults.flat();
}

/**
 * Groups results by a key function
 */
export function groupBy<T, K extends string | number>(
  array: T[],
  keyFn: (item: T) => K,
): Record<K, T[]> {
  return array.reduce(
    (groups, item) => {
      const key = keyFn(item);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    },
    {} as Record<K, T[]>,
  );
}
