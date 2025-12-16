'use client';

interface IngredientWizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
  onCancel: () => void;
  canProceed: boolean;
  loading?: boolean;
  onSkipStep2?: () => void;
}

export default function IngredientWizardNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSave,
  onCancel,
  canProceed,
  loading = false,
  onSkipStep2,
}: IngredientWizardNavigationProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex items-center justify-between border-t border-[var(--border)] pt-3">
      <div className="flex items-center space-x-3">
        {!isFirstStep && (
          <button
            type="button"
            onClick={onPrevious}
            disabled={loading}
            className="rounded-xl bg-[var(--muted)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-all duration-200 hover:bg-[var(--surface-variant)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            ← Previous
          </button>
        )}

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-xl bg-red-600/20 px-4 py-2 text-sm font-medium text-[var(--color-error)] transition-all duration-200 hover:bg-red-600/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
      </div>

      <div className="flex items-center space-x-3">
        {currentStep === 2 && onSkipStep2 && (
          <button
            type="button"
            onClick={onSkipStep2}
            disabled={loading}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-medium text-[var(--foreground-muted)] transition-all duration-200 hover:border-[var(--primary)]/50 hover:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Skip Step
          </button>
        )}
        {!isLastStep && (
          <button
            type="button"
            onClick={onNext}
            disabled={!canProceed || loading}
            className={`rounded-xl px-6 py-2 text-sm font-medium transition-all duration-200 ${
              canProceed && !loading
                ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-[var(--button-active-text)] shadow-lg hover:from-[var(--primary)]/80 hover:to-[var(--accent)]/80 hover:shadow-xl'
                : 'cursor-not-allowed bg-[var(--muted)] text-[var(--foreground-muted)]'
            }`}
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <div className="h-3 w-3 animate-spin rounded-full border-b-2 border-gray-400"></div>
                <span>Loading...</span>
              </span>
            ) : (
              <>Next →</>
            )}
          </button>
        )}

        {isLastStep && (
          <button
            type="button"
            onClick={onSave}
            disabled={!canProceed || loading}
            className={`rounded-xl px-6 py-2 text-sm font-medium transition-all duration-200 ${
              canProceed && !loading
                ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--color-info)] text-[var(--button-active-text)] shadow-lg hover:from-[var(--primary)]/80 hover:to-[var(--color-info)]/80 hover:shadow-xl'
                : 'cursor-not-allowed bg-[var(--muted)] text-[var(--foreground-muted)]'
            }`}
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <div className="h-3 w-3 animate-spin rounded-full border-b-2 border-white"></div>
                <span>Saving...</span>
              </span>
            ) : (
              <>Save Ingredient</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
