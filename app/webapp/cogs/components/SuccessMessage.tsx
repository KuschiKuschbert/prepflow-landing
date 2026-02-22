'use client';

interface SuccessMessageProps {
  message: string | null;
  onClose: () => void;
}

export function SuccessMessage({ message, onClose }: SuccessMessageProps) {
  if (!message) return null;

  // Check if this is a recipe loaded message (smaller) vs recipe saved message (larger)
  const isRecipeLoaded = message.toLowerCase().includes('loaded for editing');
  const isRecipeSaved =
    message.toLowerCase().includes('saved successfully') ||
    message.toLowerCase().includes('added to the recipe book');

  // Smaller notification for recipe loaded
  if (isRecipeLoaded) {
    return (
      <div className="animate-in slide-in-from-top-2 mb-4 rounded-lg border border-[var(--color-success)]/50 bg-[var(--color-success)]/20 px-4 py-2.5 text-sm text-[var(--color-success)] shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-[var(--color-success)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="font-medium">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-2 rounded-full p-1 text-[var(--color-success)] transition-colors hover:bg-[var(--color-success)]/30 hover:text-[var(--color-success)]"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // Larger notification for recipe saved
  return (
    <div className="animate-in slide-in-from-top-2 mb-6 scale-105 transform rounded-2xl border-2 border-[var(--color-success)] bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-5 text-[var(--button-active-text)] shadow-2xl transition-all duration-300 duration-500 hover:scale-110">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="flex h-10 w-10 animate-pulse items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <svg
              className="h-6 w-6 text-[var(--foreground)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-lg font-bold text-[var(--foreground)]">{message}</p>
          {isRecipeSaved && (
            <p className="mt-1 text-sm font-medium text-[var(--color-success)]">
              Your recipe has been added to the Recipe Book and is ready to use!
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 rounded-full p-2 text-[var(--foreground-muted)] transition-all duration-200 hover:bg-white/20 hover:text-[var(--foreground)]"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
