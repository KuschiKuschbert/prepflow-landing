interface WizardProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

/**
 * Wizard progress bar component
 */
export function WizardProgressBar({ currentStep, totalSteps }: WizardProgressBarProps) {
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between text-sm text-gray-400">
        <span>
          Step {currentStep} of {totalSteps}
        </span>
        <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#2a2a2a]">
        <div
          className="h-full bg-gradient-to-r from-[#29E7CD] to-[#D925C7] transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}
