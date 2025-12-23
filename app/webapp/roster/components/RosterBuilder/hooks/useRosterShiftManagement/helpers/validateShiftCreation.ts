import type { Shift } from '../../../../../types';

interface ValidateShiftCreationParams {
  shiftData: Partial<Shift>;
  shifts: Shift[];
  editingShiftId: string | null;
}

/**
 * Validate shift creation (max 2 shifts per day per employee)
 */
export function validateShiftCreation({
  shiftData,
  shifts,
  editingShiftId,
}: ValidateShiftCreationParams): { isValid: boolean; error?: string } {
  const dateStr = shiftData.shift_date!;
  const existingShifts = shifts.filter(
    s =>
      s.employee_id === shiftData.employee_id &&
      s.shift_date === dateStr &&
      s.id !== editingShiftId,
  );
  if (existingShifts.length >= 2) {
    return { isValid: false, error: 'Maximum 2 shifts per day allowed' };
  }
  return { isValid: true };
}

