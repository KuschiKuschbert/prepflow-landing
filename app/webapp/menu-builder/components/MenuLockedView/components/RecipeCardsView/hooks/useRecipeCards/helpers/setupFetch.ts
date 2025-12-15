/**
 * Setup fetch function for recipe cards.
 */
interface SetupFetchParams {
  menuId: string;
  isPollingCheck: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  abortControllerRef: React.MutableRefObject<AbortController | null>;
  fetchCards: (menuId: string, signal: AbortSignal) => Promise<any>;
  updateCards: (params: any) => void;
  handleFetchError: (params: any) => void;
  startPolling: (callback: () => void) => void;
  stopPolling: () => void;
  onError?: (error: string) => void;
}

export async function setupFetch({
  menuId,
  isPollingCheck,
  setLoading,
  setError,
  abortControllerRef,
  fetchCards,
  updateCards,
  handleFetchError,
  startPolling,
  stopPolling,
  onError,
}: SetupFetchParams): Promise<void> {
  if (!isPollingCheck) {
    setLoading(true);
  }
  setError(null);
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
  }
  const controller = new AbortController();
  abortControllerRef.current = controller;
  const result = await fetchCards(menuId, controller.signal);
  if (controller.signal.aborted) return;
  updateCards({
    result,
    setCards: (fn: any) => fn,
    setSubRecipeCards: (fn: any) => fn,
    setLoading,
    setError,
    startPolling,
    stopPolling,
    performFetch: () =>
      setupFetch({
        menuId,
        isPollingCheck: true,
        setLoading,
        setError,
        abortControllerRef,
        fetchCards,
        updateCards,
        handleFetchError,
        startPolling,
        stopPolling,
        onError,
      }),
  });
}
