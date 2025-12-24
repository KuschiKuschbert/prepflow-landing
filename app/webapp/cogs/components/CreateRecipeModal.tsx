'use client';

import { Icon } from '@/components/ui/Icon';
import { formatDishName } from '@/lib/text-utils';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { logger } from '@/lib/logger';

interface CreateRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRecipe: (name: string) => Promise<{ id: string; recipe_name: string } | null>;
  onSuccess: (recipeId: string, recipeName: string) => void;
}

export function CreateRecipeModal({
  isOpen,
  onClose,
  onCreateRecipe,
  onSuccess,
}: CreateRecipeModalProps) {
  const [recipeName, setRecipeName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setRecipeName('');
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = recipeName.trim();

    if (!trimmedName) {
      setError('Recipe name is required');
      return;
    }

    setError(null);

    try {
      const result = await onCreateRecipe(trimmedName);
      if (result) {
        onSuccess(result.id, result.recipe_name);
        onClose();
      } else {
        setError('Failed to create recipe. Give it another go, chef.');
      }
    } catch (err) {
      logger.error('[CreateRecipeModal.tsx] Error in catch block:', {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      });

      setError(err instanceof Error ? err.message : 'Failed to create recipe');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">Create New Recipe</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
            aria-label="Close modal"
          >
            <Icon icon={X} size="md" aria-hidden={true} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="recipe-name"
              className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]"
            >
              Recipe Name
            </label>
            <input
              ref={inputRef}
              id="recipe-name"
              type="text"
              value={recipeName}
              onChange={e => {
                setRecipeName(formatDishName(e.target.value));
                setError(null);
              }}
              placeholder="e.g., Chicken Curry"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] shadow-sm transition-all duration-200 hover:shadow-md focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            {error && (
              <p className="mt-2 text-sm text-[var(--color-error)]" role="alert">
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!recipeName.trim()}
              className="flex-1 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-4 py-3 font-medium text-[var(--button-active-text)] shadow-lg transition-all duration-200 hover:from-[var(--primary)]/80 hover:to-[var(--accent)]/80 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              Create Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
