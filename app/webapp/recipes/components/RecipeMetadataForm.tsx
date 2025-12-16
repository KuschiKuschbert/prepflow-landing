'use client';
import { useNotification } from '@/contexts/NotificationContext';
import { Recipe } from '../types';

interface RecipeMetadataFormProps {
  recipe: Recipe;
  editedName: string;
  editedYield: number;
  editedInstructions: string;
  onNameChange: (name: string) => void;
  onYieldChange: (recipeYield: number) => void;
  onInstructionsChange: (instructions: string) => void;
}

export function RecipeMetadataForm({
  recipe,
  editedName,
  editedYield,
  editedInstructions,
  onNameChange,
  onYieldChange,
  onInstructionsChange,
}: RecipeMetadataFormProps) {
  const { showWarning } = useNotification();
  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">Recipe Name *</label>
        <input
          type="text"
          required
          value={editedName}
          onChange={e => onNameChange(e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
          placeholder="e.g., Chicken Stir-fry"
          onBlur={async e => {
            const name = e.target.value.trim().toLowerCase();
            if (!name || name === recipe.recipe_name.toLowerCase()) return;
            try {
              const res = await fetch(`/api/recipes/exists?name=${encodeURIComponent(name)}`, {
                cache: 'no-store',
              });
              const json = await res.json();
              if (json?.exists) showWarning('A recipe with this name already exists.');
            } catch {}
          }}
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">Yield Portions</label>
        <input
          type="number"
          min="1"
          value={editedYield}
          onChange={e => onYieldChange(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">Instructions</label>
        <textarea
          value={editedInstructions}
          onChange={e => onInstructionsChange(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
          placeholder="Step-by-step cooking instructions..."
        />
      </div>
    </div>
  );
}
