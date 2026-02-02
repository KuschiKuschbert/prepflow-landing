'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { SectionData } from '@/lib/types/prep-lists';

interface PrepListRecipeGroupedViewProps {
  section: SectionData;
}

export function PrepListRecipeGroupedView({ section }: PrepListRecipeGroupedViewProps) {
  return (
    <div className="space-y-4">
      {section.recipeGrouped.map((recipe, recipeIndex) => (
        <div
          key={recipeIndex}
          className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-4"
        >
          <div className="mb-3">
            <h4 className="font-semibold text-[var(--foreground)]">{recipe.recipeName}</h4>
            {recipe.dishName && (
              <p className="text-sm text-[var(--foreground-muted)]">From: {recipe.dishName}</p>
            )}
          </div>
          <div className="space-y-2">
            {recipe.ingredients.map((ing, ingIndex) => (
              <div
                key={ingIndex}
                className="flex items-center justify-between rounded-lg bg-[var(--surface)] px-3 py-2"
              >
                <div className="flex-1">
                  <span className="text-sm text-[var(--foreground-secondary)]">{ing.name}</span>
                  {ing.prepNotes && ing.prepNotes.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {ing.prepNotes.map((note, noteIndex) => (
                        <span
                          key={noteIndex}
                          className="inline-flex items-center rounded-full bg-[var(--primary)]/10 px-1.5 py-0.5 text-xs font-medium text-[var(--primary)]"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="ml-4 text-sm font-medium text-[var(--foreground)]">
                  {ing.quantity} {ing.unit}
                </span>
              </div>
            ))}
          </div>
          {recipe.instructions && (
            <RecipeInstructions instructions={recipe.instructions} recipeName={recipe.recipeName} />
          )}
        </div>
      ))}
    </div>
  );
}

function RecipeInstructions({
  instructions,
  recipeName: _recipeName,
}: {
  instructions: string;
  recipeName: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-4 rounded-lg border border-[var(--primary)]/20 bg-[var(--primary)]/5">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-[var(--primary)]/10"
      >
        <span className="text-sm font-semibold text-[var(--primary)]">Prep Instructions</span>
        <Icon
          icon={isExpanded ? ChevronUp : ChevronDown}
          size="sm"
          className="text-[var(--primary)]"
          aria-hidden={true}
        />
      </button>
      {isExpanded && (
        <div className="border-t border-[var(--primary)]/20 p-3">
          <div className="text-sm whitespace-pre-wrap text-[var(--foreground-secondary)]">
            {instructions}
          </div>
        </div>
      )}
    </div>
  );
}
