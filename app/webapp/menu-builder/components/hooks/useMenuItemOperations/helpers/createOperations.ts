/**
 * Create menu item operations from specialized hook results.
 */
interface CreateOperationsParams {
  additionResult: {
    handleCategorySelect: (
      category: string,
      selectedItem: { type: 'dish' | 'recipe'; id: string; name: string } | null,
    ) => Promise<void>;
  };
  removalResult: {
    handleRemoveItem: (itemId: string, onConfirm: () => void) => void;
    performRemoveItem: (itemId: string, itemName: string) => Promise<void>;
  };
  reorderResult: {
    handleMoveUp: (itemId: string) => Promise<void>;
    handleMoveDown: (itemId: string) => Promise<void>;
    performReorder: (activeId: string, overId: string, category: string) => Promise<void>;
  };
  categoryResult: {
    handleMoveToCategory: (itemId: string, targetCategory: string) => Promise<void>;
    performMoveToCategory: (itemId: string, targetCategory: string, item: any) => Promise<void>;
  };
  priceResult: { handleUpdateActualPrice: (itemId: string, price: number | null) => Promise<void> };
}

export function createOperations({
  additionResult,
  removalResult,
  reorderResult,
  categoryResult,
  priceResult,
}: CreateOperationsParams) {
  return {
    handleCategorySelect: additionResult.handleCategorySelect,
    handleRemoveItem: removalResult.handleRemoveItem,
    performRemoveItem: removalResult.performRemoveItem,
    handleMoveUp: reorderResult.handleMoveUp,
    handleMoveDown: reorderResult.handleMoveDown,
    performReorder: reorderResult.performReorder,
    handleMoveToCategory: categoryResult.handleMoveToCategory,
    handleUpdateActualPrice: priceResult.handleUpdateActualPrice,
    performMoveToCategory: categoryResult.performMoveToCategory,
  };
}
