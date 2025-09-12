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
  loading = false
}: IngredientWizardNavigationProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex justify-between items-center pt-6 border-t border-[#2a2a2a]">
      <div className="flex items-center space-x-4">
        {!isFirstStep && (
          <button
            type="button"
            onClick={onPrevious}
            disabled={loading}
            className="px-6 py-3 bg-[#2a2a2a] text-white rounded-2xl hover:bg-[#3a3a3a] transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
        )}
        
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-3 bg-red-600/20 text-red-400 rounded-2xl hover:bg-red-600/30 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
            className={`px-8 py-3 rounded-2xl font-medium transition-all duration-200 ${
              canProceed && !loading
                ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 shadow-lg hover:shadow-xl'
                : 'bg-[#2a2a2a] text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                <span>Loading...</span>
              </span>
            ) : (
              <>
                Next →
              </>
            )}
          </button>
        )}

        {isLastStep && (
          <button
            type="button"
            onClick={onSave}
            disabled={!canProceed || loading}
            className={`px-8 py-3 rounded-2xl font-medium transition-all duration-200 ${
              canProceed && !loading
                ? 'bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 shadow-lg hover:shadow-xl'
                : 'bg-[#2a2a2a] text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </span>
            ) : (
              <>
                ✅ Save Ingredient
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
