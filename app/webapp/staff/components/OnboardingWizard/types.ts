import type { Employee } from '@/lib/types/roster';

export interface OnboardingWizardProps {
  employee: Employee;
  onComplete?: () => void;
  onCancel?: () => void;
}

export type WizardStep = 1 | 2 | 3 | 4 | 5;
