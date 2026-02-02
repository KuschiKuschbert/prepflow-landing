import { Ingredient } from '@/lib/types/cogs';

export function handleKeyboardNavigation(
  e: React.KeyboardEvent<HTMLInputElement>,
  filteredIngredients: Ingredient[],
  highlightedIndex: number,
  showSuggestions: boolean,
  selectedIngredient: Ingredient | null,
  setHighlightedIndex: (index: number | ((prev: number) => number)) => void,
  setShowSuggestions: (show: boolean) => void,
  handleIngredientSelect: (ingredient: Ingredient) => void,
): void {
  // Handle Enter key even when suggestions aren't showing but ingredients are available
  if (e.key === 'Enter') {
    if (filteredIngredients.length > 0) {
      e.preventDefault();
      const indexToSelect = highlightedIndex >= 0 ? highlightedIndex : 0;
      if (indexToSelect < filteredIngredients.length) {
        handleIngredientSelect(filteredIngredients[indexToSelect]);
      }
      return;
    }
    // If Enter is pressed and an ingredient is already selected, allow form submission
    if (selectedIngredient) {
      return;
    }
    return;
  }

  if (!showSuggestions || filteredIngredients.length === 0) {
    return;
  }

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      setHighlightedIndex(prev => {
        if (prev < filteredIngredients.length - 1) {
          return prev + 1;
        }
        return prev === -1 ? 0 : prev;
      });
      break;
    case 'ArrowUp':
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
      break;
    case 'Escape':
      e.preventDefault();
      setShowSuggestions(false);
      setHighlightedIndex(-1);
      break;
  }
}
