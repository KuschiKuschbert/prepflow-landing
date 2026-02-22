'use client';

import { AutosaveStatus } from '@/components/ui/AutosaveStatus';
import { useNotification } from '@/contexts/NotificationContext';
import { useAutosave } from '@/hooks/useAutosave';
import { deriveAutosaveId } from '@/lib/autosave-id';
import { Recipe } from '@/lib/types/recipes';
import React from 'react';

interface RecipeFormProps {
  showForm: boolean;
  newRecipe: Partial<Recipe>;
  onToggleForm: () => void;
  onUpdateRecipe: (updates: Partial<Recipe>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function RecipeForm({
  showForm,
  newRecipe,
  onToggleForm,
  onUpdateRecipe,
  onSubmit,
}: RecipeFormProps) {
  const { showWarning } = useNotification();
  // Autosave integration
  const entityId = deriveAutosaveId('recipes', newRecipe.id as string | undefined, [
    newRecipe.recipe_name || '',
  ]);
  const canAutosave = Boolean(newRecipe.recipe_name);

  const {
    status,
    error: autosaveError,
    saveNow,
  } = useAutosave({
    entityType: 'recipes',
    entityId: entityId,
    data: newRecipe,
    enabled: canAutosave && showForm,
  });

  if (!showForm) return null;

  return (
    <div className="tablet:p-6 mb-6 rounded-lg bg-[var(--surface)] p-4 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="tablet:text-xl text-lg font-semibold">Add Recipe</h2>
        <AutosaveStatus status={status} error={autosaveError} onRetry={saveNow} />
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--foreground-secondary)]">
            Recipe Name *
          </label>
          <input
            type="text"
            required
            value={newRecipe.recipe_name || ''}
            onChange={e => onUpdateRecipe({ recipe_name: e.target.value })}
            className="w-full rounded-md border border-[var(--border)] px-3 py-2 focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
            placeholder="e.g., Chicken Stir-fry"
            onBlur={async e => {
              const name = e.target.value.trim().toLowerCase();
              if (!name) return;
              try {
                const res = await fetch(`/api/recipes/exists?name=${encodeURIComponent(name)}`, {
                  cache: 'no-store',
                });
                const json = await res.json();
                if (json?.exists) {
                  showWarning('A recipe with this name already exists.');
                }
              } catch {}
            }}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--foreground-secondary)]">
            Yield Portions
          </label>
          <input
            type="number"
            min="1"
            value={newRecipe.yield || 1}
            onChange={e => onUpdateRecipe({ yield: parseInt(e.target.value) || 1 })}
            className="w-full rounded-md border border-[var(--border)] px-3 py-2 focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--foreground-secondary)]">
            Instructions
          </label>
          <textarea
            value={newRecipe.instructions || ''}
            onChange={e => onUpdateRecipe({ instructions: e.target.value })}
            rows={4}
            className="w-full rounded-md border border-[var(--border)] px-3 py-2 focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
            placeholder="Step-by-step cooking instructions..."
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-lg bg-green-600 px-6 py-2 text-[var(--foreground)] transition-colors hover:bg-green-700"
          >
            Add Recipe
          </button>
          <button
            type="button"
            onClick={onToggleForm}
            className="rounded-lg bg-[var(--muted)] px-6 py-2 text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]/80"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
