'use client';

import type { AggregatedIngredient } from '@/lib/types/prep-lists';

interface IngredientPrepNotesProps {
  ingredient: AggregatedIngredient;
}

export function IngredientPrepNotes({ ingredient }: IngredientPrepNotesProps) {
  if (!ingredient.prepNotes || ingredient.prepNotes.length === 0) {
    return null;
  }

  return (
    <div className="mt-1 flex flex-wrap gap-1">
      {ingredient.prepNotes.map((note, index) => (
        <span
          key={index}
          className="inline-flex items-center rounded-full bg-[var(--primary)]/10 px-2 py-1 text-xs font-medium text-[var(--primary)]"
        >
          {note}
        </span>
      ))}
    </div>
  );
}
