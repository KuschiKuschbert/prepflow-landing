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
}: IngredientWizardNavigationProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex items-center justify-between border-t border-[#2a2a2a] pt-6">
      <div className="flex items-center space-x-4">
        {!isFirstStep && (
          <button
            type="button"
            onClick={onPrevious}
            disabled={loading}
            className="rounded-2xl bg-[#2a2a2a] px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-[#3a3a3a] disabled:cursor-not-allowed disabled:opacity-50"
          >
            ← Previous
          </button>
        )}

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-2xl bg-red-600/20 px-6 py-3 font-medium text-red-400 transition-all duration-200 hover:bg-red-600/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
      </div>

      <div className="flex items-center space-x-4">
        {!isLastStep && (
          <button
            type="button"
            onClick={onNext}
            disabled={!canProceed || loading}
            className={`rounded-2xl px-8 py-3 font-medium transition-all duration-200 ${
              canProceed && !loading
                ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white shadow-lg hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 hover:shadow-xl'
                : 'cursor-not-allowed bg-[#2a2a2a] text-gray-400'
            }`}
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-400"></div>
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
            className={`rounded-2xl px-8 py-3 font-medium transition-all duration-200 ${
              canProceed && !loading
                ? 'bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white shadow-lg hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 hover:shadow-xl'
                : 'cursor-not-allowed bg-[#2a2a2a] text-gray-400'
            }`}
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                <span>Saving...</span>
              </span>
            ) : (
              <>✅ Save Ingredient</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
