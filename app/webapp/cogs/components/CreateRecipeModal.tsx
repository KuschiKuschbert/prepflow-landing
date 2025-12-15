'use client';

import { Icon } from '@/components/ui/Icon';
import { formatDishName } from '@/lib/text-utils';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
  const [loading, setLoading] = useState(false);
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
      setLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = recipeName.trim();

    if (!trimmedName) {
      setError('Recipe name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await onCreateRecipe(trimmedName);
      if (result) {
        onSuccess(result.id, result.recipe_name);
        onClose();
      } else {
        setError("Failed to create recipe. Give it another go, chef.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create recipe');
    } finally {
      setLoading(false);
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
        className="w-full max-w-md rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Create New Recipe</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:text-white focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
            aria-label="Close modal"
          >
            <Icon icon={X} size="md" aria-hidden={true} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="recipe-name" className="mb-2 block text-sm font-medium text-gray-300">
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
              disabled={loading}
              placeholder="e.g., Chicken Curry"
              className="w-full rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white shadow-sm transition-all duration-200 hover:shadow-md focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            {error && (
              <p className="mt-2 text-sm text-red-400" role="alert">
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 font-medium text-white transition-colors hover:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !recipeName.trim()}
              className="flex-1 rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
