'use client';

interface WizardProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function WizardProgressBar({ currentStep, totalSteps }: WizardProgressBarProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => (
          <div key={step} className="flex flex-1 items-center">
            <div
              className={`h-1 flex-1 rounded-full transition-all duration-200 ${
                step <= currentStep
                  ? 'bg-gradient-to-r from-[#29E7CD] via-[#FF6B00] to-[#D925C7]'
                  : 'bg-[#2a2a2a]'
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
