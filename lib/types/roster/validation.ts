import type { Shift } from './shift';

export interface RosterWeek {
  startDate: Date;
  endDate: Date;
  shifts: Shift[];
}

export interface ShiftValidationWarning {
  type: 'availability_clash' | 'skill_gap' | 'compliance_violation' | 'overlap';
  message: string;
  shiftId: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ComplianceValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  violations: Array<{
    rule: string;
    message: string;
    severity: 'error' | 'warning';
  }>;
}
