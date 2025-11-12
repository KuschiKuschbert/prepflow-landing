import { Ingredient } from '../../types';

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
  if (!showSuggestions || filteredIngredients.length === 0) {
    if (e.key === 'Enter' && selectedIngredient) {
      return;
    }
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
    case 'Enter':
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredIngredients.length) {
        handleIngredientSelect(filteredIngredients[highlightedIndex]);
      } else if (highlightedIndex === -1 && filteredIngredients.length > 0) {
        handleIngredientSelect(filteredIngredients[0]);
      }
      break;
    case 'Escape':
      e.preventDefault();
      setShowSuggestions(false);
      setHighlightedIndex(-1);
      break;
  }
}
