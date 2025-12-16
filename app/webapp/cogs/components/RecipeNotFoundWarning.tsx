'use client';

interface RecipeNotFoundWarningProps {
  onClearAndRefresh: () => void;
}

export function RecipeNotFoundWarning({ onClearAndRefresh }: RecipeNotFoundWarningProps) {
  return (
    <div className="mb-6 rounded border border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10 px-4 py-3 text-[var(--color-warning)]">
      <p className="font-medium">Recipe not found</p>
      <p className="text-sm text-yellow-300/80">
        The selected recipe may have been deleted. Please select a different recipe or create a new
        one.
      </p>
      <button onClick={onClearAndRefresh} className="mt-2 text-sm underline hover:text-yellow-300">
        Clear selection and refresh
      </button>
    </div>
  );
}
