import { useState, useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';

/**
 * Hook for error log mutations (update status, save notes).
 * Handles API calls for updating error log status and saving admin notes.
 *
 * @param {Function} refresh - Function to refresh error logs after mutation
 * @returns {Object} Mutation functions and loading state
 * @returns {string | null} returns.updatingStatus - ID of error currently being updated
 * @returns {Function} returns.updateStatus - Function to update error status
 * @returns {Function} returns.saveNotes - Function to save admin notes for an error
 */
export function useErrorLogsMutations(refresh: () => Promise<void>) {
  const { showSuccess, showError } = useNotification();
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const updateStatus = useCallback(
    async (errorId: string, newStatus: string) => {
      setUpdatingStatus(errorId);
      try {
        const response = await fetch(`/api/admin/errors/${errorId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });

        if (response.ok) {
          showSuccess('Error status updated successfully');
          await refresh();
          return true;
        } else {
          const data = await response.json();
          showError(data.error || data.message || 'Failed to update status');
          return false;
        }
      } catch (error) {
        logger.error('[useErrorLogsMutations.ts] Error in catch block:', {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });

        showError('Failed to update error status');
        return false;
      } finally {
        setUpdatingStatus(null);
      }
    },
    [refresh, showSuccess, showError],
  );

  const saveNotes = useCallback(
    async (errorId: string, notes: string) => {
      setUpdatingStatus(errorId);
      try {
        const response = await fetch(`/api/admin/errors/${errorId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes }),
        });

        if (response.ok) {
          showSuccess('Notes saved successfully');
          const data = await response.json();
          return data.error;
        } else {
          const data = await response.json();
          showError(data.error || data.message || 'Failed to save notes');
          return null;
        }
      } catch (error) {
        logger.error('[useErrorLogsMutations.ts] Error in catch block:', {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });

        showError('Failed to save notes');
        return null;
      } finally {
        setUpdatingStatus(null);
      }
    },
    [showSuccess, showError],
  );

  return {
    updatingStatus,
    updateStatus,
    saveNotes,
  };
}
