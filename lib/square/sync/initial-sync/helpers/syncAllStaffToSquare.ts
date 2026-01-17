/**
 * Sync all staff/employees from PrepFlow to Square.
 */
import { logger } from '@/lib/logger';
import { syncStaffToSquare } from '../../staff';

/**
 * Sync all staff/employees from PrepFlow to Square.
 */
export async function syncAllStaffToSquare(
  userId: string,
): Promise<{ synced: number; errors: number }> {
  try {
    const result = await syncStaffToSquare(userId);
    return {
      synced: result.synced,
      errors: result.errors,
    };
  } catch (error: unknown) {
    logger.error('[Square Initial Sync] Error syncing staff:', {
      error: error instanceof Error ? error.message : String(error),
      userId,
    });
    return { synced: 0, errors: 1 };
  }
}
