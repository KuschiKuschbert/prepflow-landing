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
      <div className="mb-2 flex items-center justify-between text-sm text-[var(--foreground-muted)]">
        <span>
          Step {currentStep} of {totalSteps}
        </span>
        <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--muted)]">
        <div
          className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}
