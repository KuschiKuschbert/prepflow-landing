/**
 * Main recipe cards grid component.
 */

import { RecipeCard } from '../../RecipeCard';
import { RecipeCardData } from '../types';

interface MainCardsGridProps {
  cards: RecipeCardData[];
  expandedCardId: string | null;
  onCardClick: (cardId: string) => void;
}

export function MainCardsGrid({ cards, expandedCardId, onCardClick }: MainCardsGridProps) {
  if (cards.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="mb-3 text-lg font-semibold text-[var(--primary)]">Main Recipe Cards</h3>
      <div className="tablet:grid-cols-2 desktop:grid-cols-4 large-desktop:grid-cols-5 grid grid-cols-1 gap-4 transition-all duration-300 ease-in-out">
        {cards.map(card => (
          <RecipeCard
            key={card.id}
            id={card.id}
            title={card.title}
            baseYield={card.baseYield}
            ingredients={card.ingredients}
            methodSteps={card.methodSteps}
            notes={card.notes}
            recipeId={card.recipeId}
            usedByMenuItems={card.usedByMenuItems}
            isExpanded={expandedCardId === card.id}
            onClick={() => onCardClick(card.id)}
          />
        ))}
      </div>
    </div>
  );
}
