'use client';

import { Recipe } from '../types';

interface DeleteConfirmationModalProps {
  show?: boolean;
  recipe?: Recipe | null;
  itemName?: string;
  itemType?: string;
  capitalizeRecipeName?: (name: string) => string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationModal({
  show = true,
  recipe,
  itemName,
  itemType = 'item',
  capitalizeRecipeName,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  const displayName = recipe
    ? capitalizeRecipeName
      ? capitalizeRecipeName(recipe.recipe_name)
      : recipe.recipe_name
    : itemName || 'this item';

  const itemTypeLabel = recipe ? 'recipe' : itemType;

  if (!show && !recipe && !itemName) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 via-[var(--tertiary)]/20 to-[var(--primary)]/20 p-[1px] shadow-2xl">
        <div className="rounded-2xl bg-[var(--surface)]/95">
          <div className="border-b border-[var(--border)] p-6">
            <div className="flex items-center">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[var(--color-error)] to-[#dc2626]">
                <svg
                  className="h-6 w-6 text-[var(--button-active-text)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--foreground)]">
                  Delete {itemTypeLabel.charAt(0).toUpperCase() + itemTypeLabel.slice(1)}
                </h3>
                <p className="text-sm text-[var(--foreground-muted)]">This action can&apos;t be undone</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <p className="mb-6 text-[var(--foreground-secondary)]">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-[var(--foreground)]">&quot;{displayName}&quot;</span>? This will
              permanently remove the {itemTypeLabel} and all its associated data.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 rounded-xl bg-[var(--surface)] px-4 py-3 font-medium text-[var(--foreground-secondary)] transition-all duration-200 hover:bg-[var(--muted)]"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 rounded-xl bg-gradient-to-r from-[var(--color-error)] to-[#dc2626] px-4 py-3 font-medium text-[var(--button-active-text)] shadow-lg transition-all duration-200 hover:from-[var(--color-error)]/80 hover:to-[#dc2626]/80 hover:shadow-xl"
              >
                Delete {itemTypeLabel.charAt(0).toUpperCase() + itemTypeLabel.slice(1)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
