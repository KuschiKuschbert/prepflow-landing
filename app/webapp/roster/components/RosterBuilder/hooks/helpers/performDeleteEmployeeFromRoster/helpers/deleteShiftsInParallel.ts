/**
 * Delete shifts in parallel.
 */
import type { Shift } from '@/lib/types/roster';

export async function deleteShiftsInParallel(
  employeeShifts: Shift[],
): Promise<{ responses: Response[]; results: unknown[] }> {
  const deletePromises = employeeShifts.map(shift =>
    fetch(`/api/roster/shifts/${shift.id}`, { method: 'DELETE' }),
  );
  const responses = await Promise.all(deletePromises);
  const results = await Promise.all(responses.map(r => r.json()));
  return { responses, results };
}
