/**
 * Sub-recipe card sections component.
 */

import { RecipeCard } from '../../RecipeCard';
import { RecipeCardData } from '../types';

interface SubRecipeSectionsProps {
  subRecipeCards: {
    sauces: RecipeCardData[];
    marinades: RecipeCardData[];
    brines: RecipeCardData[];
    slowCooked: RecipeCardData[];
    other: RecipeCardData[];
  };
  expandedCardId: string | null;
  onCardClick: (cardId: string) => void;
}

export function SubRecipeSections({
  subRecipeCards,
  expandedCardId,
  onCardClick,
}: SubRecipeSectionsProps) {
  return (
    <div className="space-y-8">
      {/* Sauces */}
      {subRecipeCards.sauces.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-semibold text-[#29E7CD]">Sauces</h3>
          <div className="tablet:grid-cols-2 desktop:grid-cols-4 large-desktop:grid-cols-5 grid grid-cols-1 gap-4 transition-all duration-300 ease-in-out">
            {subRecipeCards.sauces.map(card => (
              <RecipeCard
                key={`sauce-${card.id}`}
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
      )}

      {/* Marinades */}
      {subRecipeCards.marinades.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-semibold text-[#29E7CD]">Marinades</h3>
          <div className="tablet:grid-cols-2 desktop:grid-cols-4 large-desktop:grid-cols-5 grid grid-cols-1 gap-4 transition-all duration-300 ease-in-out">
            {subRecipeCards.marinades.map(card => (
              <RecipeCard
                key={`marinade-${card.id}`}
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
      )}

      {/* Brines */}
      {subRecipeCards.brines.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-semibold text-[#29E7CD]">Brines</h3>
          <div className="tablet:grid-cols-2 desktop:grid-cols-4 large-desktop:grid-cols-5 grid grid-cols-1 gap-4 transition-all duration-300 ease-in-out">
            {subRecipeCards.brines.map(card => (
              <RecipeCard
                key={`brine-${card.id}`}
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
      )}

      {/* Slow-Cooked Items */}
      {subRecipeCards.slowCooked.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-semibold text-[#29E7CD]">Slow-Cooked Items</h3>
          <div className="tablet:grid-cols-2 desktop:grid-cols-4 large-desktop:grid-cols-5 grid grid-cols-1 gap-4 transition-all duration-300 ease-in-out">
            {subRecipeCards.slowCooked.map(card => (
              <RecipeCard
                key={`slow-cooked-${card.id}`}
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
      )}

      {/* Other Prep Items */}
      {subRecipeCards.other.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-semibold text-[#29E7CD]">Other Prep Items</h3>
          <div className="tablet:grid-cols-2 desktop:grid-cols-4 large-desktop:grid-cols-5 grid grid-cols-1 gap-4 transition-all duration-300 ease-in-out">
            {subRecipeCards.other.map(card => (
              <RecipeCard
                key={`other-${card.id}`}
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
      )}
    </div>
  );
}
