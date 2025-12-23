import type { Shift } from '@/app/webapp/roster/types';

/**
 * Finds conflicts between a new shift and existing shifts.
 * @param {Shift} newShift - The new shift to check
 * @param {Shift[]} existingShifts - Existing shifts
 * @returns {{ shiftId: string; message: string } | null} Conflict info or null
 */
export function findShiftConflict(
  newShift: Shift,
  existingShifts: Shift[],
): { shiftId: string; message: string } | null {
  const newStart = new Date(newShift.start_time);
  const newEnd = new Date(newShift.end_time);

  for (const existingShift of existingShifts) {
    if (existingShift.status === 'cancelled') {
      continue;
    }

    const existingStart = new Date(existingShift.start_time);
    const existingEnd = new Date(existingShift.end_time);

    if (
      (newStart >= existingStart && newStart < existingEnd) ||
      (newEnd > existingStart && newEnd <= existingEnd) ||
      (newStart <= existingStart && newEnd >= existingEnd)
    ) {
      return {
        shiftId: existingShift.id,
        message: `Shift overlaps with existing shift on ${existingShift.shift_date}`,
      };
    }
  }

  return null;
}

