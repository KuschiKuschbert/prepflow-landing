/**
 * Update cards state based on fetch result.
 */
interface UpdateCardsParams {
  result: { success: boolean; cards?: any[]; subRecipeCards?: any[]; error?: string };
  setCards: React.Dispatch<React.SetStateAction<any[]>>;
  setSubRecipeCards: React.Dispatch<React.SetStateAction<any[]>>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  startPolling: (callback: () => void) => void;
  stopPolling: () => void;
  performFetch: (isPollingCheck: boolean) => Promise<void>;
}

export function updateCards({
  result,
  setCards,
  setSubRecipeCards,
  setLoading,
  setError,
  startPolling,
  stopPolling,
  performFetch,
}: UpdateCardsParams): void {
  if (result.success) {
    if (result.cards) {
      setCards(prevCards => {
        const newCardCount = result.cards!.length;
        const currentCardCount = prevCards.length;
        if (newCardCount > currentCardCount || currentCardCount === 0) {
          if (newCardCount > 0) {
            stopPolling();
          }
          return result.cards!;
        }
        return prevCards;
      });
    }
    if (result.subRecipeCards) {
      setSubRecipeCards(result.subRecipeCards);
    }
    setLoading(false);
    if (result.cards && result.cards.length === 0) {
      startPolling(() => performFetch(true));
    }
  } else {
    setError(result.error || 'Failed to load recipe cards');
    setLoading(false);
  }
}
