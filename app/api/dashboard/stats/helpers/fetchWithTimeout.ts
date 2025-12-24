/**
 * Fetch with timeout wrapper to prevent hanging database queries
 *
 * @param {Promise<T>} promise - Promise to wrap
 * @param {number} timeoutMs - Timeout in milliseconds (default: 10000)
 * @returns {Promise<T>} Promise that rejects on timeout
 */
export async function fetchWithTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 10000,
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Database query timeout')), timeoutMs),
    ),
  ]);
}
