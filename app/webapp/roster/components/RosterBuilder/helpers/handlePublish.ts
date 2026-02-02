/**
 * Handle publish draft shifts.
 */
import type { Shift } from '@/lib/types/roster';
import { logger } from '@/lib/logger';

export function createPublishHandler(
  shifts: Shift[],
  publishShifts: (shiftIds: string[]) => void,
  setLoading: (loading: boolean) => void,
  showError: (message: string) => void,
  showSuccess: (message: string) => void,
) {
  return async () => {
    const draftShifts = shifts.filter(s => s.status === 'draft');
    if (draftShifts.length === 0) {
      showError('No draft shifts to publish');
      return;
    }
    setLoading(true);
    try {
      const shiftIds = draftShifts.map(s => s.id);
      publishShifts(shiftIds);
      showSuccess(`${draftShifts.length} shift(s) published successfully`);
    } catch (error) {
      logger.error('[handlePublish.ts] Error in catch block:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      showError('Failed to publish shifts');
    } finally {
      setLoading(false);
    }
  };
}
