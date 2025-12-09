import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Loader2 } from 'lucide-react';
import type { WizardStep } from '../types';

interface WizardNavigationProps {
  currentStep: WizardStep;
  totalSteps: number;
  loading: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onCancel?: () => void;
}

/**
 * Wizard navigation component
 */
export function WizardNavigation({
  currentStep,
  totalSteps,
  loading,
  onPrevious,
  onNext,
  onSubmit,
  onCancel,
}: WizardNavigationProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        {onCancel && (
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
      </div>
      <div className="flex gap-4">
        {currentStep > 1 && (
          <Button variant="secondary" onClick={onPrevious} disabled={loading}>
            Previous
          </Button>
        )}
        {currentStep < totalSteps ? (
          <Button variant="primary" onClick={onNext} disabled={loading}>
            Next
          </Button>
        ) : (
          <Button variant="primary" onClick={onSubmit} disabled={loading}>
            {loading ? (
              <>
                <Icon icon={Loader2} size="sm" className="animate-spin" aria-hidden={true} />
                Completing...
              </>
            ) : (
              'Complete Onboarding'
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
