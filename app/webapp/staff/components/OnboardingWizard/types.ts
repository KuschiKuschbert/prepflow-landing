import type { Employee } from '@/app/webapp/roster/types';

export interface OnboardingWizardProps {
  employee: Employee;
  onComplete?: () => void;
  onCancel?: () => void;
}

export type WizardStep = 1 | 2 | 3 | 4 | 5;
