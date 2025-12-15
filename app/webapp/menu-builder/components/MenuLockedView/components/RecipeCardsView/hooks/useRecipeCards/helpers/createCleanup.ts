/**
 * Create cleanup function for recipe cards fetch.
 */
interface CreateCleanupParams {
  abortControllerRef: React.MutableRefObject<AbortController | null>;
  stopPolling: () => void;
}

export function createCleanup({
  abortControllerRef,
  stopPolling,
}: CreateCleanupParams): () => void {
  return () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    stopPolling();
  };
}
